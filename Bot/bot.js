const { Telegraf } = require("telegraf");
const TOKEN = "YOUR_BOT_TOKEN";
const bot = new Telegraf(TOKEN);

const web_link = "https://your-web-app-url.com";

bot.start((ctx) =>
  ctx.reply("Welcome :)))))", {
    reply_markup: {
      keyboard: [[{ text: "web app", web_app: { url: web_link } }]],
    },
  })
);

bot.launch();
