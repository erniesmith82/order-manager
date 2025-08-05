// src/routes/api/get-orders/+server.js
import fs from 'fs';
import path from 'path';

const baseDir = path.resolve('static/orders');

export async function GET() {
  const orders = [];

  try {
    const years = fs.readdirSync(baseDir);

    for (const year of years) {
      const yearPath = path.join(baseDir, year);
      if (!fs.statSync(yearPath).isDirectory()) continue;

      const weeks = fs.readdirSync(yearPath);

      for (const week of weeks) {
        const weekPath = path.join(yearPath, week);
        if (!fs.statSync(weekPath).isDirectory()) continue;

        const ordersInWeek = fs.readdirSync(weekPath);

        for (const orderNum of ordersInWeek) {
          const orderPath = path.join(weekPath, orderNum, 'order.json');

          if (fs.existsSync(orderPath)) {
            const raw = fs.readFileSync(orderPath, 'utf-8');
            const parsed = JSON.parse(raw);
            orders.push(parsed);
          }
        }
      }
    }

    return new Response(JSON.stringify(orders), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Failed to read orders:', error);
    return new Response(JSON.stringify({ error: 'Could not fetch orders' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
