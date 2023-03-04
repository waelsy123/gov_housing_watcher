import { Page } from 'puppeteer';
import { newPage } from '../lib/browser'
import { clickSomethingByClass, sleep } from '../lib/common';

interface CreatePostProps {
    url: string,
    text: string,
}
export const createPost = async (data: CreatePostProps) => {
    const page = await newPage()

    await page.goto(data.url);
    await writePost(page, data.text);
    await clickSomethingByClass(page, '.confirm-btn');
    await sleep(10000);
    await page.close();
}

// --------------------------

const writePost = async (page: Page, text: string) => {
    const selectorStr = '.idOeeF'

    await clickSomethingByClass(page, selectorStr)
    await sleep(1000)
    await page.keyboard.type(text, { delay: 3 });
}
