const axios = require("axios");
const cheerio = require("cheerio");
const cron = require("node-cron");

import * as TelegramBot from "node-telegram-bot-api";
import * as fs from "fs";

// Create a Telegram bot
const token = "5885795688:AAElkwJZiBfuVhEtno2ZdciD6pLQRKzC8Og";
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

// define a function to send "Bingo" to all stored chat IDs
function sendMessageToAllChats(diff: string) {
  for (const chatId of chatIds) {
    bot.sendMessage(chatId, diff);
  }
}

function extractTableRows(html: string): Set<string> {
  // Use cheerio to parse the HTML and get the first table element
  const $ = cheerio.load(html);
  const table = $("table").first();

  // Get all rows from the table
  const rows = table.find("tr");

  // Create a Set to store the rows
  const rowSet: Set<string> = new Set();

  // Add the text of each row to the Set, after trimming it
  rows.each((i, row) => rowSet.add($(row).text().trim()));

  // Return the Set of rows
  return rowSet;
}

async function getListFromUrl(url: string): Promise<Set<string>> {
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

// Previous value of the page source code
let previousList = new Set();

// Create a cron job that runs every 5 seconds
cron.schedule("*/5 * * * * *", async () => {
  const currentList = await getListFromUrl(url);
  let diff = [...currentList].filter((x) => !previousList.has(x));

  console.log("🚀 ~ file: ex.ts:78 ~ cron.schedule ~ diff", diff);

  // Check if the current value is different from the previous value
  if (diff && diff.length) {
    const diffString = diff.join("\n");
    sendMessageToAllChats(diffString);

    previousList = currentList;
  }
});
