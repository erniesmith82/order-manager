import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correct path to your real static/orders folder
const baseDir = path.resolve(__dirname, '../../../../static/orders');

export async function POST({ request }) {
  const data = await request.json();
  const { order, patient, liner, foot } = data;

  try {
    const workorder = order.workorder || '';

    if (!/^\d{8}$/.test(workorder)) {
      throw new Error(`Invalid workorder format: ${workorder}`);
    }

    const year = workorder.slice(0, 2);            // e.g. "25"
    const week = workorder.slice(2, 4);            // e.g. "32"
    const rawOrderNum = workorder.slice(4);        // e.g. "0001"
    const orderNumber = parseInt(rawOrderNum, 10).toString().padStart(2, '0');  // e.g. "01"

    const folderPath = path.join(baseDir, year, week, orderNumber);

    fs.mkdirSync(folderPath, { recursive: true });

    fs.writeFileSync(
      path.join(folderPath, 'order.json'),
      JSON.stringify({ order, patient, liner, foot }, null, 2)
    );

    return new Response(JSON.stringify({ success: true, workorder }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('Failed to write order:', err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
