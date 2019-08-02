const TelegramBot = require('node-telegram-bot-api');
const ogs = require('open-graph-scraper');
const firebase = require('firebase');
const response_template = require('./response_template');

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
const sitesRef = ref.child("subae");

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

// Reply to /add
bot.onText(/\/add/, (msg, match) => {

  bot.sendMessage(msg.chat.id, response_template.answer_add).then(
    (success) => {
      bot.sendMessage(msg.chat.id, response_template.answer_add_3);
    }
  );

});

// Reply to /add
bot.onText(/🎫New tool : ECA🎫/, (msg, match) => {

  res = parse_form(msg.text)

  sitesRef.child(res['indo'].toLowerCase()).push().set(res).then(
    (success) => {
      bot.sendMessage(msg.chat.id, res['name'] + ' ajouté!');
    },
    (error) => {
      console.log(error)

    }
  )
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


function parse_form( message) {
  let header_list = ['name', 'indo', 'indo_com', 'date', 'place', 'phone']
  let array = message.split('\n').filter( item => item.trim() ).filter( item => item.indexOf(':') != -1 )

  let infos_list = array.map( item => {

    return item.split(':')[1]
  })

  infos_list.shift()

  var result = {};

  if (header_list.length === infos_list.length) {
    header_list.forEach((key, i) => result[key] = infos_list[i].trim());
  }

  return result

  console.log(result)



}