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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// Include the Axios and node-telegram-bot-api libraries
var axios = require("axios");
var cron = require("node-cron");
var TelegramBot = require("node-telegram-bot-api");
var fs = require("fs");
// Create a Telegram bot
var token = "5885795688:AAElkwJZiBfuVhEtno2ZdciD6pLQRKzC8Og";
var bot = new TelegramBot(token, { polling: true });
// create a Set to store the chat IDs of incoming messages
var chatIds = new Set();
// try to read the contents of the file and use it to initialize the chatIds set
try {
    var data = fs.readFileSync('chat_ids.txt', 'utf8');
    chatIds = new Set(data.split('\n').map(function (id) { return parseInt(id, 10); }));
}
catch (err) {
    // do nothing if the file does not exist or cannot be read
}
// listen for new messages and add the chat ID to the set
bot.on('message', function (msg) {
    chatIds.add(msg.chat.id);
    // write the updated set of chat IDs to the file
    fs.writeFileSync('chat_ids.txt', Array.from(chatIds).join('\n'));
});
// define a function to send "Bingo" to all stored chat IDs
function sendBingoToAllChats() {
    for (var _i = 0, chatIds_1 = chatIds; _i < chatIds_1.length; _i++) {
        var chatId = chatIds_1[_i];
        bot.sendMessage(chatId, 'Bingo!');
    }
}
// Function to get the source code of a webpage
function getPageSourceCode(url) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log("Fetching page source code for URL: ".concat(url));
                    return [4 /*yield*/, axios.get(url)];
                case 1:
                    response = _a.sent();
                    // Log the response status
                    console.log("Response status: ".concat(response.status));
                    // Return the source code of the page
                    return [2 /*return*/, response.data];
                case 2:
                    error_1 = _a.sent();
                    // Log the error message
                    console.error("An error occurred: ".concat(error_1.message));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// URL of the webpage
var url = "https://sozialbau.at/angebot/sofort-verfuegbar/";
// Previous value of the page source code
var previousPageSourceCode = "";
bot.on('message', function (msg) {
    bot.sendMessage(msg.chat.id, 'I am alive!');
});
// Create a cron job that runs every 10 seconds
cron.schedule("*/10 * * * * *", function () { return __awaiter(void 0, void 0, void 0, function () {
    var currentPageSourceCode, currentLines, previousLines, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getPageSourceCode(url)];
            case 1:
                currentPageSourceCode = _a.sent();
                // Check if the current value is different from the previous value
                if (currentPageSourceCode !== previousPageSourceCode) {
                    sendBingoToAllChats();
                    currentLines = currentPageSourceCode.split("\n");
                    previousLines = previousPageSourceCode.split("\n");
                    // Send only the extra lines that are present in the new source code to the Telegram account
                    for (i = 0; i < currentLines.length; i++) {
                        if (currentLines[i] !== previousLines[i]) {
                            // bot.sendMessage("your_chat_id", currentLines[i]);
                        }
                    }
                    // Update the previous value
                    previousPageSourceCode = currentPageSourceCode;
                }
                return [2 /*return*/];
        }
    });
}); });
