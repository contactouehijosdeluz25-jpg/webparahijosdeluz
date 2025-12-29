const { chromium, devices } = require('playwright');
(async () => {
  const iphone = devices['iPhone 13 Pro'];
  const browser = await chromium.launch();
  try {
    // Desktop screenshot
    const contextD = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const pageD = await contextD.newPage();
    const desktopConsole = [];
    pageD.on('console', msg => desktopConsole.push(msg.text()));
    await pageD.goto('http://localhost:8080/', { waitUntil: 'load', timeout: 30000 });
    await pageD.screenshot({ path: '/tmp/index_desktop.png', fullPage: true });
    console.log('Desktop console logs:', desktopConsole.slice(-10));

    // Mobile screenshot (iPhone)
    const contextM = await browser.newContext({ ...iphone });
    const pageM = await contextM.newPage();
    const mobileConsole = [];
    pageM.on('console', msg => mobileConsole.push(msg.text()));
    await pageM.goto('http://localhost:8080/contacto.html', { waitUntil: 'load', timeout: 30000 });
    await pageM.screenshot({ path: '/tmp/contacto_mobile.png', fullPage: true });
    console.log('Mobile console logs:', mobileConsole.slice(-10));

    await contextD.close();
    await contextM.close();
  } catch (err) {
    console.error('Error running Playwright script:', err);
    process.exitCode = 2;
  } finally {
    await browser.close();
  }
})();
