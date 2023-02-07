import * as puppeteer from "puppeteer";

let browser;

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// const dummyData = {
//   gender: "m",
//   lastName: "Janski",
//   firstName: "Ilan",
//   title: "9",
//   birthday: "02",
//   birthmonth: "04",
//   birthyear: "1995",
//   street: "Salmovska",
//   hausnr: "10",
//   floor: "2",
//   doornr: "14",
//   zip: "12000",
//   city: "Praha",
//   phone: "00420535637284",
//   email: "waelsy123@gmail.com"
// }
// const data = dummyData

const data = {
  lastName: "Almattar",
  firstName: "Mohamad",
  street: "Diesterwegstrasse 9c",
  zip: "10405",
  city: "Berlin",
  phone: "00491783751508",
  email: "mhdwasimalmattar@gmail.com"
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

// const setGender = async (page) => {
//   const selectorStr = '[name="tx_wxsozialbau_altbau[contact][gender]"]'
//   await selectOption(page, selectorStr, data.gender, 1)
// }

const setLastName = async (page) => {
  const selectorStr = '[name="tx_powermail_pi1[field][name]"]'
  await setTextInput(page, selectorStr, data.lastName)
}

const setfirstName = async (page) => {
  const selectorStr = '[name="tx_powermail_pi1[field][vorname]"]'
  await setTextInput(page, selectorStr, data.firstName)
}

// const setTitle = async (page) => {
//   const selectorStr = '[name="tx_wxsozialbau_altbau[contact][title]"]'
//   await selectOption(page, selectorStr, data.title, 1)
// }

// const setBirthday = async (page) => {
//   const selectorStr = '[name="tx_wxsozialbau_altbau[contact][birthday]"]'
//   await selectOption(page, selectorStr, data.birthday, 1)
// }

// const setBirthmonth = async (page) => {
//   const selectorStr = '[name="tx_wxsozialbau_altbau[contact][birthmonth]"]'
//   await selectOption(page, selectorStr, data.birthmonth, 1)
// }

// const setBirthyear = async (page) => {
//   const selectorStr = '[name="tx_wxsozialbau_altbau[contact][birthyear]"]'
//   await selectOption(page, selectorStr, data.birthyear, 1)
// }

const setStreet = async (page) => {
  const selectorStr = '[name="tx_powermail_pi1[field][strasse]"]'
  await setTextInput(page, selectorStr, data.street)
}

// const setHausnr = async (page) => {
//   const selectorStr = '[name="tx_wxsozialbau_altbau[contact][hausnr]"]'
//   await setTextInput(page, selectorStr, data.hausnr)
// }

// const setDoornr = async (page) => {
//   const selectorStr = '[name="tx_wxsozialbau_altbau[contact][doornr]"]'
//   await setTextInput(page, selectorStr, data.doornr)
// }

const setZip = async (page) => {
  const selectorStr = '[name="tx_powermail_pi1[field][plz]"]'
  await setTextInput(page, selectorStr, data.zip)
}

const setCity = async (page) => {
  const selectorStr = '[name="tx_powermail_pi1[field][ort]"]'
  await setTextInput(page, selectorStr, data.city)
}

const setPhone = async (page) => {
  const selectorStr = '[name="tx_powermail_pi1[field][telefon]"]'
  await setTextInput(page, selectorStr, data.phone)
}

const setEmail = async (page) => {
  const selectorStr = '[name="tx_powermail_pi1[field][e_mail]"]'
  await setTextInput(page, selectorStr, data.email)
}

const check = async (page) => {
  // await page.$eval('div > div.checkbox > label', el => {
  //   el.click();
  // })

  await page.$$eval('[id="powermail_field_datenschutzhinweis_1"]', elements => {
    elements[0].checked = true
  })

  const done = await page.$$eval('[id="powermail_field_datenschutzhinweis_1"]', elements => {
    return elements[0].checked
  })

  console.log("🚀 ~ file: applyToHouse.ts:150 ~ done ~ done", done)

  if (!done) {
    await check(page)
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


export const applyToHouse = async (url) => {
  console.log("🚀 ~ file: applyToHouse.ts:184 ~ applyToHouse ~ url", url)
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
    //   setGender(page),
    setLastName(page),
    setfirstName(page),
    //   setTitle(page),
    //   setBirthday(page),
    //   setBirthmonth(page),
    //   setBirthyear(page),
    setStreet(page),
    // //   setHausnr(page),
    // //   setDoornr(page),
    setZip(page),
    setCity(page),
    setPhone(page),
    setEmail(page),
    check(page)
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
