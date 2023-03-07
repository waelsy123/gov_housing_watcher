require('dotenv').config()

export const config = {
    wsChromeEndpointurl: process.env.WS_CHROME_ENDPOINT_URL,
    port: 3000,
    version: process.env.VERSION || "1.0.0",

    openAIAPIKey: process.env.OPENAI_API_KEY,
    maxModelTokens: 4096,

    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN!
}