import fs from 'fs';
import path from 'path';

const baseDir = path.resolve('static/orders');

export async function GET({ params }) {
  const workorder = params.workorder;

  // Breakdown the workorder
  const year = workorder.slice(0, 2);  // "25"
  const week = workorder.slice(2, 4);  // "32"
  const rawNum = workorder.slice(4);   // "0010"
  const folder = String(parseInt(rawNum, 10)).padStart(2, '0');  // "10"

  const folderPath = path.join(baseDir, year, week, folder);
  const orderPath = path.join(folderPath, 'order.json');

  if (!fs.existsSync(orderPath)) {
    console.error(`❌ Order not found at: ${orderPath}`);
    return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 });
  }

  const data = JSON.parse(fs.readFileSync(orderPath, 'utf-8'));

  return new Response(JSON.stringify({ order: data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
