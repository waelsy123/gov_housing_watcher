import { applyToHouse as applySozialBau } from './sozialBau';
const axios = require("axios");
const cheerio = require("cheerio");
const cron = require("node-cron");

import * as TelegramBot from "node-telegram-bot-api";
import * as fs from "fs";
import { User, token, users } from './data';

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

  // write the updated set of chat IDs to the file
  fs.writeFileSync("chat_ids.txt", Array.from(chatIds).join("\n"));
});

function parsePrice(priceString: string): number {
  return parseFloat(priceString.replace('€', '').replace('.', '').replace(',', '.').trim());
}

async function registerToHouse(house: House, user: User) {
  const link = house.link;

  let attempts = 0;
  const maxAttempts = 5;
  while (attempts < maxAttempts) {
    try {
      const response = await axios.get(link);
      const html = response.data;
      const $ = cheerio.load(html);
      const adLink = 'https://www.sozialbau.at' + $(".tx-wx-sozialbau p a").first().attr('href');
      console.log("🚀 ~ file: index.ts:38 ~ registerToHouse ~ adLink", adLink)

      applySozialBau(adLink, user);
      break;
    } catch (error) {
      attempts += 1;
      console.error(`Attempt ${attempts} to register the house failed. Retrying in 10ms...`);
      if (attempts === maxAttempts) {
        for (const chatId of chatIds) {
          bot.sendMessage(chatId, `Failed to register the house after ${attempts} attempts. Here's the link: ${link}`);
        }
      }
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }
}

async function sendMessageToAllThenApply(diff: House[]) {
  console.log("🚀 ~ file: index.ts:45 ~ sendMessageToAllChats ~ length", diff.length)

  for (const [index, house] of diff.entries()) {
    let appliers = '';

    for (const user of users) {
      // Check if the house matches the user's preferences
      if (
        house.roomCount === user.desired_room_number &&
        house.deposit <= user.max_deposit &&
        house.monthlyPrice <= user.max_price
      ) {
        await registerToHouse(house, user);
        appliers += ` ${user.firstName} |`;
      }
    }

    console.log("🚀 ~ file: index.ts:67 ~ sendMessageToAllThenApply ~ house:", house)

    for (const chatId of chatIds) {
      let message = '';

      if (index === 0) {
        message += `\n----------------------------------------`;
      }

      message += `\n\nHouse ID: ${index + 1}\n\n`;

      if (house.text) {
        message += `📝 *Description:* ${house.text}\n\n`;
      }

      if (house.link) {
        message += `🔗 *Link:* [More Details](${house.link})\n`;
      }

      if (house.roomCount !== null) {
        message += `🚪 *Room Count:* ${house.roomCount}\n`;
      }

      if (house.deposit !== null) {
        message += `💰 *Deposit:* €${house.deposit.toFixed(2)}\n`;
      }

      if (house.monthlyPrice !== null) {
        message += `💵 *Monthly Price:* €${house.monthlyPrice.toFixed(2)}\n`;
      }

      message += `🚀 *Applied for:* ${appliers}\n`;

      try {
        await bot.sendMessage(chatId, message, { parse_mode: 'Markdown', disable_web_page_preview: true });
      } catch (error) {
        console.error(`Failed to send message to chat ID ${chatId}`);
        // Optionally, remove the chatId from chatIds if it consistently fails
      }
    }
  }
}

function extractTableRows(html: string): Set<House> {
  // Use cheerio to parse the HTML and get the first table element
  const $ = cheerio.load(html);
  const table = $("table").first();

  // Get all rows from the table
  const rows = table.find("tr");

  // Create a Set to store the rows
  const rowSet: Set<House> = new Set();

  // Add the text of each row to the Set, after trimming it
  rows.each((i, row) => {
    const link = $(row).find('a').first().attr('href');
    if (!link) { return }
    const roomCount = Number($(row).find('td:eq(1)').text());
    const deposit = parsePrice($(row).find('td:eq(2)').text());
    const monthlyPrice = parsePrice($(row).find('td:eq(3)').text());

    rowSet.add({
      link: 'https://www.sozialbau.at' + link,
      text: $(row).text().trim(),
      roomCount,
      deposit,
      monthlyPrice
    });
  });

  // Return the Set of rows
  return rowSet;
}

interface House {
  link?: string
  text: string
  roomCount: number,
  deposit: number,
  monthlyPrice: number
}
async function getListFromUrl(url: string): Promise<Set<House>> {
  // Use axios to fetch the HTML source code from the URL
  const response = await axios.get(url);
  const html = response.data;

  // Extract the rows of the first table element
  const rows = extractTableRows(html);

  // Return the Set of rows
  return rows;
}

// URL of the webpage
const url = "https://sozialbau.at/angebot/sofort-verfuegbar/";

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
      sendMessageToAllThenApply(diff);

      previousList = new Set([...currentList].map(x => x.link));
    }
  });
}

main();
