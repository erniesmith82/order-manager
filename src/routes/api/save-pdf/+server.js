import fs from 'fs/promises';
import path from 'path';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ request }) {
  const data = await request.formData();
  const file = data.get('pdf');
  const workorder = data.get('workorder');

  if (!file || !workorder) {
    return new Response('Missing data', { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const pdfBuffer = Buffer.from(buffer);

  const year = `25`; // derive from workorder or date
  const week = `32`; // derive from workorder or date
  const seq = workorder.slice(-2); // or pass separately

  const saveDir = path.resolve(`static/orders/${year}/${week}/${seq}`);
  const filePath = path.join(saveDir, 'form.pdf');

  try {
    await fs.mkdir(saveDir, { recursive: true });
    await fs.writeFile(filePath, pdfBuffer);
    return new Response('PDF saved', { status: 200 });
  } catch (err) {
    console.error('Error saving PDF:', err);
    return new Response('Failed to save PDF', { status: 500 });
  }
}
