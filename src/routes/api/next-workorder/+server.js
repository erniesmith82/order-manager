// src/routes/api/next-workorder/+server.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDir = path.resolve(__dirname, '../../../../static/orders');

function getNextWorkorderNumber(baseDir) {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const start = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now - start) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + start.getDay() + 1) / 7);

  const yy = year;
  const ww = String(week).padStart(2, '0');

  const weekPath = path.join(baseDir, yy, ww);
  let nextOrderNum = 1;

  if (fs.existsSync(weekPath)) {
    const existing = fs.readdirSync(weekPath, { withFileTypes: true });
    const nums = existing
      .filter(dirent => dirent.isDirectory() && /^\d{2}$/.test(dirent.name))
      .map(dirent => parseInt(dirent.name, 10))
      .sort((a, b) => b - a);

    if (nums.length > 0) {
      nextOrderNum = nums[0] + 1;
    }
  }

  const padded = String(nextOrderNum).padStart(2, '0');
  return `${yy}${ww}00${padded}`;  // "25320004"
}

export async function GET() {
  const workorder = getNextWorkorderNumber(baseDir);
  return new Response(JSON.stringify({ workorder }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
