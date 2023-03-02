import * as puppeteer from "puppeteer";

let browser;

export function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}


let data = {
  gender: "m",
  lastName: "Karahbi",
  firstName: "Khaled",
  title: "9",
  birthday: "14",
  birthmonth: "05",
  birthyear: "1981",
  street: "Alxingergasse",
  hausnr: "66",
  floor: "5",
  doornr: "14",
  zip: "1100",
  city: "Wien",
  phone: "06607394855",
  email: "khaledbasher@hotmail.com"
}

const dummyData = {
  gender: "m",
  lastName: "Janski",
  firstName: "Ilan",
  title: "9",
  birthday: "02",
  birthmonth: "04",
  birthyear: "1995",
  street: "Salmovska",
  hausnr: "10",
  floor: "2",
  doornr: "14",
  zip: "12000",
  city: "Praha",
  phone: "00420535637284",
  email: "waelsy123@gmail.com"
}

if (process.env.NODE_ENV !== 'prod') {
  data = dummyData;
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


export const setTextInput = async (page, selectorStr, value) => {
  await page.waitForSelector(selectorStr);

  await page.$eval(selectorStr, (el, value) => { el.value = value }, value);

  const result = await page.$eval(selectorStr, (el: any) => {
    return el.value
  });

  if (!result) {
    return await setTextInput(page, selectorStr, value)
  }
}

export const clickSomethingByClass = async (page, selectorStr) => {
  await page.waitForSelector(selectorStr);

  await page.click(`${selectorStr}:first-of-type`);
}

const setGender = async (page) => {
  const selectorStr = '[name="tx_wxsozialbau_altbau[contact][gender]"]'
  await selectOption(page, selectorStr, data.gender, 1)
}

const setLastName = async (page) => {
  const selectorStr = '[name="tx_wxsozialbau_altbau[contact][last_name]"]'
  await setTextInput(page, selectorStr, data.lastName)
}

const setfirstName = async (page) => {
  const selectorStr = '[name="tx_wxsozialbau_altbau[contact][first_name]"]'
  await setTextInput(page, selectorStr, data.firstName)
}

const setTitle = async (page) => {
  const selectorStr = '[name="tx_wxsozialbau_altbau[contact][title]"]'
  await selectOption(page, selectorStr, data.title, 1)
}

const setBirthday = async (page) => {
  const selectorStr = '[name="tx_wxsozialbau_altbau[contact][birthday]"]'
  await selectOption(page, selectorStr, data.birthday, 1)
}

const setBirthmonth = async (page) => {
  const selectorStr = '[name="tx_wxsozialbau_altbau[contact][birthmonth]"]'
  await selectOption(page, selectorStr, data.birthmonth, 1)
}

const setBirthyear = async (page) => {
  const selectorStr = '[name="tx_wxsozialbau_altbau[contact][birthyear]"]'
  await selectOption(page, selectorStr, data.birthyear, 1)
}

const setStreet = async (page) => {
  const selectorStr = '[name="tx_wxsozialbau_altbau[contact][street]"]'
  await setTextInput(page, selectorStr, data.street)
}

const setHausnr = async (page) => {
  const selectorStr = '[name="tx_wxsozialbau_altbau[contact][hausnr]"]'
  await setTextInput(page, selectorStr, data.hausnr)
}

const setDoornr = async (page) => {
  const selectorStr = '[name="tx_wxsozialbau_altbau[contact][doornr]"]'
  await setTextInput(page, selectorStr, data.doornr)
}

const setFloor = async (page) => {
  const selectorStr = '[name="tx_wxsozialbau_altbau[contact][floor]"]'
  await setTextInput(page, selectorStr, data.floor)
}

const setZip = async (page) => {
  const selectorStr = '[name="tx_wxsozialbau_altbau[contact][zip]"]'
  await setTextInput(page, selectorStr, data.zip)
}

const setCity = async (page) => {
  const selectorStr = '[name="tx_wxsozialbau_altbau[contact][city]"]'
  await setTextInput(page, selectorStr, data.city)
}

const setPhone = async (page) => {
  const selectorStr = '[name="tx_wxsozialbau_altbau[contact][phone]"]'
  await setTextInput(page, selectorStr, data.phone)
}

const setEmail = async (page) => {
  const selectorStr = '[name="tx_wxsozialbau_altbau[contact][email]"]'
  await setTextInput(page, selectorStr, data.email)
}

const check = async (page) => {
  await page.$$eval('[name="tx_wxsozialbau_altbau[check]"]', elements => {
    elements[1].click();
  })

  await sleep(30);

  const done = await page.$$eval('[name="tx_wxsozialbau_altbau[check]"]', elements => {
    return elements[1].checked
  })

  if (!done) {
    await check(page)
  }
}

export const applyToHouse = async (url) => {
  if (!browser) { await launch() }

  const page = await browser.newPage();

  await page.setViewport({
    width: 1200,
    height: 720,
    deviceScaleFactor: 1,
  });

  await page.goto(url);

  await removeCookie(page)

  await Promise.all([
    setGender(page),
    setLastName(page),
    setfirstName(page),
    setTitle(page),
    setBirthday(page),
    setBirthmonth(page),
    setBirthyear(page),
    setStreet(page),
    setHausnr(page),
    setFloor(page),
    setDoornr(page),
    setZip(page),
    setCity(page),
    setPhone(page),
    setEmail(page),
    check(page)
  ])

  const now = new Date().getTime();

  await page.screenshot({ path: `${now}before.png`, fullPage: true });

  await page.click('input[type="submit"]');

  await page.screenshot({ path: `${now}after.png`, fullPage: true });
};

const launch = async () => {
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });
}

launch();