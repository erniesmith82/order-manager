// /src/routes/api/submit-order/+server.js
import fsp from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../../../');
const ORDERS_ROOT = path.join(projectRoot, 'static', 'orders');

/* -------------------- Helpers -------------------- */

// Parse JSON fields safely
function safeParseJson(value, label) {
  if (!value) return null;
  try { return JSON.parse(value); }
  catch (e) { throw new Error(`Invalid JSON for "${label}": ${e.message}`); }
}

/** ET date parts (no Date objects -> no TZ drift) */
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

/** Day of week for y/m/d, Sunday=0..Saturday=6 (Sakamoto) */
function dowSun0(y, m, d) {
  const t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
  if (m < 3) y -= 1;
  return (y + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) + t[m-1] + d) % 7;
}

/** Day of year 1..366 */
function isLeap(y){ return (y%4===0 && y%100!==0) || (y%400===0); }
function dayOfYear(y, m, d) {
  const mdays = [31, (isLeap(y) ? 29 : 28), 31,30,31,30,31,31,30,31,30,31];
  let n = d; for (let i = 0; i < m-1; i++) n += mdays[i];
  return n;
}

/** Sunday-start week number 1..53 using ET y/m/d */
function etSundayWeekNumber(y, m, d) {
  const doy = dayOfYear(y, m, d);
  const firstDow = dowSun0(y, 1, 1); // 0=Sun
  return Math.floor((doy + firstDow - 1) / 7) + 1;
}

/**
 * Determine next workorder number & ensure directory exists (race-safe).
 * Format: YYWW00NN
 * Folders: /static/orders/YY/WW/NN
 */
async function getNextWorkorderNumber() {
  const { y, m, d } = getETParts();
  const YY = String(y).slice(-2);
  const WW = String(etSundayWeekNumber(y, m, d)).padStart(2, '0');

  const weekDir = path.join(ORDERS_ROOT, YY, WW);
  await fsp.mkdir(weekDir, { recursive: true });

  // Atomically create first free NN folder 01..99
  let NN = null;
  let orderDir = null;

  for (let i = 1; i <= 99; i++) {
    const candidate = String(i).padStart(2, '0');
    const candidateDir = path.join(weekDir, candidate);
    try {
      await fsp.mkdir(candidateDir, { recursive: false }); // throws EEXIST if taken
      NN = candidate;
      orderDir = candidateDir;
      break;
    } catch (err) {
      if (err?.code === 'EEXIST') continue;
      throw err;
    }
  }
  if (!NN) throw new Error(`No available NN slot in ${weekDir}`);

  const workorder = `${YY}${WW}00${NN}`;
  return { workorder, orderDir, YY, WW, NN };
}

async function saveFormFile(fd, field, destPathBase) {
  const file = fd.get(field);
  if (!file || typeof file === 'string') return null;
  const buf = Buffer.from(await file.arrayBuffer());
  let outName = (file.name || field).replace(/[\\/]+/g, '_');
  const outPath = path.join(destPathBase, outName);
  await fsp.writeFile(outPath, buf);
  return outName;
}

/* -------------------- SvelteKit Handler -------------------- */

const WO_RE = /^(\d{2})(\d{2})00(\d{2})$/; // YY WW 00 NN

export async function POST({ request }) {
  try {
    const form = await request.formData();

    const patient = safeParseJson(form.get('patient'), 'patient') ?? {};
    const order   = safeParseJson(form.get('order'), 'order') ?? {};
    const liner   = safeParseJson(form.get('liner'), 'liner') ?? {};
    const foot    = safeParseJson(form.get('foot'), 'foot') ?? {};

    // STEP ONE support: allow attaching to an existing workorder
    const forceWorkorder = (form.get('forceWorkorder') || '').toString().trim();

    let workorder, orderDir, YY, WW, NN;

    if (forceWorkorder && WO_RE.test(forceWorkorder)) {
      // Use the provided workorder dir, create if missing
      const m = WO_RE.exec(forceWorkorder);
      YY = m[1]; WW = m[2]; NN = m[3];
      workorder = forceWorkorder;
      orderDir = path.join(ORDERS_ROOT, YY, WW, NN);
      await fsp.mkdir(orderDir, { recursive: true });
    } else {
      // Fresh assignment
      ({ workorder, orderDir, YY, WW, NN } = await getNextWorkorderNumber());
    }

    order.workorder = workorder;

    // Save files (merge with any existing)
    const saved = {};
    const uploadedName = await saveFormFile(form, 'uploadedFile', orderDir);
    if (uploadedName) saved.uploadedFile = uploadedName;

    const pdfName = await saveFormFile(form, 'pdf', orderDir);
    if (pdfName) saved.pdf = pdfName;

    const jpgName = (await saveFormFile(form, 'jpg', orderDir))
                 || (await saveFormFile(form, 'image', orderDir));
    if (jpgName) saved.jpg = jpgName;

    const summaryName = await saveFormFile(form, 'summaryJpg', orderDir);
    if (summaryName) saved.summaryJpg = summaryName;

    // Upsert order.json (merge)
    const jsonPath = path.join(orderDir, 'order.json');
    let existing = {};
    try {
      existing = JSON.parse(await fsp.readFile(jsonPath, 'utf8'));
    } catch {}

    const { y, m, d } = getETParts();
    const createdAtIso = existing.createdAt ?? new Date(Date.UTC(y, m - 1, d, 0, 0, 0)).toISOString();

    const record = {
      ...existing,
      workorder,
      YY, WW, NN,
      createdAt: createdAtIso,
      patient: { ...(existing.patient || {}), ...patient },
      order:   { ...(existing.order   || {}), ...order   },
      liner:   { ...(existing.liner   || {}), ...liner   },
      foot:    { ...(existing.foot    || {}), ...foot    },
      files:   { ...(existing.files   || {}), ...saved   }
    };

    await fsp.writeFile(jsonPath, JSON.stringify(record, null, 2), 'utf8');

    return new Response(JSON.stringify({
      ok: true,
      workorder,
      dir: `/static/orders/${YY}/${WW}/${NN}`,
      files: record.files
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (err) {
    console.error('submit-order error:', err);
    return new Response(JSON.stringify({ ok: false, error: String(err?.message ?? err) }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
}
