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
      text: `Welcome to the Wise-Guy channel, <@${event.user.id}>! 🎉 Ask me about the course. You can add questions and answers using /update. You can also ask for help from others using /ticket.`
    });
    console.log(result);
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
        text += "Also, " + data[i].answer;
    } 
  }
  if(message.text == "hi" || message.text == "hey" || message.text == "hello") {
    await say({
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `${text}`
          }
        }
      ]
    });
  } else {
      await say({
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `${text}`
            }
          },
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `Did this answer your question?`
            }
         },
        {
          "type": "actions",
          "elements": [
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "Yes",
                "emoji": true
              },
              "value": "Yes",
              "action_id": "button_click_yes"
            },
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "No",
                "emoji": true
              },
              "value": "No",
              "action_id": "button_click_no"
            }
          ]
        },
      ]//blocks
    });//say
  }
// say() sends a message to the channel where the event was triggered   
});

app.action('button_click_yes', async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();
  await say(`Ok great!🎉🎉`);
});

app.action('button_click_no', async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();
  await say({
    "blocks": [
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "Try asking in a different way. If this doesn't work, ask for help. Don't forget to update me with /update so I will know the answer too!",
          "emoji": true
        }
      }
    ]
  })
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
    await ack()
   const jsonRecords= fs.readFile("db.json", function (err, data) {
      const records = JSON.parse(jsonRecords)
      const filteredRecords = records.filter(record => record.id !== id)
      fs.writeFile("db.json",  JSON.stringify(filteredRecords, null, 2)), function (err) {
        if (err) throw err;
        say("Successfully deleted your file.");
      }; 
    }); 
    console.log(jsonRecords)
    say(`You've deleted a FAQ *${text}.*`);
  } catch (error) {
    say(`There was a problem. Try again.`);
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