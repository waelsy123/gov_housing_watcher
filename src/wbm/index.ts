// import { applyToHouse as applyWBM } from './wbm';
const axios = require("axios");
const cheerio = require("cheerio");
const cron = require("node-cron");

import * as TelegramBot from "node-telegram-bot-api";
import * as fs from "fs";
import { User, token, users } from './data';
import { applyToHouse } from "./wbm";
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

// async function registerToHouse(house: House, user: User) {
//   // applyToHouse(link);
// }

// Function to send details of each house to all stored chat IDs
async function sendMessageToAllThenApply(diff: House[]): Promise<void> {
  console.log("Processing", diff.length, "houses...");

  for (const house of diff) {
    console.log("Sending details for house:", house);

    // Construct the message with all house details
    const message = `House Details:\n- ${house.text}\n- Link: ${house.link}\n- Room Count: ${house.roomCount}\n- WBS: ${house.wbs ? 'Yes' : 'No'}\n- Area: ${house.area}`;

    // Send the constructed message to each chat ID
    for (const chatId of chatIds) {
      await bot.sendMessage(chatId, message);
    }


    // Check each user's room number preference and apply if the house fits
    for (const user of users) {
      // Check if the house's room count is within the user's preferred range
      if (house.roomCount >= user.min_room_number && house.roomCount <= user.max_room_number) {
        // Call applyToHouse function
        await applyToHouse(house, user);
      }
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
    if (desc.includes('Zimmer:1') || desc.includes('Zimmer1')) {
      roomCount = 1
    } else if (desc.includes('Zimmer:2') || desc.includes('Zimmer2')) {
      roomCount = 2
    } else if (desc.includes('Zimmer:3') || desc.includes('Zimmer3')) {
      roomCount = 3
    } else if (desc.includes('Zimmer:4') || desc.includes('Zimmer4')) {
      roomCount = 4
    } else if (desc.includes('Zimmer:5') || desc.includes('Zimmer5')) {
      roomCount = 5
    } else if (desc.includes('Zimmer:6') || desc.includes('Zimmer6')) {
      roomCount = 6
    } else if (desc.includes('Zimmer:7') || desc.includes('Zimmer7')) {
      roomCount = 7
    } else if (desc.includes('Zimmer:8') || desc.includes('Zimmer8')) {
      roomCount = 8
    } else if (desc.includes('Zimmer:9') || desc.includes('Zimmer9')) {
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

export interface House {
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
  // const l = [...await getListFromUrl(url)];
  const l = []

  let previousList = new Set([...l.slice(1, l.length)].map(x => x.link));

  // Create a cron job that runs every 5 seconds
  cron.schedule("*/40 * * * * *", async () => {
    const currentList = await getListFromUrl(url);
    console.log("🚀 ~ cron.schedule ~ currentList:", currentList)
    let diff = [...currentList].filter((x) => !previousList.has(x.link));

    // Check if the current value is different from the previous value
    if (diff && diff.length) {
      sendMessageToAllThenApply(diff);

      previousList = new Set([...currentList].map(x => x.link));
    }
  });
}

main();