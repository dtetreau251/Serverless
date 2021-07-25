const { App } = require("@slack/bolt");
require("dotenv").config();
// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
   socketMode:true, //enable to use socket mode
   appToken: process.env.APP_TOKEN
});

const fs = require("fs");
let raw = fs.readFileSync("db.json");
let faqs = JSON.parse(raw);
let data = faqs.data;
let keywords = data.map(data.keyword);
console.log(keywords);

app.message(/^(hi|hello|hey).*/, async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say({
      blocks: [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `Hey there <@${message.user}>. What can I help you with?`
          }
        }
      ],
      text: `Hey there <@${message.user}>. What can I help you with? `
    });
  });

  app.message(`${keywords}`, async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    let text;
    keywords = '';

    for(let i = 0; i < data.length; i++) {
      keywords += data[i].keyword + " ";
      if(message.text.includes(data[i].keyword) && text == undefined) {
          text = data[i].answer
      } 
    }
      // say() sends a message to the channel where the event was triggered
    await say({
      blocks: [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `${text} ...Does this help?`
          },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "No"
          },
          "action_id": "button_click_no"
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Yes"
          },
          "action_id": "button_click_yes"
        }
      }
    ],
    text: `Hey there <@${message.user}>!`
  });
});

app.action('button_click_yes', async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();
  await say(`Ok great!`);
});

app.action('button_click_no', async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();
  await say(`Try rephrasing your question. If this doesn't help, message an instructor or other students for help. Don't forget to use /update if you find the answer so I will know how to help next time.`);
});

app.command("/knowledge", async ({ command, ack, say }) => {
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
            text: "*Answer ✔️*",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: faq.answer,
          },
        }
      );
    });
    say(message);
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});

app.message(/Error/, async ({ command, say }) => {
  try {
    let message = { blocks: [] };
    const errorFAQs = faqs.data.filter((faq) => faq.keyword === "error");

    errorFAQs.map((faq) => {
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
            text: "*Answer ✔️*",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: faq.answer,
          },
        }
      );
    });

    say(message);
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});

app.command("/update", async ({ command, ack, say }) => {
  try {
    await ack();
    const data = command.text.split("|");

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
    keywords = '';

    for(let i = 0; i < data.length; i++) {
      keywords += data[i].keyword + " "; 
    }
     
  } catch (error) {
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