export const fakeUsers = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'jane', password: 'customer123', role: 'customer' }
];

export function loginUser(username, password) {
  const user = fakeUsers.find(
    (u) => u.username === username && u.password === password
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
