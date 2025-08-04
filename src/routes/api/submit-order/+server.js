// src/routes/api/submit-order/+server.js
import fs from 'fs';
import path from 'path';

export async function POST({ request }) {
  try {
    const data = await request.json();
    const { order } = data;

    // Validate workorder format (e.g., "25310005")
    const workorder = order?.workorder?.trim();
    if (!/^\d{8}$/.test(workorder)) {
      return new Response(JSON.stringify({ error: 'Invalid workorder format' }), { status: 400 });
    }

    const year = workorder.slice(0, 2);
    const week = workorder.slice(2, 4);
    const number = workorder.slice(4);
    const dirPath = path.resolve('orders', year, week, number);
    const filePath = path.join(dirPath, 'order.json');

    // Make directories if they don't exist
    fs.mkdirSync(dirPath, { recursive: true });

    // Write the order data
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

    console.log(`✅ Order saved: ${filePath}`);
    return new Response(JSON.stringify({ message: 'Order saved successfully!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('❌ Error saving order:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
