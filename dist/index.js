"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.domain = void 0;
const axios = require("axios");
const cheerio = require("cheerio");
const cron = require("node-cron");
const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
exports.domain = 'https://www.wbm.de/';
// Create a Telegram bot
const token = "5813573616:AAGp6nX4WEoST5KZH2HtGbhput5KWHQE1dY";
const bot = new TelegramBot(token, { polling: true });
// create a Set to store the chat IDs of incoming messages
let chatIds = new Set();
// try to read the contents of the file and use it to initialize the chatIds set
try {
    const data = fs.readFileSync("chat_ids.txt", "utf8");
    chatIds = new Set(data.split("\n").map((id) => parseInt(id, 10)));
}
catch (err) {
    // do nothing if the file does not exist or cannot be read
}
// listen for new messages and add the chat ID to the set
bot.on("message", (msg) => {
    bot.sendMessage(msg.chat.id, "I am alive!");
    chatIds.add(msg.chat.id);
    // write the updated set of chat IDs to the file
    fs.writeFileSync("chat_ids.txt", Array.from(chatIds).join("\n"));
});
function registerToHouse(link) {
    return __awaiter(this, void 0, void 0, function* () {
        // const response = await axios.get(link);
        // const html = response.data;
        // const $ = cheerio.load(html);
        // const adLink = domain + $(".tx-wx-sozialbau p a").first().attr('href');
        // console.log("🚀 ~ file: index.ts:38 ~ registerToHouse ~ adLink", adLink)
        // applyToHouse(adLink);
    });
}
// define a function to send "Bingo" to all stored chat IDs
function sendMessageToAllChats(diff) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const house of diff) {
            // await registerToHouse(house.link);
            for (const chatId of chatIds) {
                bot.sendMessage(chatId, house.text + '\n' + house.link);
            }
        }
    });
}
function extractItems(html) {
    // Use cheerio to parse the HTML and get the first table element
    const $ = cheerio.load(html);
    const items = $('.openimmo-search-list-item');
    let list = new Set();
    // Add the text of each row to the Set, after trimming it
    items.each((i, item) => {
        const link = $(item).find('a').first().attr('href');
        if (!link) {
            return;
        }
        const area = $(item).find('.category').text().trim();
        const address = $(item).find('.address').text().trim();
        const desc = $(item).find('.main-property-list').text().trim();
        let mitte = true;
        // const roomCount = Number($(item).find('td:eq(1)').text());
        if (area.includes('SPANDAU')) {
            mitte = false;
        }
        list.add({ link: exports.domain + link, text: `${area}\n${address}\n${desc}` });
    });
    console.log("🚀 ~ file: index.ts:83 ~ extractItems ~ list", list);
    // Return the Set of rows
    return list;
}
function getListFromUrl(url) {
    return __awaiter(this, void 0, void 0, function* () {
        // Use axios to fetch the HTML source code from the URL
        const response = yield axios.get(url);
        const html = response.data;
        // Extract the rows of the first table element
        const rows = extractItems(html);
        // Return the Set of rows
        return rows;
    });
}
// URL of the webpage
const url = "https://www.wbm.de/wohnungen-berlin/angebote-wbm/";
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Previous value of the page source code
        const l = []; // [...await getListFromUrl(url)];
        let previousList = new Set([...l].map(x => x.link));
        // Create a cron job that runs every 5 seconds
        cron.schedule("*/1 * * * * *", () => __awaiter(this, void 0, void 0, function* () {
            const currentList = yield getListFromUrl(url);
            let diff = [...currentList].filter((x) => !previousList.has(x.link));
            // Check if the current value is different from the previous value
            if (diff && diff.length) {
                sendMessageToAllChats(diff);
                previousList = new Set([...currentList].map(x => x.link));
            }
        }));
    });
}
main();
