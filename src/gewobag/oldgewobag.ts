import * as puppeteer from "puppeteer";
import { removeElement, selectOption, setTextInput, sleep } from "../common/common"
import { User } from "./data";

let browser;

const customSelectOption = async (page, dropdownSelector, optionText) => {
  // Click the dropdown to open it
  await click(page, dropdownSelector);

  // Wait for the dropdown options to be visible
  await page.waitForSelector('.ant-select-dropdown-menu-item');

  // Click the option with the desired text
  const optionSelector = `.ant-select-dropdown-menu-item:contains("${optionText}")`;
  const optionExists = await page.$(optionSelector);

  if (optionExists) {
    await page.click(optionSelector);
  } else {
    console.error(`Option "${optionText}" not found`);
  }
};

async function fillTextInput(page, selector, text) {
  await page.waitForSelector(selector);
  await page.click(selector, { clickCount: 3 }); // Selects the existing text
  await page.type(selector, text); // Types the new text
}


const setGender = async (page, data) => {
  const dropdownSelector = '[formcontrolname="salutation"]';
  await page.waitForSelector(dropdownSelector);
  await customSelectOption(page, dropdownSelector, 'Herr');
}

const setApplier = async (page, data) => {
  await customSelectOption(page, '.ant-select-selection', 'Für mich selbst oder meine Angehörigen');
}

const setLastName = async (page, data) => {
  const selectorStr = '[name="tx_wxsozialbau_altbau[contact][last_name]"]'
  await setTextInput(page, selectorStr, data.lastName)
}

const setfirstName = async (page, data) => {
  const selectorStr = '[name="tx_wxsozialbau_altbau[contact][first_name]"]'
  await setTextInput(page, selectorStr, data.firstName)
}

const setTitle = async (page, data) => {
  const selectorStr = '[formcontrolname="salutation"]'
  await selectOption(page, selectorStr, data.title, 1)
}

const setBirthday = async (page, data) => {
  const selectorStr = '[name="tx_wxsozialbau_altbau[contact][birthday]"]'
  await selectOption(page, selectorStr, data.birthday, 1)
}

const setBirthmonth = async (page, data) => {
  const selectorStr = '[name="tx_wxsozialbau_altbau[contact][birthmonth]"]'
  await selectOption(page, selectorStr, data.birthmonth, 1)
}

const setBirthyear = async (page, data) => {
  const selectorStr = '[name="tx_wxsozialbau_altbau[contact][birthyear]"]'
  await selectOption(page, selectorStr, data.birthyear, 1)
}

const setStreet = async (page, data) => {
  const selectorStr = '[name="tx_wxsozialbau_altbau[contact][street]"]'
  await setTextInput(page, selectorStr, data.street)
}

const setHausnr = async (page, data) => {
  const selectorStr = '[name="tx_wxsozialbau_altbau[contact][hausnr]"]'
  await setTextInput(page, selectorStr, data.hausnr)
}

const setDoornr = async (page, data) => {
  const selectorStr = '[name="tx_wxsozialbau_altbau[contact][doornr]"]'
  await setTextInput(page, selectorStr, data.doornr)
}

const setFloor = async (page, data) => {
  const selectorStr = '[name="tx_wxsozialbau_altbau[contact][floor]"]'
  await setTextInput(page, selectorStr, data.floor)
}

const setZip = async (page, data) => {
  const selectorStr = '[name="tx_wxsozialbau_altbau[contact][zip]"]'
  await setTextInput(page, selectorStr, data.zip)
}

const setCity = async (page, data) => {
  const selectorStr = '[name="tx_wxsozialbau_altbau[contact][city]"]'
  await setTextInput(page, selectorStr, data.city)
}

const setPhone = async (page, data) => {
  const selectorStr = '[name="tx_wxsozialbau_altbau[contact][phone]"]'
  await setTextInput(page, selectorStr, data.phone)
}

const setEmail = async (page, data) => {
  const selectorStr = '[name="tx_wxsozialbau_altbau[contact][email]"]'
  await setTextInput(page, selectorStr, data.email)
}

const check = async (page, data) => {
  await page.$$eval('[name="tx_wxsozialbau_altbau[check]"]', elements => {
    elements[1].click();
  })

  await sleep(30);

  const done = await page.$$eval('[name="tx_wxsozialbau_altbau[check]"]', elements => {
    return elements[1].checked
  })

  if (!done) {
    await check(page, data)
  }
}

const click = async (page, selector) => {
  await page.$$eval(selector, elements => {
    elements[0].click();
  })
}

const click2 = async (page, selector) => {
  await page.waitForSelector(selector, { visible: true }); // Wait for the element to be visible
  const elements = await page.$$(selector); // Query for elements
  if (elements.length > 0) {
    await elements[0].click(); // Click the first element
  } else {
    console.error(`No elements found for selector ${selector}`);
  }
}


export const applyToHouse = async (url, user: User) => {
  const data = user;

  if (!browser) { await launch() }

  const page = await browser.newPage();

  await page.setViewport({
    width: 1200,
    height: 720,
    deviceScaleFactor: 1,
  });

  await page.goto(url);
  console.log("🚀 ~ file: sozialBau.ts:159 ~ applyToHouse ~ url:", url)

  await page.waitForSelector('._brlbs-accept');
  await page.click('._brlbs-accept'); // cookie
  await click(page, '[data-tab="rental-contact"]')  // click tab

  await click2(page, '[formcontrolname="salutation"]')

  await Promise.all([
    // setGender(page, data),
    // setApplier(page, data),
    // fillTextInput(page, '#firstName', 'John'),
    // fillTextInput(page, '#lastName', 'Doe'),
    // setLastName(page, data),
    // setfirstName(page, data),
    // setTitle(page, data),
    // setBirthday(page, data),
    // setBirthmonth(page, data),
    // setBirthyear(page, data),
    // setStreet(page, data),
    // setHausnr(page, data),
    // setFloor(page, data),
    // setDoornr(page, data),
    // setZip(page, data),
    // setCity(page, data),
    // setPhone(page, data),
    // setEmail(page, data),
    // check(page, data)
  ])

  await sleep(10000)

  const now = new Date().getTime();
  await page.screenshot({ path: `${user.firstName}.${now}before.png`, fullPage: true });

  await page.click('input[type="submit"]');

  await page.screenshot({ path: `${user.firstName}.${now}after.png`, fullPage: true });
};

const launch = async () => {
  browser = await puppeteer.launch({
    headless: false,
    // timeout: 100,
    args: ['--no-sandbox']
  });
}

launch();