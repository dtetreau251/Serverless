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
let timestamp = ''

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
  timestamp = message.ts;

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
      ],
      thread_ts: message.ts,
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
                "text": "Yes 😎",
                "emoji": true
              },
              "value": "Yes",
              "action_id": "button_click_yes"
            },
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "No 🙁",
                "emoji": true
              },
              "value": "No",
              "action_id": "button_click_no"
            }
          ]
        },
      ],//blocks
      thread_ts: message.ts,
    });//say
  }
// say() sends a message to the channel where the event was triggered   
});

app.action('button_click_yes', async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();
  await say({
    text: `Ok great!🎉🎉`,   
    thread_ts: timestamp
  });
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
          "text": "I'm calling the calvary 🐴. Don't forget to update me with /update so I will know the answer too!",
          "emoji": true
        }
      }
    ],
    thread_ts: timestamp
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
            text: "*Keyword 🗝*",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: faq.keyword,
          },
        },
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
        },
        {
          "type": "divider"
        }
      );
    });
    
    say({
      "blocks": message.blocks
    }) 
  } catch (error) {
    console.log("err");
    console.error(error);
  }
}) ;

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
  //questions = users
  //raw = data
  //faqs = json
});

(async () => {
  const port = 3000;

  // Start your app
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();