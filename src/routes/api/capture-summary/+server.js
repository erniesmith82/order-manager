// Screenshots /orders/[workorder]/summary to static/orders/YY/WW/NN/order-summary.jpg
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright'; // install: npm i -D playwright && npx playwright install --with-deps chromium

const baseDir = path.resolve('static/orders');

export async function POST({ request, url }) {
  try {
    const { workorder } = await request.json();
    if (!/^\d{8}$/.test(workorder)) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid workorder' }), { status: 400 });
    }

    // Paths
    const yy   = workorder.slice(0, 2);
    const ww   = workorder.slice(2, 4);
    const nn   = workorder.slice(6);
    const outDir  = path.join(baseDir, yy, ww, nn);
    const outFile = path.join(outDir, 'order-summary.jpg');

    // Ensure order folder exists
    if (!fs.existsSync(outDir)) {
      return new Response(JSON.stringify({ success: false, error: 'Order folder not found' }), { status: 404 });
    }

    // Build absolute URL to the SSR summary page
    const summaryUrl = `${url.origin}/orders/${workorder}/summary`;

    // Launch headless Chromium and screenshot the element
    const browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: { width: 816, height: 1056 }, // letter at 96dpi
      deviceScaleFactor: 2                    // => 1632x2112 output (crisp)
    });
    const page = await context.newPage();

    await page.goto(summaryUrl, { waitUntil: 'networkidle' });
    const locator = page.locator('#print-summary');
    await locator.waitFor({ state: 'visible', timeout: 15000 });

    await locator.screenshot({
      path: outFile,
      type: 'jpeg',
      quality: 90
    });

    await browser.close();

    return new Response(JSON.stringify({ success: true, file: `orders/${yy}/${ww}/${nn}/order-summary.jpg` }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('capture-summary error:', err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
