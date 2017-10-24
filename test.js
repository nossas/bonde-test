import test from 'ava';
import puppeteer from'puppeteer';

// test.before(async t => {
// });

test.beforeEach(async t => {
  const browserConfig = {
    // executablePath: 'google-chrome-unstable',
    // headless: false,
    args: ['--no-sandbox']
  }
  const browser = await puppeteer.launch(browserConfig)
  const page = await browser.newPage();

  t.context = { browser, page };

  await page.setViewport({ width: 1024, height: 768 })
  await page.goto('https://app.staging.bonde.org/login', {waitUntil: 'networkidle'});

  await page.waitForSelector('input[id="emailId"]');
  await page.type('input[id="emailId"]', 'foo@bar.com', {delay: 100});
  await page.type('input[id="passwordId"]', 'foobar', {delay: 150});
  await page.click('button[type="submit"] span', {delay: 400});
  await page.screenshot({path: 'screenshots/0-login.png'});

  await page.waitForSelector('.rounded.bg-white .ListItem');
  await page.screenshot({path: 'screenshots/1-communities-list.png'});
  await page.click('.rounded.bg-white .ListItem:first-child');

  await page.waitForSelector('.settings-page-menu-layout');
});

test('admin - mobilization list - /mobilizations', async t => {
  const { browser, page } = t.context;
  await page.screenshot({path: 'screenshots/2-mobilizations-list.png'});
  const title = await page.$eval('.settings-page-menu-layout h1', e => e.textContent)
  t.is(title, 'Suas Mobilizações');
  await browser.close();
});

test('admin - community - change', async t => {
  const { browser, page } = t.context;

  const mouse = page.mouse
  mouse.move(30, 30)
  await page.click('.sidenav .item-community-change a.col-4 span');

  await page.waitForSelector('.rounded.bg-white .ListItem');
  await page.screenshot({path: 'screenshots/3-communities-list.png'});
  const title = await page.$eval('.content h2 span', e => e.textContent)
  await page.click('.rounded.bg-white .ListItem:first-child');
  t.is(title, 'Escolha uma das suas comunidades');
  await browser.close();
})

test('admin - community - config info', async t => {
  const { browser, page } = t.context;

  const mouse = page.mouse
  mouse.move(10, 10)
  await page.click('.sidenav .item-community-change a.col-8 span');
  mouse.move(300, 300)
  await page.waitForSelector('.form-redux.form.transparent');
  await page.screenshot({path: 'screenshots/4-community-config.png'});
  const title = await page.$eval('.settings-page-menu-layout h1', e => e.textContent)
  t.is(title, 'Configurações da comunidade');
  await browser.close();
})

test.todo('admin - community - config invite')
test.todo('admin - community - config mailchimp')
test.todo('admin - community - config twillio')
test.todo('admin - community - config recipient')
test.todo('admin - community - config report')
test.todo('admin - community - config domain')

test.todo('admin - mobilization - create from template master - /mobilizations/new')
test.todo('admin - mobilization - add content')
test.todo('admin - mobilization - config basics')
test.todo('admin - mobilization - config sharing')
test.todo('admin - mobilization - config google analytics')
test.todo('admin - mobilization - config metrics')
test.todo('admin - mobilization - config custom domain')
test.todo('admin - mobilization - publish')
test.todo('public - mobilization - preview - /')

test.todo('admin - widget form - configure - /mobilizations/:id/widgets/:widget_id/form')
test.todo('admin - widget pressure - configure - /mobilizations/:id/widgets/:widget_id/pressure')
test.todo('admin - widget donation - configure - /mobilizations/:id/widgets/:widget_id/donation')

test.todo('public - widget form - action')
test.todo('public - widget pressure - action')
test.todo('public - widget donation - action')

test.todo('admin - mobilization - check metrics after actions')
test.todo('admin - mobilization - template create - /mobilizations/:id/templates/create')
test.todo('admin - mobilization - create mobilization from template - /mobilizations/new')
test.todo('admin - mobilization - template remove ')

test.todo('admin - account - my account')
test.todo('admin - account - logout')
