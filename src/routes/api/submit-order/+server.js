import fs from 'fs';
import path from 'path';

// ✅ Define your target paths relative to project root
const baseDir = path.resolve('static/orders');
const usersFile = path.resolve('static/data/users.json');

// 🔧 Helper: Get next workorder number
function getNextWorkorderNumber(baseDir) {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const week = String(getWeekNumber(now)).padStart(2, '0');

  const yearDir = path.join(baseDir, year);
  const weekDir = path.join(yearDir, week);

  if (!fs.existsSync(weekDir)) {
    fs.mkdirSync(weekDir, { recursive: true });
  }

  const existing = fs.readdirSync(weekDir).filter(name => /^\d{2}$/.test(name));
  const nextIndex = (existing.length + 1).toString().padStart(2, '0');

  return `${year}${week}00${nextIndex}`;
}

function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// 📥 POST handler
export async function POST({ request }) {
  const formData = await request.formData();

  const file = formData.get('file');
  const printFile = formData.get('printFile');            // JPG
  const printSummary = formData.get('printSummary');      // PDF ✅

  const order = JSON.parse(formData.get('order'));
  const patient = JSON.parse(formData.get('patient'));
  const liner = JSON.parse(formData.get('liner'));
  const foot = JSON.parse(formData.get('foot'));

  try {
    // Load user list and match facility
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    const customerUser = users.find(u => u.role === 'customer' && u.facilities);
    const selectedFacility = customerUser?.facilities.find(f => f.name === patient.facility);

    const submittingUserEmail = customerUser?.email || 'unknown@noemail.com';
    order.submittedBy = submittingUserEmail;

    if (selectedFacility) {
      patient.facilityDetails = selectedFacility;
    }

    const workorder = getNextWorkorderNumber(baseDir);
    order.workorder = workorder;

    const now = new Date();
    order.receivedDate = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${now.getFullYear()}`;

    if (!/^\d{8}$/.test(workorder)) {
      throw new Error(`Invalid workorder format: ${workorder}`);
    }

    const year = workorder.slice(0, 2);
    const week = workorder.slice(2, 4);
    const rawOrderNum = workorder.slice(4);
    const orderNumber = parseInt(rawOrderNum, 10).toString().padStart(2, '0');
    const folderPath = path.join(baseDir, year, week, orderNumber);

    fs.mkdirSync(folderPath, { recursive: true });

    // Save order.json
    fs.writeFileSync(
      path.join(folderPath, 'order.json'),
      JSON.stringify({ order, patient, liner, foot }, null, 2)
    );

    // Save uploaded file
    if (file && file.name) {
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(path.join(folderPath, file.name), buffer);
    }

    // Save printable.jpg
    if (printFile && typeof printFile.arrayBuffer === 'function') {
      const printBuffer = Buffer.from(await printFile.arrayBuffer());
      fs.writeFileSync(path.join(folderPath, 'printable.jpg'), printBuffer);
    }

    // ✅ Save print-summary.pdf
    if (printSummary && typeof printSummary.arrayBuffer === 'function') {
      const summaryBuffer = Buffer.from(await printSummary.arrayBuffer());
      fs.writeFileSync(path.join(folderPath, 'print-summary.pdf'), summaryBuffer);
    }

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
