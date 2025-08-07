// /src/routes/customers/orders/prosthetics/transtibial/+page.js
import fs from 'fs/promises';
import path from 'path';

export async function load({ fetch }) {
  // Get workorder number
  const res = await fetch('/api/next-workorder');
  const { workorder } = await res.json();

  // Load user info from static/data/users.json
  const filePath = path.resolve('static/data/users.json');
  const raw = await fs.readFile(filePath, 'utf-8');
  const users = JSON.parse(raw);

  // Simulate "logged in" user — update this logic later
  const user = users.find(u => u.role === 'customer' && u.facilities);


  return {
    workorder,
    user
  };
}

// Helper to get ISO week number (not used in load, can be removed or reused later)
function getISOWeek(date) {
  const tempDate = new Date(date.getTime());
  tempDate.setHours(0, 0, 0, 0);
  tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
  const week1 = new Date(tempDate.getFullYear(), 0, 4);
  return 1 + Math.round(((tempDate - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
}

// Optional placeholder
async function getNextOrderNumber(year, week) {
  return '0001';
}
