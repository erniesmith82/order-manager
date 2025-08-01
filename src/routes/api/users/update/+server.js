import fs from 'fs';
import path from 'path';

const USERS_PATH = path.resolve('static/data/users.json');

export async function POST({ request }) {
  try {
    const updatedUser = await request.json();

    const data = fs.readFileSync(USERS_PATH, 'utf-8');
    const users = JSON.parse(data);

    const userIndex = users.findIndex((u) => u.id === updatedUser.id);

    if (userIndex === -1) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    users[userIndex] = {
      ...users[userIndex],
      ...updatedUser
    };

    fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));

    return new Response(JSON.stringify({ success: true, user: users[userIndex] }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to update user', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
