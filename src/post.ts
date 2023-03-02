import { clickSomethingByClass, setTextInput, sleep } from "./applyToHouse";

// /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=$(mktemp -d -t 'chrome-remote_data_dir')

const puppeteer = require('puppeteer');

const data = {
  email: 'wael@agilehouse.dev',
  password: 'Dummypass63',
  personalPage: 'https://coinmarketcap.com/community/profile/lowcapinvestor/',
  coinUrl: 'https://coinmarketcap.com/currencies/baby-doge-coin/',
  post: 'Here is my advice, crypto is for 100x profit because it a high risk assets, therefore the for investment in the current world situation is what called Angle Invesmtnet where you invest a samll amount in low cap projects like $LUNC , $CAKE and $CEO and diversify as much as you can. This is the way that wealthy people build their forture in the early dot com boom. I’ve recorded a quick Youtube video explaining that. feel free to check it out: https://www.youtube.com/watch?v=Qoj4RRL4SAA $cirus $CAI $VCE $BTC $BNB $GMT $AGIX'
}

const setEmail = async (page) => {
  const selectorStr = 'input[type="email"]'

  await clickSomethingByClass(page, selectorStr)
  await page.keyboard.type(data.email);
}

const setPass = async (page) => {
  const selectorStr = 'input[type="password"]'

  await clickSomethingByClass(page, selectorStr)
  await page.keyboard.type(data.password);
}

const writePost = async (page) => {
  const selectorStr = '.idOeeF'

  await clickSomethingByClass(page, selectorStr)
  await sleep(1000)
  await page.keyboard.type(data.post, { delay: 300 });
}

const wsChromeEndpointurl = 'ws://127.0.0.1:9222/devtools/browser/533ca059-84f9-448f-8863-e8dc78f77f42';

const login = async (page) => {
  await page.goto(data.coinUrl);
  await clickSomethingByClass(page, '.sc-a4a6801b-0'); // login button
  await setEmail(page)
  await setPass(page)
  await clickSomethingByClass(page, '.boERQn > .sc-a4a6801b-0'); // login button
  await sleep(20000) // wait for captcha
}

const post = async (page) => {
  await page.goto(data.coinUrl);
  await writePost(page); // post input
  await clickSomethingByClass(page, '.confirm-btn'); // post button
}

const deletePost = async (page) => {
  await page.goto(data.personalPage);
  // await clickSomethingByClass(page, '.gZytZK'); // ... button

  await page.hover('.gZytZK');
  await sleep(1000);
  await page.mouse.move(1000, 40);
  await sleep(1000);
  await page.mouse.click(1000, 40);


  await clickSomethingByClass(page, '.jgNqHP'); // delete button
  await clickSomethingByClass(page, '.fMacBR'); // Delete button
}

(async () => {
  // Launch a new browser instance
  // const browser = await puppeteer.launch({ headless: false });

  const browser = await puppeteer.connect({
    browserWSEndpoint: wsChromeEndpointurl,
  });

  // Open a new tab and navigate to the website
  const page = await browser.newPage();

  await page.setViewport({
    width: 1200,
    height: 1800,
    deviceScaleFactor: 1,
  });

  while (true) {
    await sleep(4 * 60 * 1000)

    await post(page)
    // await deletePost(page)
  }

  // console.log('Please enter the captcha and press enter:');
  // await page.waitForNavigation();

  // Close the browser when finished
  // await browser.close();
})();