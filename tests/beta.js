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
  await page.goto('https://www.facebook.com/beta.staging/');

  await page.waitForSelector('._4qb-');
  await page.click('a[role="button"]');
  await page.waitForSelector('.login_form_container');
  await page.type('input[id="email"]', `${process.env.FB_LOGIN}`);
  await page.type('input[id="pass"]', `${process.env.FB_PASS}`);
  await page.screenshot({path: 'screenshots/0-beta-login.png'});

  await page.click('button[id="loginbutton"]');
  await page.waitForSelector('a[href="https://www.facebook.com/beta.staging/"]');
  await page.screenshot({path: 'screenshots/01-beta-page-login.png'});


});

test('start conversation', async t => {
    const { page } = t.context;

    await page.waitForSelector('._4-u2._hoc.clearfix._4-u8');
    await page.waitForSelector('.rfloat._ohf');
    await page.waitForSelector('._2iar.clearfix._ikh ._4bl9');

    await page.click('._604m._2-sm._1olk._xa9._xah._xak._4t_j._42ft')

    await page.waitForSelector('._5qi9._5qib._5qic');
    await page.waitForSelector('.fbNubFlyoutInner');
    await page.waitForSelector('._2xh4._59w_');
    await page.screenshot({path: 'screenshots/02-beta-message-button.png'});
    const button_title = await page.$eval('._2xh6._2xh7', e => e.textContent)

    t.is(button_title, 'Começar')
    /* await button_title.click()
    await page.waitForSelector('._1aa6');
    const first_message = await page.$eval('._5yl5 span', e => e.textContent)
    t.is(first_message, 'Quem me chamou? 🎤 Meu nome é Betânia, mas pode me chamar de Beta - a robô feminista! 💜 Vim ao mundo com uma missão: usar nossos códigos feministas para reprogramar esse sistema. Vamos nessa? É só apertar o botão abaixo.👇')

    //delete conversation
    await page.waitForSelector('._3a61._461_');
    await page.click('.button._3olv._1ll-._p');
    await page.click('._54nh');
    //confirm deletion
    await page.waitForSelector('._5a8u._5lnf.uiOverlayFooter');

    await page.click('.layerCancel._4jy0._4jy3._4jy1._51sy.selected._42ft');
 */
    //t.is(1, 1);
  });