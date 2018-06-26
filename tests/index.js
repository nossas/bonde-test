import test from 'ava';
import puppeteer from'puppeteer';

test.beforeEach(async t => {
  const browserConfig = {
    executablePath: 'google-chrome-unstable',
    // headless: false,
    args: ['--no-sandbox']
  }
  const browser = await puppeteer.launch(browserConfig)
  // const browserWSEndpoint = browser.wsEndpoint()
  const page = await browser.newPage();
  const mouse = page.mouse
  t.context = { browser, page, mouse };
  await page.setViewport({ width: 1024, height: 768 })
  await page.goto('https://app.staging.bonde.org/login');

  await page.waitForSelector('input[id="emailId"]');
  await page.type('input[id="emailId"]', 'foo@bar.com');
  await page.type('input[id="passwordId"]', 'foobar');
  await page.screenshot({path: 'screenshots/0-login.png'});
  await page.click('button[type="submit"] span');

  await page.waitForSelector('.rounded.bg-white .ListItem');
  await page.screenshot({path: 'screenshots/01-communities-list.png'});
  await page.click('.rounded.bg-white .ListItem:first-child');

  await page.waitForSelector('.settings-page-menu-layout');
});

test('admin - mobilization list - /mobilizations', async t => {
  const { browser, page } = t.context;
  await page.screenshot({path: 'screenshots/02-mobilizations-list.png'});
  const title = await page.$eval('.settings-page-menu-layout h1', e => e.textContent)
  t.is(title, 'Suas Mobilizações');
});

test('admin - community - change', async t => {
  const { browser, page, mouse } = t.context;
  mouse.move(1, 1)
  await page.click('.sidenav .item-community-change a.col-4 span');

  await page.waitForSelector('.rounded.bg-white .ListItem');
  await page.screenshot({path: 'screenshots/03-communities-list.png'});
  const title = await page.$eval('.content h2 span', e => e.textContent)
  await page.click('.rounded.bg-white .ListItem:first-child');
  t.is(title, 'Escolha uma das suas comunidades');
})

test('admin - community - config info', async t => {
  const { browser, page, mouse } = t.context;

  mouse.move(2, 2)
  await page.click('.sidenav .item-community-change a.col-8 span', { delay: 100 });
  mouse.move(3, 3)
  await page.waitForSelector('.form-redux.form.transparent');
  await page.screenshot({path: 'screenshots/04-community-config.png'});
  const title = await page.$eval('.settings-page-menu-layout h1', e => e.textContent)
  t.is(title, 'Configurações da comunidade');
})

test.todo('admin - community - config invite')
test.todo('admin - community - config mailchimp')
test.todo('admin - community - config twillio')
test.todo('admin - community - config recipient')
test.todo('admin - community - config report')

test('admin - community - config domain', async t => {
  const { browser, page, mouse } = t.context
  await page.click('.sidenav .items:nth-child(2) .item:nth-child(4) .item-icon', { delay: 100 })
  await page.waitForSelector('.domain-page')
  const title = await page.$eval('.tab.is-active', e => e.textContent)
  t.is(title, 'Domínios')
  mouse.move(200, 200)
  await page.screenshot({path: 'screenshots/30-account-edit.png'})
})

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

test('admin - account - my account', async t => {
  const { browser, page, mouse } = t.context;
  mouse.move(4, 4)
  await page.click('.sidenav .items:nth-child(3) .item:nth-child(1) .item-icon', { delay: 100 });
  await page.waitForSelector('.settings-page-menu-layout h1');
  const title = await page.$eval('.settings-page-menu-layout h1', e => e.textContent)
  t.is(title, 'Minha conta');
  mouse.move(200, 200)
  await page.screenshot({path: 'screenshots/30-account-edit.png'});
})

test('admin - account - logout', async t => {
  const { browser, page, mouse } = t.context;
  mouse.move(-5, -5)
  await page.click('.sidenav .items:nth-child(3) .item:nth-child(2) .item-icon', { delay: 100 });
  await page.waitForSelector('img[alt="Logo Bonde"]')
  const title = await page.$eval('button[type="submit"] span', e => e.textContent)
  t.is(title, 'Entrar');
  await page.screenshot({path: 'screenshots/31-account-logout.png'})
})

test.afterEach(async t => {
  const { browser } = t.context;
  await browser.close();
})
