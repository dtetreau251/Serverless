const { App } = require("@slack/bolt");
require("dotenv").config();
const fs = require('fs')

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
   socketMode:true, //enable to use socket mode
   appToken: process.env.APP_TOKEN
});

let raw = fs.readFileSync("db.json");
let faqs = JSON.parse(raw);
let data = faqs.data;
let keywords = ''

for(let i = 0; i < data.length; i++) {
  keywords += data[i].keyword + " ";
}

const welcomeChannelId = process.env.WELCOME_CHANNEL_ID;

// When a user joins the team, send a message in a predefined channel asking them to introduce themselves
app.event('channel_join', async ({ event, client }) => {
  try {
    
    // Call chat.postMessage with the built-in client
    const result = await client.chat.postMessage({
      channel: welcomeChannelId,
      text: `Welcome to the Wise-Guy channel, <@${event.user.id}>! 🎉 Ask me questions about the course. If I don't know the answer, an instructor or fellow students can answer. You can add a keyword, questions, and answers using /update.`
    });
    say(result);
  }
  catch (error) {
    console.error(error);
  }
});

app.message(async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  let text = '';
  keywords = '';

  for(let i = 0; i < data.length; i++) {
    keywords += data[i].keyword + " ";
    if(message.text.includes(data[i].keyword) && text == '') {
        text += data[i].answer
    } else if(message.text.includes(data[i].keyword) && text != '') {
        text += " Also, " + data[i].answer;
    } 
  }
    await say({
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `${text}`
          }
        }
    ],//blocks
    "thread_ts": message.thread_ts || message.ts
  });//say
})

app.command("/knowledge", async ({ command, ack, client }) => {
  try {
    await ack();
    let message = { blocks: [] };
    faqs.data.map((faq) => {
      message.blocks.push(
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Question ❓*",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: faq.question,
          },
        },
        {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Answer ✔*",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: faq.answer,
            },
          },
      );
    });
    await client.chat.postEphemeral({
      channel: welcomeChannelId,
      user: command.user_id,
      text: "Here's my knowledge base!",
       blocks: message.blocks,
    });
    //say(message);
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});

app.command("/update", async ({ command, ack, say }) => {
  try {
    await ack();
    let text = command.text.toLowerCase();
    const data = text.split("|");

    const newFAQ = {
      keyword: data[0].trim(),
      question: data[1].trim(),
      answer: data[2].trim(),
    };

    // save data to db.json
    fs.readFile("db.json", function (err, data) {
      const json = JSON.parse(data);
      json.data.push(newFAQ);
      fs.writeFile("db.json", JSON.stringify(json), function (err) {
        if (err) throw err;
        console.log("Successfully saved to db.json!");
      });
    }); 
    say(`You've added a new FAQ with the keyword *${newFAQ.keyword}.*`);
  } catch (error) {
    say(`Something went wrong`);
    console.log("err");
    console.error(error);
  }
});

app.command("/delete", async ({ command, ack, say }) => {
  try {
    await ack();
    let removeQuestion = command.text;
    let data = faqs.data
    faqs.data = data.filter((question) => { return question.keyword !== removeQuestion });
    fs.writeFileSync('db.json', JSON.stringify(faqs, null, 2));
    say(`You've deleted a new FAQ with the keyword *${command.text}.*`);
  } catch(error) {
    say(`Something went wrong`);
    console.log("err");
    console.error(error);
  }
});

(async () => {
  const port = 3000;

  // Start your app
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();