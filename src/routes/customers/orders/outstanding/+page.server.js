// example +page.server.js
import fs from 'fs';
import path from 'path';

export async function load() {
  const baseDir = 'orders'; // adjust if needed
  const orders = [];

  function readOrders(dir) {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        readOrders(fullPath);
      } else if (entry === 'order.json') {
        const order = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
        orders.push(order);
      }
    }
  }

  readOrders(baseDir);

  return { orders };
}
