"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyToHouse = void 0;
const puppeteer_1 = require("puppeteer");
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
const data = {
    gender: "m",
    lastName: "ALMATAR",
    firstName: "Abdulla",
    title: "9",
    birthday: "01",
    birthmonth: "01",
    birthyear: "1991",
    street: "Leystrasse",
    hausnr: "4",
    floor: "2",
    doornr: "22b",
    zip: "1200",
    city: "Wien",
    phone: "067761806959",
    email: "abodjarad12@gmail.com"
};
const applyToHouse = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch();
    const page = yield browser.newPage();
    yield page.setViewport({
        width: 1200,
        height: 720,
        deviceScaleFactor: 1,
    });
    yield page.goto(url);
    const gender = yield page.$('[name="tx_wxsozialbau_altbau[contact][gender]"]');
    gender.select(data.gender);
    const last_name = yield page.$('[name="tx_wxsozialbau_altbau[contact][last_name]"]');
    yield last_name.click();
    yield page.keyboard.type(data.lastName);
    const first_name = yield page.$('[name="tx_wxsozialbau_altbau[contact][first_name]"]');
    yield first_name.click();
    yield page.keyboard.type(data.firstName);
    const title = yield page.$('[name="tx_wxsozialbau_altbau[contact][title]"]');
    title.select(data.title);
    const birthday = yield page.$('[name="tx_wxsozialbau_altbau[contact][birthday]"]');
    birthday.select(data.birthday);
    const birthmonth = yield page.$('[name="tx_wxsozialbau_altbau[contact][birthmonth]"]');
    birthmonth.select(data.birthmonth);
    const birthyear = yield page.$('[name="tx_wxsozialbau_altbau[contact][birthyear]"]');
    yield birthyear.select(data.birthyear);
    const street = yield page.$('[name="tx_wxsozialbau_altbau[contact][street]"]');
    yield street.click();
    yield page.keyboard.type(data.street);
    const hausnr = yield page.$('[name="tx_wxsozialbau_altbau[contact][hausnr]"]');
    yield hausnr.click();
    yield page.keyboard.type(data.hausnr);
    // const floor = await page.$('[name="tx_wxsozialbau_altbau[contact][floor]"]');
    // await floor.click();
    // await page.keyboard.type(data.floor);
    const doornr = yield page.$('[name="tx_wxsozialbau_altbau[contact][doornr]"]');
    yield doornr.click();
    yield page.keyboard.type(data.doornr);
    const zip = yield page.$('[name="tx_wxsozialbau_altbau[contact][zip]"]');
    yield zip.click();
    yield page.keyboard.type(data.zip);
    const city = yield page.$('[name="tx_wxsozialbau_altbau[contact][city]"]');
    yield city.click();
    yield page.keyboard.type(data.city);
    const phone = yield page.$('[name="tx_wxsozialbau_altbau[contact][phone]"]');
    yield phone.click();
    yield page.keyboard.type(data.phone);
    const email = yield page.$('[name="tx_wxsozialbau_altbau[contact][email]"]');
    yield email.click();
    yield page.keyboard.type(data.email);
    let div_selector_to_remove = "#CybotCookiebotDialog";
    yield page.evaluate((sel) => {
        var elements = document.querySelectorAll(sel);
        for (var i = 0; i < elements.length; i++) {
            elements[i].parentNode.removeChild(elements[i]);
        }
    }, div_selector_to_remove);
    div_selector_to_remove = ".navbar";
    yield page.evaluate((sel) => {
        var elements = document.querySelectorAll(sel);
        for (var i = 0; i < elements.length; i++) {
            elements[i].parentNode.removeChild(elements[i]);
        }
    }, div_selector_to_remove);
    yield page.keyboard.press("Tab");
    yield page.keyboard.press("Tab");
    yield page.keyboard.press("Space");
    yield street.type(data.street);
    yield hausnr.type(data.hausnr);
    // await page.screenshot({ path: "before.png", fullPage: true });
    yield page.keyboard.press("Enter");
    // await page.screenshot({ path: "after.png", fullPage: true });
    // await page.click('button[type="submit"]');
    yield browser.close();
});
exports.applyToHouse = applyToHouse;
