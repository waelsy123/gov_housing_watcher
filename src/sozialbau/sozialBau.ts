import * as puppeteer from "puppeteer";
import { removeElement, selectOption, setTextInput, sleep } from "../common/common"
import { User } from "./data";

let browser;

const removeCookie = async (page) => {
  removeElement(page, "#CybotCookiebotDialog");
  removeElement(page, ".navbar");
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