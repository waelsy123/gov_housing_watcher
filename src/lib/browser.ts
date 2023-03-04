import * as puppeteer from 'puppeteer';
import { config } from './config';

let browser: puppeteer.Browser | null = null;

const init = async () => {
    browser = await puppeteer.connect({
        browserWSEndpoint: config.wsChromeEndpointurl,
    });

    return browser
}

export const getBrowser = async () => {
    if (browser) { return browser }
    return await init();
}

export const newPage = async () => {
    const b = await getBrowser();
    const page = await b.newPage();

    await page.setViewport({
        width: 1200,
        height: 1800,
        deviceScaleFactor: 1,
    });

    return page;
}
