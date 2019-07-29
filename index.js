const TelegramBot = require('node-telegram-bot-api');
const ogs = require('open-graph-scraper');
const firebase = require('firebase');

// Bot config
const token = '933543664:AAHlXom14HpHx-MaylG4C6dpq9WPBFSiGbk';
const bot = new TelegramBot(token, {polling: true});

// Init Firebase
const app = firebase.initializeApp({
    apiKey: "AIzaSyA5pP9-UaWFqN6bWhEL44Ni9_NWdLQNKFY",
    authDomain: "cedar-freedom-138023.firebaseapp.com",
    databaseURL: "https://cedar-freedom-138023.firebaseio.com",
    projectId: "cedar-freedom-138023",
    storageBucket: "cedar-freedom-138023.appspot.com",
    messagingSenderId: "649794681789",
    appId: "1:649794681789:web:a11cf14416314f0c"
});
const ref = firebase.database().ref();
const sitesRef = ref.child("sites");

let siteUrl;

// Reply to /bookmark
bot.onText(/\/bookmark (.+)/, (msg, match) => {
  siteUrl = match[1];
  bot.sendMessage(msg.chat.id,'Got it, in which category?', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'Development',
          callback_data: 'development'
        },{
          text: 'Music',
          callback_data: 'music'
        },{
          text: 'Cute monkeys',
          callback_data: 'cute-monkeys'
        }
      ]]
    }
  });
});

// Callback query
bot.on("callback_query", (callbackQuery) => {
  const message = callbackQuery.message;
  // Scrap OG date
  ogs({'url': siteUrl}, function (error, results) {
    if(results.success) {
      // Push to Firebase
      console.log(results.data.ogSiteName)
      sitesRef.push().set({
        name: results.data.ogSiteName,
        title: results.data.ogTitle,
        description: results.data.ogDescription,
        url: siteUrl,
        thumbnail: results.data.ogImage.url,
        category: callbackQuery.data
      });
      // Reply 
      bot.sendMessage(message.chat.id,'Added \"' + results.data.ogTitle +'\" to category \"' + callbackQuery.data + '\"!');
    } else {
      // Push to Firebase
      sitesRef.push().set({
        url: siteUrl
      });
      // Reply 
      bot.sendMessage(message.chat.id,'Added new website, but there was no OG data!');
    }
  });
});