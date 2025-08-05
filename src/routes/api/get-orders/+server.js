import fs from 'fs';
import path from 'path';

const baseDir = path.resolve('static/orders');

export async function GET() {
  let results = [];

  try {
    const years = fs.readdirSync(baseDir);
    for (const year of years) {
      const weeks = fs.readdirSync(path.join(baseDir, year));
      for (const week of weeks) {
        const orders = fs.readdirSync(path.join(baseDir, year, week));
        for (const ord of orders) {
          const filePath = path.join(baseDir, year, week, ord, 'order.json');
          if (fs.existsSync(filePath)) {
            const file = fs.readFileSync(filePath, 'utf8');
            const json = JSON.parse(file);

            // Wrap the data correctly
            results.push({
              order: json.order,
              patient: json.patient,
              liner: json.liner,
              foot: json.foot,
              submittedAt: json.submittedAt
            });
          }
        }
      }
    }

    return new Response(JSON.stringify(results), { status: 200 });
  } catch (err) {
    console.error('Error reading orders:', err);
    return new Response(JSON.stringify([]), { status: 500 });
  }
}
