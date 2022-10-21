const express = require("express");
const expressApp = express();
const axios = require("axios");
const path = require("path");
const port = process.env.PORT || 3000;
expressApp.use(express.static("static"));
expressApp.use(express.json());
require("dotenv").config();

const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

expressApp.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

bot.command("start", (ctx) => {
  console.log(ctx.from);
  bot.telegram.sendMessage(ctx.chat.id, "Привет, Чикибамбони", {});
  bot.telegram.sendPhoto(ctx.chat.id, {
    source: "res/h1.jpg",
  });
});

bot.hears(
  (msg) => {
    const roughWords = [
      "лох",
      "соси",
      "жопу",
      "жопа",
      "хуй",
      "пидр",
      "пидор",
      "чмо",
      "придурок",
      "бебр",
      "лошара",
      "гей",
    ];
    let msgArr = msg.split(" ");
    let includesRoughWords = false;

    msgArr.forEach((message) => {
      if (roughWords.includes(message.toLowerCase())) {
        includesRoughWords = true;
        return;
      }
    });

    if (includesRoughWords == true) {
      return true;
    } else {
      return false;
    }
  },
  (ctx) => {
    console.log(ctx.from);

    const randomMessageArray = [
      "Э",
      "Сама такая",
      "Залупопа",
      "Сказала кваказябра",
      "Соси бибу",
    ];
    let random = Math.floor(Math.random() * randomMessageArray.length);
    const message = randomMessageArray[random];

    bot.telegram.sendMessage(ctx.chat.id, message, {});

    const randomImageeArray = [
      "res/1.jpeg",
      "res/2.jpg",
      "res/3.jpg",
      "res/4.jpg",
      "res/5.jpg",
      "res/6.jpg",
      "res/7.jpg",
      "res/8.jpg",
      "res/9.jpg",
    ];
    let randomImg = Math.floor(Math.random() * randomImageeArray.length);
    const Imagee = randomImageeArray[randomImg];
    bot.telegram.sendPhoto(ctx.chat.id, {
      source: Imagee,
    });
  }
);

bot.hears(
  (text) => {
    text = text.toLowerCase();
    const array = text.split(" ");
    let result = false;
    array.forEach((word) => {
      if (word === "арнурка" || word === "люблю") {
        result = true;
        return;
      }
    });
    return result;
  },
  (ctx) => {
    console.log(ctx.from);

    const randomMessageArray = [
      "Люблюююю",
      "Чмок",
      "Пипирка",
    ];
    let random = Math.floor(Math.random() * randomMessageArray.length);
    const message = randomMessageArray[random];

    bot.telegram.sendMessage(ctx.chat.id, message, {});

    const randomImageeArray = [
      "res/-1.jpg",
      "res/-2.webp",
    ];
    let randomImg = Math.floor(Math.random() * randomImageeArray.length);
    const Imagee = randomImageeArray[randomImg];
    bot.telegram.sendPhoto(ctx.chat.id, {
      source: Imagee,
    });
  }
);

bot.command("ethereum", (ctx) => {
  var rate;
  console.log(ctx.from);
  axios
    .get(
      `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`
    )
    .then((response) => {
      console.log(response.data);
      rate = response.data.ethereum;
      const message = `Hello, today the ethereum price is ${rate.usd}USD`;
      bot.telegram.sendMessage(ctx.chat.id, message, {});
    });
});

bot.hears("animals", (ctx) => {
  console.log(ctx.from);
  let animalMessage = `great, here are pictures of animals you would love`;
  ctx.deleteMessage();
  bot.telegram.sendMessage(ctx.chat.id, animalMessage, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "dog",
            callback_data: "dog",
          },
          {
            text: "cat",
            callback_data: "cat",
          },
        ],
      ],
    },
  });
});

bot.action("dog", (ctx) => {
  bot.telegram.sendPhoto(ctx.chat.id, {
    source: "res/dog.webp",
  });
});
bot.action("cat", (ctx) => {
  bot.telegram.sendPhoto(ctx.chat.id, {
    source: "res/cat.webp",
  });
});

bot.launch();
