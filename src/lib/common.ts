import { Page } from "puppeteer";

export const clickSomethingByClass = async (page: Page, selectorStr: string) => {
    await page.waitForSelector(selectorStr);

    await page.click(`${selectorStr}:first-of-type`);
}

export const clickSomethingBySelector = async (page: Page, selectorStr: string) => {
    await page.waitForSelector(selectorStr);

    await page.click(selectorStr);
}

export function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

