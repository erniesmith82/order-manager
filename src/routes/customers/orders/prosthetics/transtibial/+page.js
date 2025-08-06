// /src/routes/customers/orders/prosthetics/transtibial/+page.js

// src/routes/customers/orders/prosthetics/transtibial/+page.js
export async function load({ fetch }) {
  const res = await fetch('/api/next-workorder');
  const { workorder } = await res.json();

  return {
    workorder
  };
}

// Helper to get ISO week number
function getISOWeek(date) {
  const tempDate = new Date(date.getTime());
  tempDate.setHours(0, 0, 0, 0);
  tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
  const week1 = new Date(tempDate.getFullYear(), 0, 4);
  return 1 + Math.round(((tempDate - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
}

// This could hit an endpoint, read from file, or count folders
async function getNextOrderNumber(year, week) {
  // Fallback default
  return '0001'; // Placeholder, you should hook this into your logic or endpoint
}
