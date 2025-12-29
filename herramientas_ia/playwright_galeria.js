const { chromium, devices } = require('playwright');
(async () => {
  const iphone = devices['iPhone 13 Pro'];
  const browser = await chromium.launch();
  try {
    // Desktop
    const contextD = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const pageD = await contextD.newPage();
    await pageD.goto('http://localhost:8080/galeria.html', { waitUntil: 'load', timeout: 30000 });
    await pageD.screenshot({ path: '/tmp/galeria_desktop.png', fullPage: true });
    console.log('Saved /tmp/galeria_desktop.png');

    // Mobile
    const contextM = await browser.newContext({ ...iphone });
    const pageM = await contextM.newPage();
    await pageM.goto('http://localhost:8080/galeria.html', { waitUntil: 'load', timeout: 30000 });
    await pageM.screenshot({ path: '/tmp/galeria_mobile.png', fullPage: true });
    console.log('Saved /tmp/galeria_mobile.png');

    await contextD.close();
    await contextM.close();
  } catch (err) {
    console.error('Error running Playwright:', err);
    process.exitCode = 2;
  } finally {
    await browser.close();
  }
})();
