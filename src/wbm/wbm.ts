import * as puppeteer from "puppeteer";
import { setTextInput, sleep } from "../common/common";
import { User } from "./data";

let browser;

const setLastName = async (page, data) => {
  const selectorStr = '[name="tx_powermail_pi1[field][name]"]'
  await setTextInput(page, selectorStr, data.lastName)
}

const setfirstName = async (page, data) => {
  const selectorStr = '[name="tx_powermail_pi1[field][vorname]"]'
  await setTextInput(page, selectorStr, data.firstName)
}

const setStreet = async (page, data) => {
  const selectorStr = '[name="tx_powermail_pi1[field][strasse]"]'
  await setTextInput(page, selectorStr, data.street)
}

const setZip = async (page, data) => {
  const selectorStr = '[name="tx_powermail_pi1[field][plz]"]'
  await setTextInput(page, selectorStr, data.zip)
}

const setCity = async (page, data) => {
  const selectorStr = '[name="tx_powermail_pi1[field][ort]"]'
  await setTextInput(page, selectorStr, data.city)
}

const setPhone = async (page, data) => {
  const selectorStr = '[name="tx_powermail_pi1[field][telefon]"]'
  await setTextInput(page, selectorStr, data.phone)
}

const setEmail = async (page, data) => {
  const selectorStr = '[name="tx_powermail_pi1[field][e_mail]"]'
  await setTextInput(page, selectorStr, data.email)
}

const check = async (page, data) => {
  await page.$$eval('[id="powermail_field_datenschutzhinweis_1"]', elements => {
    elements[0].checked = true
  })

  const done = await page.$$eval('[id="powermail_field_datenschutzhinweis_1"]', elements => {
    return elements[0].checked
  })

  console.log("🚀 ~ file: applyToHouse.ts:150 ~ done ~ done", done)

  if (!done) {
    await check(page, data)
  }
}


const removeCookie = async (page) => {
  try {
    const aa = await page.click('.cookie-settings-submitall', { delay: 100 })
    if (aa && aa.click) {
      console.log("🚀 ~ file: applyToHouse.ts:163 ~ removeCookie ~ aa", aa)
      aa.click()
    }
  } catch (e) {

  }

}

const submit = async (page) => {
  await page.$eval('.powermail_field button[type="submit"]', el => {
    el.click()
  })
}


export const applyToHouse = async (url, user: User) => {
  console.log("🚀 ~ file: applyToHouse.ts:184 ~ applyToHouse ~ url", url)

  const data = user;

  if (!browser) { await launch() }

  const page = await browser.newPage();

  await page.setViewport({
    width: 1200,
    height: 720,
    deviceScaleFactor: 1,
  });

  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  await removeCookie(page)


  await Promise.all([
    setLastName(page, data),
    setfirstName(page, data),
    setStreet(page, data),
    setZip(page, data),
    setCity(page, data),
    setPhone(page, data),
    setEmail(page, data),
    check(page, data)
  ])

  await removeCookie(page)
  const before = new Date().getTime();
  await page.screenshot({ path: `${before}before.png`, fullPage: true });

  await submit(page)

  await sleep(1000)
  await removeCookie(page)
  await sleep(1000)

  const after = new Date().getTime();
  await page.screenshot({ path: `${after}after.png`, fullPage: true });
};

const launch = async () => {
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });
}

launch();