import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to save orders
const baseDir = path.resolve(__dirname, '../../../../static/orders');

export async function POST({ request }) {
  const formData = await request.formData();

  const file = formData.get('file');             // 📎 Uploaded file (optional)
  const printFile = formData.get('printFile');   // 🖼️ Generated JPG of order form

  const order = JSON.parse(formData.get('order'));
  const patient = JSON.parse(formData.get('patient'));
  const liner = JSON.parse(formData.get('liner'));
  const foot = JSON.parse(formData.get('foot'));

  try {
    // 🔢 Generate workorder number
    const workorder = getNextWorkorderNumber(baseDir);
    order.workorder = workorder;

    if (!/^\d{8}$/.test(workorder)) {
      throw new Error(`Invalid workorder format: ${workorder}`);
    }

    // 🗂️ Build folder structure: /YY/WW/NN
    const year = workorder.slice(0, 2);
    const week = workorder.slice(2, 4);
    const rawOrderNum = workorder.slice(4);
    const orderNumber = parseInt(rawOrderNum, 10).toString().padStart(2, '0');
    const folderPath = path.join(baseDir, year, week, orderNumber);

    fs.mkdirSync(folderPath, { recursive: true });

    // ✅ Save order.json
    fs.writeFileSync(
      path.join(folderPath, 'order.json'),
      JSON.stringify({ order, patient, liner, foot }, null, 2)
    );

    // ✅ Save uploaded file (e.g., scan or reference image)
    if (file && file.name) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filePath = path.join(folderPath, file.name);
      fs.writeFileSync(filePath, buffer);
    }

    // ✅ Save generated JPG of order form
    if (printFile && typeof printFile.arrayBuffer === 'function') {
      const printBuffer = Buffer.from(await printFile.arrayBuffer());
      const printPath = path.join(folderPath, 'printable.jpg'); // ✅ FIXED extension
      fs.writeFileSync(printPath, printBuffer);
    }

    // ✅ Respond with success and workorder number
    return new Response(JSON.stringify({ success: true, workorder }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('❌ Failed to write order:', err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 🔢 Generate workorder: YYWW00NN format
function getNextWorkorderNumber(baseDir) {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const start = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now - start) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + start.getDay() + 1) / 7);
  const yy = year;
  const ww = String(week).padStart(2, '0');
  const weekPath = path.join(baseDir, yy, ww);

  let nextOrderNum = 1;

  if (fs.existsSync(weekPath)) {
    const existing = fs.readdirSync(weekPath, { withFileTypes: true });
    const nums = existing
      .filter(dirent => dirent.isDirectory() && /^\d{2}$/.test(dirent.name))
      .map(dirent => parseInt(dirent.name, 10))
      .sort((a, b) => b - a);

    if (nums.length > 0) {
      nextOrderNum = nums[0] + 1;
    }
  }

  const padded = String(nextOrderNum).padStart(2, '0');
  return `${yy}${ww}00${padded}`; // e.g., "25320001"
}
