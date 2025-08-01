import fs from 'fs/promises';
import path from 'path';

// Full path to your JSON data
const usersFile = path.resolve('static/data/users.json');

export async function POST({ request }) {
  try {
    const { name, email, password } = await request.json();

    // Read existing users
    const data = await fs.readFile(usersFile, 'utf-8');
    const users = JSON.parse(data);

    // Check for duplicate email
    const existing = users.find(u => u.email === email);
    if (existing) {
      return new Response(JSON.stringify({ error: 'Email already in use' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create new user object
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password, // In production, this should be hashed!
      role: 'customer',
      avatar: '/uploads/avatars/default.png',
      preferences: {
        notifications: true,
        defaultExport: 'PDF'
      }
    };

    // Append to user list
    users.push(newUser);
    await fs.writeFile(usersFile, JSON.stringify(users, null, 2));

    // Return response
    return new Response(JSON.stringify({ success: true, user: newUser }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('Error saving new user:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
