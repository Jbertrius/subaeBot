
/**
 * This example demonstrates setting up webhook on Zeit Now platform.
 * Attention: You have to use webhook with Zeit Now only, polling doesn't
 * work.
 */


const TOKEN = '933543664:AAGVT6FjXMGfOuee6Pm2ID31gOo97piGXBg';
const TelegramBot = require('node-telegram-bot-api');
const options = {
  webHook: {
    // Just use 443 directly
    port: 443
  }
};
// You can use 'now alias <your deployment url> <custom url>' to assign fixed
// domain.
// See: https://zeit.co/blog/now-alias
// Or just use NOW_URL to get deployment url from env.
const url = process.env.NOW_URL;
const bot = new TelegramBot(TOKEN, options);


// This informs the Telegram servers of the new webhook.
// Note: we do not need to pass in the cert, as it already provided
bot.setWebHook(`${url}/bot${TOKEN}`);


// Just to ping!
bot.on('message', function onMessage(msg) {
  bot.sendMessage(msg.chat.id, 'I am alive on Zeit Now!');
});