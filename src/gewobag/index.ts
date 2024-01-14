import { applyToHouse } from './gewobag';
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

      applyToHouse(adLink, user);
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
    // if (house.roomCount && house.roomCount < 3) {
    //   continue
    // }

    let appliers = '';

    for (const user of users) {
      // Check if the house matches the user's preferences
      if (
        house.roomCount >= user.min_room_number &&
        house.roomCount <= user.max_room_number &&
        house.price <= user.max_price &&
        house.wbs === user.wbs
      ) {
        await applyToHouse(house.link, user);
        appliers += ` ${user.firstName} |`;
      }
    }
    console.log("🚀 ~ file: index.ts:67 ~ sendMessageToAllThenApply ~ house:", house)

    for (const chatId of chatIds) {
      let message = '';

      if (index === 0) {
        message += `\n----------------------------------------`;
      }

      message += `\n\n[${house.id}]\n\n`;


      if (house.text) {
        message += `📝 *Description:* ${house.text}\n\n`;
      }

      if (house.link) {
        message += `🔗 *Link:* [More Details](${house.link})\n`;
      }

      if (house.roomCount !== null) {
        message += `🚪 *Room Count:* ${house.roomCount}\n`;
      }

      if (house.area !== null) {
        message += `📏 *Area:* ${house.area} m²\n`;
      }

      if (house.price !== null) {
        message += `💰 *Price:* €${house.price.toFixed(2)}\n`;
      }

      message += `🚀 *Applied for:* ${appliers}\n`;
      message += `🔑 *WBS Required:* ${house.wbs ? 'Yes' : 'No'}\n`;

      bot.sendMessage(chatId, message, { parse_mode: 'Markdown', disable_web_page_preview: true });
    }
  }
}

function extractPrice(text: string): number | null {
  const priceRegex = /(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{0,2})?)€/;
  const match = text.match(priceRegex);
  const priceText = match ? match[1].replace('.', '').replace(',', '.') : null; // Standardizing the format
  if (priceText) {
    return Number(priceText)
  }
  return null
}

function extractRoomCount(text: string): number | null {
  const roomRegex = /(\d+) Zimmer/;
  const match = text.match(roomRegex);
  return match ? parseInt(match[1]) : null;
}

function extractArea(text: string): number | null {
  const areaRegex = /(\d+(?:[.,]\d+)?)\s?m²/;
  const match = text.match(areaRegex);
  const areaText = match ? match[1].replace(',', '.') : null; // Standardizing the format
  if (areaText) {
    return Number(areaText)
  }
  return null
}

function extractItems(html: string): Set<House> {
  // Use cheerio to parse the HTML and get the first table element
  const $ = cheerio.load(html);
  const items = $('.angebot-big-layout')

  let list: Set<House> = new Set()

  // Add the text of each row to the Set, after trimming it
  items.each((i, item) => {
    const id = $(item).attr('id') ?? '';
    let text = $(item).text();
    text = text.replace(/[\n\t]+/g, ' ').trim();
    const roomCount = extractRoomCount(text);
    const price = extractPrice(text);
    const area = extractArea(text);

    const link = $(item).find('a').first().attr('href');
    let wbs = false;

    if (text.includes('WBS') || text.includes('wbs') || text.includes('Wbs')) {
      wbs = true
    }
    if (!link) { return }

    list.add({
      id,
      link,
      text,
      wbs,
      area,
      price,
      roomCount
    })
  });

  return list;
}

interface House {
  id: string
  link: string
  text: string
  roomCount: number | null
  price: number | null
  wbs: boolean
  area: number | null
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
const url = "https://www.gewobag.de/fuer-mieter-und-mietinteressenten/mietangebote/?bezirke%5B%5D=charlottenburg-wilmersdorf&bezirke%5B%5D=charlottenburg-wilmersdorf-charlottenburg&bezirke%5B%5D=friedrichshain-kreuzberg&bezirke%5B%5D=friedrichshain-kreuzberg-friedrichshain&bezirke%5B%5D=friedrichshain-kreuzberg-kreuzberg&bezirke%5B%5D=lichtenberg&bezirke%5B%5D=lichtenberg-alt-hohenschoenhausen&bezirke%5B%5D=lichtenberg-falkenberg&bezirke%5B%5D=lichtenberg-fennpfuhl&bezirke%5B%5D=mitte&bezirke%5B%5D=mitte-gesundbrunnen&bezirke%5B%5D=mitte-tiergarten&bezirke%5B%5D=neukoelln&bezirke%5B%5D=neukoelln-buckow&bezirke%5B%5D=neukoelln-rudow&bezirke%5B%5D=reinickendorf&bezirke%5B%5D=reinickendorf-hermsdorf&bezirke%5B%5D=reinickendorf-tegel&bezirke%5B%5D=reinickendorf-waidmannslust&bezirke%5B%5D=steglitz-zehlendorf&bezirke%5B%5D=steglitz-zehlendorf-lichterfelde&bezirke%5B%5D=tempelhof-schoeneberg&bezirke%5B%5D=tempelhof-schoeneberg-lichtenrade&bezirke%5B%5D=tempelhof-schoeneberg-mariendorf&bezirke%5B%5D=tempelhof-schoeneberg-marienfelde&bezirke%5B%5D=tempelhof-schoeneberg-schoeneberg&objekttyp%5B%5D=wohnung&gesamtmiete_von=&gesamtmiete_bis=&gesamtflaeche_von=&gesamtflaeche_bis=&zimmer_von=&zimmer_bis=&sort-by=recent";

async function main() {
  // Previous value of the page source code
  const l = [...await getListFromUrl(url)];

  let previousList = new Set([...l.slice(2, l.length)].map(x => x.link));
  // let previousList = new Set([])

  // Create a cron job that runs every 5 seconds
  cron.schedule("*/5 * * * * *", async () => {
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
