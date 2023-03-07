import fs from 'fs';
import { config } from './lib/config';
import { scrapForContactsByString } from './scrapper/scrapper';
import { Input, Telegraf, Composer } from 'telegraf'

function dateInSeconds() {
    return Math.round(Date.now() / 1000);
}

function ignoreOldMessages(afterMinutes = 1) {
    const afterSeconds = afterMinutes * 60;

    return Composer.on('message', (ctx, next) => {
        if (dateInSeconds() - ctx.message.date < afterSeconds) {
            return next();
        }
    });
};

const bot = new Telegraf(config.telegramBotToken, { handlerTimeout: 240_000 });

bot.use(
    ignoreOldMessages()
)

bot.command('scrap', async (ctx) => {
    ctx.reply(`processing please wait...`);

    const command = ctx.update.message.text
    const [cli, engine, count, ...qlist] = command.split(' ')

    if ((!engine || !count || !qlist || qlist.length === 0) && Number(count)) {
        await ctx.reply(`wrong command `);
        await ctx.reply(`/scrap 1/2 COUNT query_text`);
        await ctx.reply(`here is an example:`);
        await ctx.reply(`/scrap 1 20 berlin car rental`);

        return
    }
    const query = qlist.join(' ')

    const timestamp = new Date().getTime().toString()
    const filename = 'data-' + timestamp + '.csv';

    // Create a new CSV file and write the header row
    const stream = fs.createWriteStream(filename);
    stream.write('Email,URL\n');

    const data: any = await scrapForContactsByString(query, engine === '1', Number(count));

    if (data.empty!) {
        ctx.reply(`empty query, abort!`);
        return
    }

    ctx.reply(`uploading file...`);

    // Loop through the data object and write each row to the CSV file
    for (const email in data) {
        const url = data[email];
        stream.write(`${email},${url}\n`);
    }

    await ctx.replyWithDocument(Input.fromLocalFile(filename))
});

bot.catch(async (err, ctx) => {
    console.log(`Ooops, encountered an error for ${ctx.message.chat.id}`, err)
    await bot.telegram.sendMessage(ctx.message.chat.id, `something wrong, we could be caught for scrapping or request taking long time, try again with different text.. `)
    process.exit(1);
})


bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));