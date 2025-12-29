const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  const out = [];
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => {
    out.push(`[console] ${msg.type()} ${msg.text()}`);
  });

  page.on('pageerror', err => {
    out.push(`[pageerror] ${err.message}`);
  });

  page.on('requestfailed', req => {
    out.push(`[requestfailed] ${req.method()} ${req.url()} - ${req.failure().errorText}`);
  });

  page.on('response', resp => {
    const status = resp.status();
    if (status >= 400) {
      out.push(`[response ${status}] ${resp.request().method()} ${resp.url()}`);
    }
  });

  const url = 'http://localhost:8080/admisiones.html';
  out.push(`Navigating to ${url}`);
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    // give some time for lazy loads
    await page.waitForTimeout(1500);
  } catch (err) {
    out.push(`[goto-error] ${err.message}`);
  }

  // collect DOM resources referenced dynamically (images set via JS)
  const resources = await page.evaluate(() => {
    const imgs = Array.from(document.images).map(i => i.src);
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => l.href);
    return { imgs, links };
  });
  out.push('[dom-resources] ' + JSON.stringify(resources));

  await browser.close();

  const log = out.join('\n') + '\n';
  fs.writeFileSync('/tmp/playwright_admisiones.log', log, 'utf8');
  console.log(log);
})();
