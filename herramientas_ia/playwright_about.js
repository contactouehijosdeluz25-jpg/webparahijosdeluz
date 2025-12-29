const { chromium, devices } = require('playwright');
(async () => {
  const iphone = devices['iPhone 13 Pro'];
  const browser = await chromium.launch();
  try {
    const contextD = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const pageD = await contextD.newPage();
    await pageD.goto('http://localhost:8080/sobre-nosotros.html', { waitUntil: 'load', timeout: 30000 });
    await pageD.screenshot({ path: '/tmp/sobre_desktop.png', fullPage: true });

    const contextM = await browser.newContext({ ...iphone });
    const pageM = await contextM.newPage();
    await pageM.goto('http://localhost:8080/sobre-nosotros.html', { waitUntil: 'load', timeout: 30000 });
    await pageM.screenshot({ path: '/tmp/sobre_mobile.png', fullPage: true });

    await contextD.close();
    await contextM.close();
    console.log('Screenshots saved: /tmp/sobre_desktop.png, /tmp/sobre_mobile.png');
  } catch (err) {
    console.error('Error:', err);
    process.exitCode = 2;
  } finally {
    await browser.close();
  }
})();
