import * as puppeteer from "puppeteer";

let browser;

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}


const removeCookie = async (page) => {
  let div_selector_to_remove = "#CybotCookiebotDialog";
  await page.evaluate((sel) => {
    var elements = document.querySelectorAll(sel);
    for (var i = 0; i < elements.length; i++) {
      elements[i].parentNode.removeChild(elements[i]);
    }
  }, div_selector_to_remove);

  div_selector_to_remove = ".navbar";
  await page.evaluate((sel) => {
    var elements = document.querySelectorAll(sel);
    for (var i = 0; i < elements.length; i++) {
      elements[i].parentNode.removeChild(elements[i]);
    }
  }, div_selector_to_remove);
}

const selectOption = async (page, selectorStr, desiredValue, optionValue) => {
  const element = await page.$(selectorStr);
  element.select(desiredValue);

  const value = await page.$eval(selectorStr, (el: any) => {
    return el.selectedIndex
  });

  if (value === 0) {
    return await selectOption(page, selectorStr, desiredValue, optionValue)
  }
}


const setTextInput = async (page, selectorStr, value) => {
  await page.$eval(selectorStr, (el, value) => { el.value = value }, value);

  const result = await page.$eval(selectorStr, (el: any) => {
    return el.value
  });

  if (!result) {
    return await setTextInput(page, selectorStr, value)
  }
}

const setGender = async (page, data) => {
  const selectorStr = '[name="tx_wxsozialbau_altbau[contact][gender]"]'
  await selectOption(page, selectorStr, data.gender, 1)
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
  const selectorStr = '[name="tx_wxsozialbau_altbau[contact][title]"]'
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

export const applyToHouse = async (url, user) => {
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

  await removeCookie(page)

  await Promise.all([
    setGender(page, data),
    setLastName(page, data),
    setfirstName(page, data),
    setTitle(page, data),
    setBirthday(page, data),
    setBirthmonth(page, data),
    setBirthyear(page, data),
    setStreet(page, data),
    setHausnr(page, data),
    setFloor(page, data),
    setDoornr(page, data),
    setZip(page, data),
    setCity(page, data),
    setPhone(page, data),
    setEmail(page, data),
    check(page, data)
  ])

  const now = new Date().getTime();
  await page.screenshot({ path: `${user.firstName}.${now}before.png`, fullPage: true });

  await page.click('input[type="submit"]');

  await page.screenshot({ path: `${user.firstName}.${now}after.png`, fullPage: true });
};

const launch = async () => {
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });
}

launch();