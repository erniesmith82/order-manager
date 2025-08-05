import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDir = path.resolve(__dirname, '../../../../static/orders');

export async function GET({ params }) {
  const workorder = params.workorder;
  const year = workorder.slice(0, 2);
  const week = workorder.slice(2, 4);
  const rawOrderNum = workorder.slice(4);

  // FIXED: pad to 4 digits
  const orderNumber = parseInt(rawOrderNum, 10).toString().padStart(4, '0');

  const orderPath = path.join(baseDir, year, week, orderNumber, 'order.json');

  try {
    const order = JSON.parse(fs.readFileSync(orderPath, 'utf-8'));
    return new Response(JSON.stringify({ order }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 });
  }
}
