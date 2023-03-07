"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.applyToHouse = exports.setTextInput = void 0;
const puppeteer = __importStar(require("puppeteer"));
const common_1 = require("./lib/common");
let browser;
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
};
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
};
if (process.env.NODE_ENV !== 'prod') {
    data = dummyData;
}
const removeCookie = (page) => __awaiter(void 0, void 0, void 0, function* () {
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
});
const selectOption = (page, selectorStr, desiredValue, optionValue) => __awaiter(void 0, void 0, void 0, function* () {
    const element = yield page.$(selectorStr);
    element.select(desiredValue);
    const value = yield page.$eval(selectorStr, (el) => {
        return el.selectedIndex;
    });
    if (value === 0) {
        return yield selectOption(page, selectorStr, desiredValue, optionValue);
    }
});
const setTextInput = (page, selectorStr, value) => __awaiter(void 0, void 0, void 0, function* () {
    yield page.waitForSelector(selectorStr);
    yield page.$eval(selectorStr, (el, value) => { el.value = value; }, value);
    const result = yield page.$eval(selectorStr, (el) => {
        return el.value;
    });
    if (!result) {
        return yield (0, exports.setTextInput)(page, selectorStr, value);
    }
});
exports.setTextInput = setTextInput;
const setGender = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const selectorStr = '[name="tx_wxsozialbau_altbau[contact][gender]"]';
    yield selectOption(page, selectorStr, data.gender, 1);
});
const setLastName = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const selectorStr = '[name="tx_wxsozialbau_altbau[contact][last_name]"]';
    yield (0, exports.setTextInput)(page, selectorStr, data.lastName);
});
const setfirstName = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const selectorStr = '[name="tx_wxsozialbau_altbau[contact][first_name]"]';
    yield (0, exports.setTextInput)(page, selectorStr, data.firstName);
});
const setTitle = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const selectorStr = '[name="tx_wxsozialbau_altbau[contact][title]"]';
    yield selectOption(page, selectorStr, data.title, 1);
});
const setBirthday = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const selectorStr = '[name="tx_wxsozialbau_altbau[contact][birthday]"]';
    yield selectOption(page, selectorStr, data.birthday, 1);
});
const setBirthmonth = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const selectorStr = '[name="tx_wxsozialbau_altbau[contact][birthmonth]"]';
    yield selectOption(page, selectorStr, data.birthmonth, 1);
});
const setBirthyear = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const selectorStr = '[name="tx_wxsozialbau_altbau[contact][birthyear]"]';
    yield selectOption(page, selectorStr, data.birthyear, 1);
});
const setStreet = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const selectorStr = '[name="tx_wxsozialbau_altbau[contact][street]"]';
    yield (0, exports.setTextInput)(page, selectorStr, data.street);
});
const setHausnr = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const selectorStr = '[name="tx_wxsozialbau_altbau[contact][hausnr]"]';
    yield (0, exports.setTextInput)(page, selectorStr, data.hausnr);
});
const setDoornr = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const selectorStr = '[name="tx_wxsozialbau_altbau[contact][doornr]"]';
    yield (0, exports.setTextInput)(page, selectorStr, data.doornr);
});
const setFloor = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const selectorStr = '[name="tx_wxsozialbau_altbau[contact][floor]"]';
    yield (0, exports.setTextInput)(page, selectorStr, data.floor);
});
const setZip = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const selectorStr = '[name="tx_wxsozialbau_altbau[contact][zip]"]';
    yield (0, exports.setTextInput)(page, selectorStr, data.zip);
});
const setCity = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const selectorStr = '[name="tx_wxsozialbau_altbau[contact][city]"]';
    yield (0, exports.setTextInput)(page, selectorStr, data.city);
});
const setPhone = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const selectorStr = '[name="tx_wxsozialbau_altbau[contact][phone]"]';
    yield (0, exports.setTextInput)(page, selectorStr, data.phone);
});
const setEmail = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const selectorStr = '[name="tx_wxsozialbau_altbau[contact][email]"]';
    yield (0, exports.setTextInput)(page, selectorStr, data.email);
});
const check = (page) => __awaiter(void 0, void 0, void 0, function* () {
    yield page.$$eval('[name="tx_wxsozialbau_altbau[check]"]', elements => {
        elements[1].click();
    });
    yield (0, common_1.sleep)(30);
    const done = yield page.$$eval('[name="tx_wxsozialbau_altbau[check]"]', elements => {
        return elements[1].checked;
    });
    if (!done) {
        yield check(page);
    }
});
const applyToHouse = (url) => __awaiter(void 0, void 0, void 0, function* () {
    if (!browser) {
        yield launch();
    }
    const page = yield browser.newPage();
    yield page.setViewport({
        width: 1200,
        height: 720,
        deviceScaleFactor: 1,
    });
    yield page.goto(url);
    yield removeCookie(page);
    yield Promise.all([
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
    ]);
    const now = new Date().getTime();
    yield page.screenshot({ path: `${now}before.png`, fullPage: true });
    yield page.click('input[type="submit"]');
    yield page.screenshot({ path: `${now}after.png`, fullPage: true });
});
exports.applyToHouse = applyToHouse;
const launch = () => __awaiter(void 0, void 0, void 0, function* () {
    browser = yield puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    });
});
launch();
