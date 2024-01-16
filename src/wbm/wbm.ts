import * as puppeteer from "puppeteer";
import { selectOption, setTextInput, sleep } from "../common/common";
import { User } from "./data";
import { House } from ".";

let browser;

const setSex = async (page, data) => {
  console.log("🚀 ~ setSex ~ data:", data)
  const selectorStr = '[name="tx_powermail_pi1[field][anrede]"'
  await selectOption(page, selectorStr, data.sex, 1)
}

const setZimmeranzahl = async (page, data) => {
  const selectorStr = '[name="tx_powermail_pi1[field][wbszimmeranzahl]"'
  await selectOption(page, selectorStr, data.zimmeranzahl.toString(), 1)
}

const setWBScode = async (page, data) => {
  const selectorStr = '[name="tx_powermail_pi1[field][einkommensgrenzenacheinkommensbescheinigung9]"'
  await selectOption(page, selectorStr, data.wbsCode.toString(), 1)
}

const setWBSDate = async (page, data) => {
  const selectorStr = '[name="tx_powermail_pi1[field][wbsgueltigbis]"]'; // Selector for the date input field
  await page.$eval(selectorStr, (el, value) => { el.value = value; }, data.expireDate); // Set the new date

  // // Optionally, verify if the date was set correctly
  // const result = await page.$eval(selectorStr, el => el.value);
  // if (result !== data.expireDate) {
  //   return await setWBSDate(page, data); // Retry if the date wasn't set correctly
  // }
}

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

const checkCookie = async (page, data) => {
  await page.$$eval('[id="powermail_field_datenschutzhinweis_1"]', elements => {
    elements[0].checked = true
  })

  const done = await page.$$eval('[id="powermail_field_datenschutzhinweis_1"]', elements => {
    return elements[0].checked
  })

  console.log("🚀 ~ file: applyToHouse.ts:150 ~ done ~ done", done)

  if (!done) {
    await checkCookie(page, data)
  }
}


const checkWBS = async (page, data) => {
  await page.$$eval('[id="powermail_field_wbsvorhanden_1"]', elements => {
    elements[0].click()
  })

  const done = await page.$$eval('[id="powermail_field_wbsvorhanden_1"]', elements => {
    return elements[0].checked
  })

  if (!done) {
    await checkWBS(page, data)
  }
}

const checkWBS2 = async (page, data) => {
  const selector = `[id="powermail_field_wbsmitbesonderemwohnbedarf_1"]`
  await page.$$eval(selector, elements => {
    elements[0].click()
  })

  const done = await page.$$eval(selector, elements => {
    return elements[0].checked
  })

  if (!done) {
    await checkWBS2(page, data)
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

export const applyToHouse = async (house: House, user: User) => {
  const url = house.link;
  const wbs = house.wbs;

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

  if (wbs) {
    await checkWBS(page, data);
    await checkWBS2(page, data);
    await setZimmeranzahl(page, data);
    await setWBScode(page, data);
    await setWBSDate(page, data);
  }


  await Promise.all([
    setSex(page, data),
    setLastName(page, data),
    setfirstName(page, data),
    setStreet(page, data),
    setZip(page, data),
    setCity(page, data),
    setPhone(page, data),
    setEmail(page, data),
    checkCookie(page, data)
  ])

  await removeCookie(page)
  const before = new Date().getTime();
  await page.screenshot({ path: `${before}before.png`, fullPage: true });

  await submit(page);

  await sleep(1000)
  await removeCookie(page)
  await sleep(100000)

  const after = new Date().getTime();
  await page.screenshot({ path: `${after}after.png`, fullPage: true });
};

const launch = async () => {
  browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox']
  });
}

launch();