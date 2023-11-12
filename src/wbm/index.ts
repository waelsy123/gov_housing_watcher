// import { applyToHouse as applyWBM } from './wbm';
const axios = require("axios");
const cheerio = require("cheerio");
const cron = require("node-cron");

import * as TelegramBot from "node-telegram-bot-api";
import * as fs from "fs";
import { User, token, users } from './data';
export const domain = 'https://www.wbm.de/'

// Create a Telegram bot
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

  fs.writeFileSync("chat_ids.txt", Array.from(chatIds).join("\n"));
});

async function registerToHouse(house: House, user: User) {
  // applyToHouse(link);
}

// define a function to send "Bingo" to all stored chat IDs
async function sendMessageToAllThenApply(diff: House[]) {
  console.log("🚀 ~ file: index.ts:45 ~ sendMessageToAllChats ~ length", diff.length)

  for (const house of diff) {
    console.log("🚀 ~ file: index.ts:67 ~ sendMessageToAllThenApply ~ house:", house)
    // for every house search for a fit user
    // for (let i = 0; i < users.length; i++) {
    //   const user = users[i];
    //   if (
    //     user.desired_room_number === house.roomCount &&
    //     user.wbs === house.wbs
    //   ) {

    // await registerToHouse(house, user);

    for (const chatId of chatIds) {
      bot.sendMessage(chatId, house.text + '\n' + house.link);
    }
    // }
  }
}
}

function extractItems(html: string): Set<House> {
  // Use cheerio to parse the HTML and get the first table element
  const $ = cheerio.load(html);
  const items = $('.openimmo-search-list-item')

  let list: Set<House> = new Set()

  // Add the text of each row to the Set, after trimming it
  items.each((i, item) => {
    const text = $(item).text();
    const link = $(item).find('a').first().attr('href');
    let wbs = false;

    if (text.includes('WBS')) {
      wbs = true
    }
    if (!link) { return }

    const area = $(item).find('.category').text().trim();
    const address = $(item).find('.address').text().trim();
    const desc = $(item).find('.main-property-list').text().trim();

    let roomCount = 0;
    if (desc.includes('Zimmer:1')) {
      roomCount = 1
    } else if (desc.includes('Zimmer:2')) {
      roomCount = 2
    } else if (desc.includes('Zimmer:3')) {
      roomCount = 3
    } else if (desc.includes('Zimmer:4')) {
      roomCount = 4
    } else if (desc.includes('Zimmer:5')) {
      roomCount = 5
    } else if (desc.includes('Zimmer:6')) {
      roomCount = 6
    } else if (desc.includes('Zimmer:7')) {
      roomCount = 7
    } else if (desc.includes('Zimmer:8')) {
      roomCount = 8
    } else if (desc.includes('Zimmer:9')) {
      roomCount = 9
    }

    list.add({
      link: domain + link,
      text: `\n${area}\n${address}\n${desc}`,
      wbs,
      area,
      roomCount
    })
  });

  return list;
}

interface House {
  link: string
  text: string
  roomCount: number
  wbs: boolean
  area: string
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
const url = "https://www.wbm.de/wohnungen-berlin/angebote";

async function main() {
  // Previous value of the page source code
  const l = [...await getListFromUrl(url)];

  let previousList = new Set([...l.slice(1, l.length)].map(x => x.link));

  // Create a cron job that runs every 5 seconds
  cron.schedule("*/1 * * * * *", async () => {
    const currentList = await getListFromUrl(url);
    console.log("🚀 ~ file: index.ts:113 ~ cron.schedule ~ currentList:", currentList)
    let diff = [...currentList].filter((x) => !previousList.has(x.link));

    // Check if the current value is different from the previous value
    if (diff && diff.length) {
      sendMessageToAllThenApply(diff);

      previousList = new Set([...currentList].map(x => x.link));
    }
  });
}

main();