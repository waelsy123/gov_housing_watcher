import * as express from 'express';
import * as bodyParser from 'body-parser';
import { config } from './lib/config';
import { createTweet } from './aiCreator/twitter';
import { createPost } from './aiCreator/coinmarketcap';

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req: express.Request, res: express.Response) => {
    res.send(`up@${config.version}`)
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