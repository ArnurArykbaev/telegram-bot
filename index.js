const express = require("express");
const expressApp = express();
const axios = require("axios");
const path = require("path");
const port = process.env.PORT || 3000;
expressApp.use(express.static("static"));
expressApp.use(express.json());
require("dotenv").config();

/* require scenes, session */
const { Telegraf, Composer, Scenes, session, Markup } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

function primeFunc(n) {
  if(n < 2) {
    console.log('Число не может быть отрицательным или меньше единицы');
    return;
  }
  for(let i = 2; i < n; i++) {
    let isPrime = true;
    for(let j = 2; j < i; j++) {
      if(i % j == 0) {
        isPrime = false;
        break
      }
    }
    if(isPrime) console.log(i, 'prime')
  }
} 

primeFunc(10)
console.log('a'.charCodeAt(0))

/* SCENES func */
const startWizard = new Composer()
startWizard.on('text', async (ctx) => {
  await ctx.reply('Name:')
  return ctx.wizard.next()
})
const firstName = new Composer()
firstName.on('text', async (ctx) => {
  await ctx.reply('lastName:')
  return ctx.wizard.next()
})
const lastName = new Composer()
lastName.on('text', async (ctx) => {
  await ctx.reply('Chose:', Markup.inlineKeyboard([
    [Markup.button.callback('Telegram', 'Telegram')],
    [Markup.button.callback('WhatsApp', 'WhatsApp')]
  ]))
  return ctx.wizard.next()
})

const messenger = new Composer()
messenger.action('Telegram', async (ctx) => {
  await ctx.reply('right')
  return ctx.scene.leave();
})
messenger.action('WhatsApp', async (ctx) => {
  await ctx.reply('wrong')
  return ctx.scene.leave();
})


/* Scenes declare */
const menuScene = new Scenes.WizardScene('sceneWizard', startWizard, firstName, lastName, messenger)
const stage = new Scenes.Stage([menuScene])


expressApp.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

bot.command("start", (ctx) => {
  console.log(ctx.from);
  bot.telegram.sendMessage(ctx.chat.id, "Привет, Танечка <3", {});
  bot.telegram.sendPhoto(ctx.chat.id, {
    source: "res/h1.jpg",
  });
});

bot.hears( "Э",
  (ctx) => {
    console.log(ctx.from);
    bot.telegram.sendMessage(ctx.chat.id, "ЧО Э", {});
  }
);

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
      "шмонька",
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
      return;
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

bot.command("animals", async (ctx) => {
  console.log(ctx.from);
  await bot.telegram.sendPhoto(ctx.chat.id, {
    source: "res/animals.jpg",
  });
  let animalMessage = `КОШЬКИ ИЛИ СОБАЧЬКИ?`;
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

bot.action("dog", async (ctx) => {
  await bot.telegram.sendPhoto(ctx.chat.id, {
    source: "res/dog.webp",
  });
});
bot.action("cat", async (ctx) => {
  await bot.telegram.sendPhoto(ctx.chat.id, {
    source: "res/cat.webp",
  });
  await bot.telegram.sendAnimation(ctx.chat.id, "https://tenor.com/view/koollua-cat-dancing-gif-24490580");
});


/* middleware to scenes */
bot.use(session())
bot.use(stage.middleware())

bot.command('go', (ctx) => ctx.scene.enter('sceneWizard'))
bot.launch();
