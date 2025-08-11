// src/routes/api/users/[id]/+server.js

import fs from 'fs/promises';
import path from 'path';

// src/routes/api/users/[id]/+server.js
const USERS_FILE = path.resolve('static', 'data', 'users.json'); // <-- adjust to where your file truly is


async function readUsers() {
  const data = await fs.readFile(USERS_FILE, 'utf-8');
  return JSON.parse(data);
}

async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ params }) {
  const users = await readUsers();
  const user = users.find((u) => u.id === params.id);

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404
    });
  }

  return new Response(JSON.stringify(user), { status: 200 });
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function PUT({ params, request }) {
  const updatedData = await request.json();
  const users = await readUsers();

  const index = users.findIndex((u) => u.id === params.id);
  if (index === -1) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404
    });
  }

  // Merge updated data into existing user
  users[index] = { ...users[index], ...updatedData };
  await writeUsers(users);

  return new Response(JSON.stringify(users[index]), { status: 200 });
}
