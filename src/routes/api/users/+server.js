import fs from 'fs/promises';
import path from 'path';

const usersFile = path.resolve('static/data/users.json');

export async function POST({ request }) {
  const newUser = await request.json();

  if (!newUser.email || !newUser.password || !newUser.name) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
  }

  const data = await fs.readFile(usersFile, 'utf-8');
  const users = JSON.parse(data);

  const exists = users.find((u) => u.email === newUser.email);
  if (exists) {
    return new Response(JSON.stringify({ error: 'User already exists' }), { status: 400 });
  }

  const newId = `user-${Date.now()}`;
  const user = {
    id: newId,
    name: newUser.name,
    email: newUser.email,
    password: newUser.password,
    role: newUser.role || 'customer',
    avatar: newUser.avatar || '/avatars/default.jpg',
    preferences: {
      notifications: true,
      defaultExport: 'PDF'
    }
  };

  users.push(user);
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2));

  return new Response(JSON.stringify({ success: true, user }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
}
