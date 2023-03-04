import { Page } from "puppeteer"
import { newPage } from "../lib/browser"
import { clickSomethingByClass, clickSomethingBySelector, sleep } from "../lib/common"

interface CreateTweetProps {
    url: string
    text: string
}
export const createTweet = async (data: CreateTweetProps) => {
    const page = await newPage()

    await page.goto(data.url);
    await writePost(page, data.text);
    await clickSomethingBySelector(page, '[data-testid="tweetButtonInline"]');
    await sleep(10000);
    await page.close();
}

interface DeleteTweetProps {
    url: string
}
const deleteTweet = async (data: DeleteTweetProps) => { }

1
// --------------------------

const writePost = async (page: Page, text: string) => {
    const selectorStr = '.public-DraftEditorPlaceholder-inner'

    await clickSomethingByClass(page, selectorStr)
    await sleep(1000)
    await page.keyboard.type(text, { delay: 3 });
}
