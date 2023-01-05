// import { applyToHouse } from './applyToHouse';
const axios = require("axios");
const cheerio = require("cheerio");
const cron = require("node-cron");

import * as TelegramBot from "node-telegram-bot-api";
import * as fs from "fs";
import { applyToHouse } from "./applyToHouse";

export const domain = 'https://www.wbm.de/'

// Create a Telegram bot
const token = "5813573616:AAGp6nX4WEoST5KZH2HtGbhput5KWHQE1dY";
const bot = new TelegramBot(token, { polling: true });

// create a Set to store the chat IDs of incoming messages
let chatIds = new Set<number>();

// try to read the contents of the file and use it to initialize the chatIds set
try {
  const data = fs.readFileSync("chat_ids.txt", "utf8");
  chatIds = new Set(data.split("\n").map((id) => parseInt(id, 10)));
} catch (err) {
  // do nothing if the file does not exist or cannot be read
}

// listen for new messages and add the chat ID to the set
bot.on("message", (msg) => {
  bot.sendMessage(msg.chat.id, "I am alive!");
  chatIds.add(msg.chat.id);

  // write the updated set of chat IDs to the file
  fs.writeFileSync("chat_ids.txt", Array.from(chatIds).join("\n"));
});

async function registerToHouse(link: string) {
  // const response = await axios.get(link);
  // const html = response.data;
  // const $ = cheerio.load(html);
  // const adLink = domain + $(".tx-wx-sozialbau p a").first().attr('href');
  // console.log("🚀 ~ file: index.ts:38 ~ registerToHouse ~ adLink", adLink)

  applyToHouse(link);
}

// define a function to send "Bingo" to all stored chat IDs
async function sendMessageToAllChats(diff: House[]) {
  for (const house of diff) {
    await registerToHouse(house.link);

    for (const chatId of chatIds) {
      bot.sendMessage(chatId, house.text + '\n' + house.link);
    }
  }
}

function extractItems(html: string): Set<House> {
  // Use cheerio to parse the HTML and get the first table element
  const $ = cheerio.load(html);
  const items = $('.openimmo-search-list-item')

  let list: Set<any> = new Set()

  // Add the text of each row to the Set, after trimming it
  items.each((i, item) => {
    const text = $(item).text();
    const link = $(item).find('a').first().attr('href');

    if (text.includes('WBS')) {
      return
    }
    if (!link) { return }

    const area = $(item).find('.category').text().trim();
    const address = $(item).find('.address').text().trim();
    const desc = $(item).find('.main-property-list').text().trim();

    list.add({ link: domain + link, text: `\n${area}\n${address}\n${desc}` })
  });

  // Return the Set of rows
  return list;
}

interface House {
  link?: string
  text: string
}
async function getListFromUrl(url: string): Promise<Set<House>> {
  // Use axios to fetch the HTML source code from the URL
  const response = await axios.get(url);
  const html = response.data;

  // Extract the rows of the first table element
  const rows = extractItems(html);

  // Return the Set of rows
  return rows;
}

// URL of the webpage
const url = "https://www.wbm.de/wohnungen-berlin/angebote-wbm/";

async function main() {
  // Previous value of the page source code
  const l = [...await getListFromUrl(url)];

  let previousList = new Set([...l.slice(1, l.length)].map(x => x.link));

  // Create a cron job that runs every 5 seconds
  cron.schedule("*/1 * * * * *", async () => {
    const currentList = await getListFromUrl(url);
    let diff = [...currentList].filter((x) => !previousList.has(x.link));

    // Check if the current value is different from the previous value
    if (diff && diff.length) {
      sendMessageToAllChats(diff);

      previousList = new Set([...currentList].map(x => x.link));
    }
  });
}

main();