import test from 'ava';
import puppeteer from'puppeteer';

test('foo', t => {
  t.pass();
});

test('bar', async t => {

  const browser = await puppeteer.launch({executablePath: 'google-chrome-unstable', args: ['--no-sandbox']})
  const page = await browser.newPage();
  await page.goto('https://google.com', {waitUntil: 'networkidle'});
  // Type our query into the search bar
  await page.type('input[name=q]', 'puppeteer');

  await page.click('input[type="submit"]');

  // Wait for the results to show up
  await page.waitForSelector('h3 a');

  // Extract the results from the page
  const links = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('h3 a'));
    return anchors.map(anchor => anchor.textContent);
  });
  console.log(links.join('\n'));
  await browser.close();

  const bar = Promise.resolve('bar');

  t.is(await bar, 'bar');
});