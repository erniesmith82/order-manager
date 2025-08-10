// Loads order data from static/orders/YY/WW/NN/order.json
import fs from 'fs';
import path from 'path';

const baseDir = path.resolve('static/orders');

export async function load({ params }) {
  const workorder = params.workorder;             // e.g. "25060001"
  if (!/^\d{8}$/.test(workorder)) {
    return { status: 400, error: new Error('Invalid workorder id') };
  }

  const yy   = workorder.slice(0, 2);
  const ww   = workorder.slice(2, 4);
  const nn   = workorder.slice(6);
  const dir  = path.join(baseDir, yy, ww, nn);
  const file = path.join(dir, 'order.json');

  if (!fs.existsSync(file)) {
    return { status: 404, error: new Error('Order not found') };
  }

  const { order, patient, liner, foot } = JSON.parse(fs.readFileSync(file, 'utf8'));
  return { order, patient, liner, foot, workorder };
}
