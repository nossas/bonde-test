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
  await page.goto('https://39-layout-minha-sampa-versao-02.staging.bonde.org/');

  await page.waitForSelector('#block-5491 div:nth-child(2) div h2', {timeout: 3000})

});

test('fill form', async t => {
  const { browser, page, mouse } = t.context;
  mouse.move(3, 3)
  await page.waitForSelector('#block-5508 div div:nth-child(2) div:nth-child(1) div:nth-child(6) button');
  const title = await page.$eval('#block-5508 div div:nth-child(2) div:nth-child(1) div:nth-child(6) button', e => e.textContent);
  t.is(title, 'Vem com a gente!');

  await page.type('input[id="input-field-1503429031593-51"]', 'Bonde');
  await page.type('input[id="input-field-1503429052535-6"]', 'Test');
  await page.type('input[id="input-field-1503429067520-2"]', 'foo@bar.com');
  await page.type('input[id="input-field-1503429090980-73"]', '3199999999');

  await page.click('#block-5508 div div:nth-child(2) div:nth-child(1) div:nth-child(6) button', { delay: 100 });

  await page.waitForSelector('#block-5508 div div:nth-child(2) div div.m0.h3.bold span');
  await page.screenshot({ path: 'screenshots/32-fill-form.png' });
  const form_title = await page.$eval('#block-5508 div div:nth-child(2) div div.m0.h3.bold span', e => e.textContent);
  t.is(form_title, 'Form submitted successfully!');
})


test.skip('create - donation', async t => {
  const { browser, page, mouse } = t.context;
  mouse.move(2, 2)
  await page.waitForSelector('div.p3 a:nth-child(7)')
  const title = await page.$eval('div.p3 a:nth-child(7)', e => e.textContent)
  t.is(title, 'DOAR AGORA')
  await page.click('div.p3 a:nth-child(7)', { delay: 100 })

  const frames = await page.frames();
  const tryItFrame = frames.find(f => f.name() === 'easyXDM_PagarMeCheckout_default');
  const framedButton = await tryItFrame.$('#pagarme-modal-box-step-choose-method #pagarme-checkout-boleto-buttonbutton');

  const outerHTML = await framedButton.evaluate(e => e.parentNode.outerHTML);
  console.log('the outerhtml: ', outerHTML); // to verify we're talking about the right element.. (we are.)
  framedButton.click();

  await page.waitForSelector('#pagarme-modal-box-step-choose-method #pagarme-checkout-boleto-button')
  await page.click('#pagarme-modal-box-step-choose-method #pagarme-checkout-boleto-button', { delay: 100 })

  await page.waitForSelector('input[id="pagarme-modal-box-buyer-name"]')
  await page.type('input[id="pagarme-modal-box-buyer-name"]', 'Bonde Name')
  await page.type('input[id="pagarme-modal-box-buyer-email"]', 'foo@bar.com')
  await page.type('input[id="pagarme-modal-box-buyer-document-number"]', '711.093.270-21')
  await page.type('input[id="pagarme-modal-box-buyer-ddd"]', '31')
  await page.type('input[id="pagarme-modal-box-buyer-number"]', '999999999')
  await page.click('#pagarme-modal-box-step-buyer-information > button', { delay: 100 })

  await page.waitForSelector('input[id="pagarme-modal-box-customer-address-zipcode"]')
  await page.type('input[id="pagarme-modal-box-customer-address-zipcode"]', '31140-000')
  await page.type('input[id="pagarme-modal-box-customer-address-number"]', '50')
  await page.click('#pagarme-modal-box-step-customer-address-information > button', { delay: 100 })
  await page.waitForSelector('div.p3 div span:nth-child(1)')
  const donation_title = await page.$eval('div.p3 div span:nth-child(1)', e => e.textContent)
  t.is(donation_title, 'Oba, sua doação foi registrada! Se selecionou a opção "boleto", dá uma olhada no seu email que o link vai chegar por lá ;)')

})

test.afterEach(async t => {
    const { browser } = t.context;
    await browser.close();
})
