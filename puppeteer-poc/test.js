const fs = require('fs');
const puppeteer = require('playwright');
const puppeteer = require('playwright');

const {
  performance,
  PerformanceObserver
} = require('perf_hooks');

const puppeteerTools = require('./support');


(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true
    // slowMo: 250
  });

  const measurements = [];

  const observer = new PerformanceObserver(list => {
    list.getEntries().forEach(entry => {
      measurements.push({
        name: entry.name,
        type: entry.entryType,
        start: entry.startTime,
        duration: entry.duration
      });
    });
  });
  // observer.observe({entryTypes: ['first-input', 'paint', 'largest-contentful-paint', 'element', 'resource', 'navigation', 'mark', 'measure', 'layout-shift']});
  observer.observe({ entryTypes: ['measure'] });


  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  const cdpClient = await page.target().createCDPSession();
  await cdpClient.send('Performance.enable');

  puppeteerTools.beginMark('LoginFlow');
  await page.goto('https://na1.dev.nice-incontact.com', { waitUntil: 'networkidle2' });
  await puppeteerTools.waitAndType(page, '#emailFieldNext', 'scott.walter@nice.com');
  await puppeteerTools.sleep(500);
  await page.click('#nextBtn');
  await page.waitForSelector('#mfaPassField');
  await page.type('#mfaPassField', 'Passw0rd');
  await page.click('#mfaLoginBtn');

  await puppeteerTools.waitForPageUrlToContain(page, 'admin');
  puppeteerTools.endMark('LoginFlow');

  await page.tracing.start({path: 'trace.json', categories: ['devtools.timeline']});
  // await page.tracing.start({categories: ['devtools.timeline']});
  puppeteerTools.beginMark('ActivityCodeFlow');
  await page.goto('https://na1.dev.nice-incontact.com/wfm/#/activityCodes', { waitUntil: 'networkidle2' });
  // const results = await page.tracing.stop();
  const tracingResults = JSON.parse(await page.tracing.stop());
  const networkRequests = puppeteerTools.getNetworkRequests(tracingResults);

  const cdpMetrics = await cdpClient.send('Performance.getMetrics');
  const navigationMetrics = JSON.parse(await page.evaluate(
    () => JSON.stringify(window.performance)
  ));

  puppeteerTools.beginMark('ActivityCodeFlow.showDialog');
  await page.waitForSelector('.activity-codes-header-buttons .btn-primary');
  await page.click('.activity-codes-header-buttons .btn-primary');
  await page.waitForSelector('#activity-code-title');
  puppeteerTools.endMark('ActivityCodeFlow.showDialog');

  const activityTitle = 'My Cool Title22';
  await page.type('#activity-code-title', activityTitle);
  await page.click('#saveWithPopoverBtn');

  puppeteerTools.beginMark('ActivityCodeFlow.refreshGrid');
  await page.waitForFunction(
    'document.querySelector(".ag-body").innerText.includes("' + activityTitle + '")'
  );
  puppeteerTools.endMark('ActivityCodeFlow.refreshGrid');

  puppeteerTools.endMark('ActivityCodeFlow');

  await browser.close();

  console.log('Navigation Metrics', navigationMetrics);
  console.log('CDP Metrics', cdpMetrics);

  measurements.forEach(item => console.log(item));
})();