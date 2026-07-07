// Real-browser smoke test: drag, resize, and widget placement.
// Exists because jsdom has Node's `process` global and cannot catch browser-only
// crashes like react-draggable's `process.env.DRAGGABLE_DEBUG` read at drag start.
// Run: npm run test:e2e  (boots its own vite dev server on :5199)
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const PORT = 5199;
const server = spawn('npx', ['vite', '--port', String(PORT), '--strictPort'], {
  stdio: 'ignore',
  detached: true,
});

const fail = (msg) => {
  console.error(`FAIL: ${msg}`);
  process.exitCode = 1;
};

try {
  // wait for the server
  for (let i = 0; i < 40; i++) {
    try {
      await fetch(`http://localhost:${PORT}/`);
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 250));
    }
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(e.message));

  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.react-grid-item');

  // --- resize via se handle grows the widget ---
  const h = await page.evaluate(() => {
    const el = document.querySelector('.react-resizable-handle-se').getBoundingClientRect();
    const item = document.querySelector('.react-grid-item').getBoundingClientRect();
    return { cx: el.x + el.width / 2, cy: el.y + el.height / 2, w: item.width, h: item.height };
  });
  await page.mouse.move(h.cx, h.cy);
  await page.mouse.down();
  await page.mouse.move(h.cx + 150, h.cy + 100, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(300);
  const afterResize = await page.evaluate(() => {
    const r = document.querySelector('.react-grid-item').getBoundingClientRect();
    return { w: r.width, h: r.height, selection: String(window.getSelection() ?? '') };
  });
  if (!(afterResize.w > h.w && afterResize.h > h.h)) {
    fail(`resize did not grow widget: ${h.w}x${h.h} -> ${afterResize.w}x${afterResize.h}`);
  }
  if (afterResize.selection !== '') fail('resize drag selected text');

  // --- drag via title bar moves the widget ---
  const d = await page.evaluate(() => {
    const t = document.querySelector('.react-grid-item .widget-titlebar').getBoundingClientRect();
    const item = document.querySelector('.react-grid-item').getBoundingClientRect();
    return { cx: t.x + t.width / 2, cy: t.y + t.height / 2, x: item.x, y: item.y };
  });
  await page.mouse.move(d.cx, d.cy);
  await page.mouse.down();
  await page.mouse.move(d.cx + 200, d.cy + 120, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(300);
  const afterDrag = await page.evaluate(() => {
    const r = document.querySelector('.react-grid-item').getBoundingClientRect();
    return { x: r.x, y: r.y };
  });
  if (afterDrag.x === d.x && afterDrag.y === d.y) fail('drag did not move widget');

  // --- opening a tool fills free space instead of stacking bottom-left ---
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector('.sidemenu');
  const countBefore = await page.evaluate(() => document.querySelectorAll('.react-grid-item').length);
  await page.click('.sidemenu-item:has-text("Word Counter")');
  await page.waitForTimeout(300);
  const placement = await page.evaluate(() => {
    const items = document.querySelectorAll('.react-grid-item');
    const last = items[items.length - 1].getBoundingClientRect();
    const ys = [...items].map((i) => i.getBoundingClientRect().y);
    return { count: items.length, lastY: last.y, maxOtherY: Math.max(...ys.slice(0, -1)) };
  });
  if (placement.count !== countBefore + 1) fail('sidebar click did not open widget');

  // --- maximize projects the widget over the window ---
  await page.click('.react-grid-item .widget-max');
  await page.waitForTimeout(200);
  const maxRect = await page.evaluate(() => {
    const r = document.querySelector('.widget-maximized').getBoundingClientRect();
    return { w: r.width, top: r.top };
  });
  if (maxRect.w < 1300) fail(`maximize did not expand widget: width ${maxRect.w}`);
  await page.click('.widget-maximized .widget-max');
  await page.waitForTimeout(200);
  const restored = await page.evaluate(() => document.querySelector('.widget-maximized'));
  if (restored) fail('restore did not clear maximized state');

  // --- textarea resize-y grip actually grows the element (flex-basis regression guard) ---
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector('[data-widget-id="seed-json"] textarea');
  const jsonTa = await page.$('[data-widget-id="seed-json"] textarea');
  const taBefore = await jsonTa.evaluate((e) => {
    const r = e.getBoundingClientRect();
    return { h: e.offsetHeight, x: r.x, y: r.y, w: r.width, height: r.height };
  });
  await page.mouse.move(taBefore.x + taBefore.w - 4, taBefore.y + taBefore.height - 4);
  await page.mouse.down();
  await page.mouse.move(taBefore.x + taBefore.w - 4, taBefore.y + taBefore.height - 4 + 80, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(200);
  const taAfterHeight = await jsonTa.evaluate((e) => e.offsetHeight);
  if (!(taAfterHeight - taBefore.h >= 60)) {
    fail(`JSON Converter textarea resize grip is inert: ${taBefore.h} -> ${taAfterHeight}`);
  }

  if (pageErrors.length > 0) fail(`page errors: ${pageErrors.join(' | ')}`);

  await browser.close();
  if (process.exitCode !== 1) console.log('E2E SMOKE: all checks passed');
} finally {
  try {
    global.process.kill(-server.pid);
  } catch {
    server.kill();
  }
}
