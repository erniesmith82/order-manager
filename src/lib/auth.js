// src/lib/auth.js

let cachedUsers = null;

export async function loadUsers() {
  if (cachedUsers) return cachedUsers;

  const res = await fetch('/data/users.json');
  if (!res.ok) throw new Error('Failed to load users');

  cachedUsers = await res.json();
  return cachedUsers;
}

export async function loginUser(email, password) {
  const users = await loadUsers();

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }

  return null;
}

export function getCurrentUser() {
  if (typeof localStorage === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function logoutUser() {
  localStorage.removeItem('user');
}
