// /src/routes/api/submit-order/+server.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define baseDir pointing to /static/orders
const baseDir = path.resolve(__dirname, '../../../static/orders');

export async function POST({ request }) {
  const data = await request.json();
  const { order, patient, liner, foot } = data;

  try {
    const workorder = order.workorder || '';
    const year = workorder.slice(0, 2);
    const week = workorder.slice(2, 4);
    const rawOrderNum = workorder.slice(4);
    const orderNumber = parseInt(rawOrderNum, 10).toString().padStart(2, '0');

    const folderPath = path.join(baseDir, year, week, orderNumber);

    // Make sure folders exist
    fs.mkdirSync(folderPath, { recursive: true });

    // Save full order
    fs.writeFileSync(
      path.join(folderPath, 'order.json'),
      JSON.stringify({ patient, order, liner, foot }, null, 2)
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    console.error('Error saving order:', err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500
    });
  }
}
