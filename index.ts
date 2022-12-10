// Include the Axios and node-telegram-bot-api libraries
const axios = require("axios");
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
  chatIds.add(msg.chat.id);

  // write the updated set of chat IDs to the file
  fs.writeFileSync("chat_ids.txt", Array.from(chatIds).join("\n"));
});

// define a function to send "Bingo" to all stored chat IDs
function sendBingoToAllChats() {
  for (const chatId of chatIds) {
    bot.sendMessage(chatId, "Bingo!");
  }
}

// Function to get the source code of a webpage
async function getPageSourceCode(url: string) {
  try {
    console.log(`Fetching page source code for URL: ${url}`);

    // Use the Axios library to send a GET request to the URL
    const response = await axios.get(url);

    // Log the response status
    console.log(`Response status: ${response.status}`);

    // Return the source code of the page
    return response.data;
  } catch (error) {
    // Log the error message
    console.error(`An error occurred: ${error.message}`);
  }
}

// URL of the webpage
const url = "https://sozialbau.at/angebot/sofort-verfuegbar/";

// Previous value of the page source code
let previousPageSourceCode: string = "";

bot.on("message", (msg: any) => {
  bot.sendMessage(msg.chat.id, "I am alive!");
});


function diffWebpageSource(source1: string, source2: string): any[] {
  // Parse the source code strings into HTML documents
  const doc1 = new DOMParser().parseFromString(source1, "text/html");
  const doc2 = new DOMParser().parseFromString(source2, "text/html");

  // Get the list of all HTML elements in the first document
  const elements1 = doc1.getElementsByTagName("*");

  // Create an empty array to store the difference
  const diff: Element[] = [];

  // Loop through the elements in the first document
  for (const element of elements1) {
    // Check if the element is also present in the second document
    const matchingElement = doc2.getElementById(element.id);
    if (!matchingElement) {
      // If the element is not present in the second document, add it to the difference array
      diff.push(element);
    } else {
      // If the element is present in both documents, compare their innerHTML
      // and add any differences to the difference array
      const innerHTML1 = element.innerHTML;
      const innerHTML2 = matchingElement.innerHTML;
      if (innerHTML1 !== innerHTML2) {
        diff.push(element);
      }
    }
  }

  // Return the array of elements that are different
  return diff;
}

// Create a cron job that runs every 10 seconds
cron.schedule("*/10 * * * * *", async () => {
  // Get the current value of the page source code
  const currentPageSourceCode = await getPageSourceCode(url);
  const diff = diffWebpageSource(currentPageSourceCode, previousPageSourceCode);

  // Check if the current value is different from the previous value
  if (diff) {
    sendBingoToAllChats();

    // Update the previous value
    previousPageSourceCode = currentPageSourceCode;
  }
});
