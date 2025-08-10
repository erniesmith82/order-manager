// /src/routes/api/get-orders/+server.js
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

/** Resolve __dirname for ESM */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Project root = 4 levels up from this file */
const projectRoot = path.resolve(__dirname, '../../../../');

/** 📂 Absolute storage root */
const ORDERS_ROOT = path.join(projectRoot, 'static', 'orders');

/**
 * Try to parse a JSON file; return null on failure
 */
async function readJsonSafe(filePath) {
  try {
    const raw = await fsp.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Get list of subdirectories (names only)
 */
async function subdirs(dir) {
  try {
    const entries = await fsp.readdir(dir, { withFileTypes: true });
    return entries.filter(e => e.isDirectory()).map(e => e.name);
  } catch {
    return [];
  }
}

/**
 * Build a sortable timestamp from record or folder path
 */
function getSortTs(rec, YY, WW, NN) {
  // Prefer createdAt from order.json if valid
  const t = Date.parse(rec?.createdAt);
  if (!Number.isNaN(t)) return t;

  // Fallback: derive a rough timestamp from YY/WW/NN
  // Assume Sunday-start weeks; use the first day of that week
  try {
    const fullYear = 2000 + parseInt(YY, 10);
    const week = parseInt(WW, 10);
    const seq = parseInt(NN, 10);

    // Approx: week 1 starts on Jan 1; add (week-1)*7 days
    const approx = new Date(fullYear, 0, 1 + (week - 1) * 7);
    // Add tiny offset by seq so later sequences sort after earlier ones
    return approx.getTime() + seq;
  } catch {
    return 0;
  }
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ url }) {
  try {
    // Optional filters: ?year=25&week=32
    const filterYear = url.searchParams.get('year'); // 'YY'
    const filterWeek = url.searchParams.get('week'); // 'WW'

    const years = (await subdirs(ORDERS_ROOT))
      .filter(y => /^\d{2}$/.test(y))
      .filter(y => (filterYear ? y === filterYear : true));

    const results = [];

    for (const YY of years) {
      const yearDir = path.join(ORDERS_ROOT, YY);
      const weeks = (await subdirs(yearDir))
        .filter(w => /^\d{2}$/.test(w))
        .filter(w => (filterWeek ? w === filterWeek : true));

      for (const WW of weeks) {
        const weekDir = path.join(yearDir, WW);
        const seqs = (await subdirs(weekDir))
          .filter(n => /^\d{2}$/.test(n)); // NN

        for (const NN of seqs) {
          const orderDir = path.join(weekDir, NN);
          const jsonPath = path.join(orderDir, 'order.json');

          if (!fs.existsSync(jsonPath)) continue;

          const rec = await readJsonSafe(jsonPath);
          if (!rec) continue;

          // Ensure core fields exist even if older files were missing them
          const workorder = rec.workorder ?? `${YY}${WW}00${NN}`;
          const createdAt = rec.createdAt ?? null;

          results.push({
            ...rec,
            workorder,
            createdAt,
            path: `/static/orders/${YY}/${WW}/${NN}`,
            YY,
            WW,
            NN,
            _sortTs: getSortTs(rec, YY, WW, NN)
          });
        }
      }
    }

    // Newest first
    results.sort((a, b) => b._sortTs - a._sortTs);

    // Strip internal sort helper
    const clean = results.map(({ _sortTs, ...r }) => r);

    return new Response(JSON.stringify(clean), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('get-orders error:', err);
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
