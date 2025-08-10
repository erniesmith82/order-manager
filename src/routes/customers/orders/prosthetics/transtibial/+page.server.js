import fsp from 'fs/promises';
import path from 'path';

const ORDERS_ROOT = path.resolve('static', 'orders');

// ---- Same ET/Sunday-week helpers as the API ----
function getETParts() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false
  }).formatToParts(new Date());
  const get = (t) => parseInt(parts.find(p => p.type === t)?.value, 10);
  return { y: get('year'), m: get('month'), d: get('day') };
}
function isLeap(y){ return (y%4===0 && y%100!==0) || (y%400===0); }
function dayOfYear(y,m,d){ const md=[31,(isLeap(y)?29:28),31,30,31,30,31,31,30,31,30,31]; let n=d; for(let i=0;i<m-1;i++) n+=md[i]; return n; }
function dowSun0(y,m,d){ const t=[0,3,2,5,0,3,5,1,4,6,2,4]; if(m<3) y-=1; return (y + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) + t[m-1] + d) % 7; }
function etSundayWeekNumber(y,m,d){ const doy=dayOfYear(y,m,d); const firstDow=dowSun0(y,1,1); return Math.floor((doy + firstDow - 1)/7)+1; }

export async function load() {
  const { y, m, d } = getETParts();
  const YY = String(y).slice(-2);
  const WW = String(etSundayWeekNumber(y, m, d)).padStart(2, '0');

  // preview next NN by scanning existing two-digit folders
  let NN = '01';
  try {
    const weekDir = path.join(ORDERS_ROOT, YY, WW);
    const entries = await fsp.readdir(weekDir, { withFileTypes: true });
    const seqs = entries
      .filter(e => e.isDirectory() && /^\d{2}$/.test(e.name))
      .map(e => parseInt(e.name, 10))
      .filter(n => !Number.isNaN(n));
    NN = String(seqs.length ? Math.max(...seqs) + 1 : 1).padStart(2, '0');
  } catch { /* week folder doesn’t exist yet; NN stays '01' */ }

  return {
    user: { facilities: [] },
    workorderHint: `${YY}${WW}00${NN}`
  };
}
