import { launch } from 'puppeteer';

export async function isElementVisible(elementHandle) {
  return Boolean(await elementHandle.boundingBox());
}
export async function getVisibleElementBySelector(page, selector) {
  const element = await page.$(selector);
  if (element && (await isElementVisible(element))) {
    return element;
  }
}

async function clickAndWaitForNavigation(selector, page) {
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.click(selector),
  ]);

  (await getVisibleElementBySelector(page, '[data-test-id="loading"]'))
    ? console.log('✅ loading state found')
    : console.log('❌ loading state not found');

  await page.waitForFunction(() => {
    const loadingElement = document.querySelector('[data-test-id="loading"]');
    return !loadingElement;
  });
}

async function checkH1Element(page, expectedText) {
  const h1Element = await page.$('h1');
  if (!h1Element) {
    console.log('❌❌❌ h1 element not found');
    return;
  }

  const h1Text = await h1Element.evaluate((element) => element.textContent);

  if (h1Text === expectedText) {
    console.log(`✅ h1 has text ${expectedText}`);
  } else {
    console.log(
      `❌ h1 has unexpected text: ${h1Text}. Expected: ${expectedText}`,
    );
  }
}

(async () => {
  const browser = await launch({ headless: false, devtools: true });
  const page = await browser.newPage();

  await page.goto('http://localhost:3000');
  await checkH1Element(page, 'test');

  console.log('goto page and set cookie');
  await clickAndWaitForNavigation('[data-test-id="cookie"]', page);

  await checkH1Element(page, 'set cookie');
  await page.locator('[data-test-id="input-field"]').fill('1234567');
  await page.click('[data-test-id="update-button"]');

  console.log('goto landing page');
  await clickAndWaitForNavigation('[data-test-id="home"]', page);
  await checkH1Element(page, 'test');

  console.log('goto get cookie page');
  await clickAndWaitForNavigation('[data-test-id="test"]', page);
  await checkH1Element(page, 'get cookie');

  console.log('goto page with images and text');
  await clickAndWaitForNavigation('[data-test-id="page"]', page);
  await checkH1Element(page, 'Page');

  console.log('goto page with timeout');
  await clickAndWaitForNavigation('[data-test-id="timeout"]', page);

  console.log('goto page with server timeout');
  await clickAndWaitForNavigation('[data-test-id="timeout-server"]', page);
  await checkH1Element(page, 'Timeout Server');

  console.log('fetch from Pokemon API');
  await clickAndWaitForNavigation('[data-test-id="fetch"]', page);
  await checkH1Element(page, 'Pokemon Page');

  console.log('lading page second load');
  await clickAndWaitForNavigation('[data-test-id="home"]', page);
  await checkH1Element(page, 'test');

  browser.close();
})();
