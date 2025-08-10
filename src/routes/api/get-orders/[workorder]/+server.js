// /src/routes/api/get-orders/[workorder]/+server.js
import fsp from 'fs/promises';
import path from 'path';

const ORDERS_ROOT = path.resolve('static', 'orders');
const WO_RE = /^(\d{2})(\d{2})00(\d{2})$/; // YY WW 00 NN

export async function GET({ params }) {
  const { workorder } = params;

  // Validate format: YYWW00NN
  const match = WO_RE.exec(workorder || '');
  if (!match) {
    return new Response(JSON.stringify({ error: 'Invalid workorder format' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const [, YY, WW, NN] = match; // NN is already two digits
  const folderPath = path.join(ORDERS_ROOT, YY, WW, NN);
  const orderPath = path.join(folderPath, 'order.json');

  try {
    const raw = await fsp.readFile(orderPath, 'utf8');
    const data = JSON.parse(raw);

    // Optional: sanity-check the stored workorder matches the param
    if (data?.workorder && data.workorder !== workorder) {
      // still return data, but you could 409 if you prefer
    }

    return new Response(JSON.stringify({ order: data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Order not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
