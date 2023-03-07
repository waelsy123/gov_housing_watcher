import express from 'express';
import bodyParser from 'body-parser';
import { config } from './lib/config';
import { createTweet } from './aiCreator/twitter';
import { askDallE, askGPT } from './providers/openai';
import { createPost } from './aiCreator/coinmarketcap';
import { scrapForContactsByString } from './scrapper/scrapper';

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req: express.Request, res: express.Response) => {
    res.send(`up@${config.version}`)
})

app.post('/scrapper/emails', async (req: express.Request, res: express.Response) => {
    const { text } = req.body;
    let result = {};
    if (text) {
        result = await scrapForContactsByString(text);
    }
    res.json({ success: true, payload: req.body, result })
})

app.post('/chatgpt', async (req: express.Request, res: express.Response) => {
    const { text } = req.body;
    let result = '';
    if (text) {
        result = await askGPT(text);
    }
    res.json({ success: true, payload: req.body, result })
})

app.post('/dalle', async (req: express.Request, res: express.Response) => {
    const { text } = req.body;
    let result = {};
    if (text) {
        result = await askDallE(text);
    }
    res.json({ success: true, payload: req.body, result })
})

app.post('/twitter/post', async (req: express.Request, res: express.Response) => {
    const { url, text } = req.body;
    if (url && text) {
        await createTweet({ url, text });
    }
    res.json({ success: true, payload: req.body })
})

app.post('/cmc/post', async (req: express.Request, res: express.Response) => {
    const { url, text } = req.body;
    console.log("🚀 ~ file: server.ts:26 ~ app.post ~ text:", text)
    console.log("🚀 ~ file: server.ts:26 ~ app.post ~ url:", url)
    if (url && text) {
        await createPost({ url, text });
    }
    res.json({ success: true, payload: req.body })
})

app.listen(config.port, () => {
    console.log(`listening @ http://127.0.0.1:${config.port}`)
})