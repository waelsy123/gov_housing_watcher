require('dotenv').config()

export const config = {
    wsChromeEndpointurl: process.env.WS_CHROME_ENDPOINT_URL,
    port: 3000,
    version: process.env.VERSION
}