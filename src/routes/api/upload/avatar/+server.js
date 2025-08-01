import fs from 'fs/promises';

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get('avatar');

  if (!file || !file.name) {
    return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const filename = file.name.replace(/\s+/g, '-');
  const filepath = `static/uploads/avatars/${filename}`;

  await fs.writeFile(filepath, buffer);

  return new Response(JSON.stringify({ avatar: `/uploads/avatars/${filename}` }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
