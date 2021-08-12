# How David Built a Serverless Slack Bot

By using the Slack Bolt framework, Node.js, JavaScript, and serverless web app hosting, David built a solution to save time and help with productivity.
## About Me

<img src=""/david-t.jpg>

My name is David Tetreau. I am a career changer aiming to transition into a career in Web Development. I have taken several non-traditional training programs on my path to being a Web Developer. I enjoy sharing knowledge with others who have the same goal!
## The Premise

The project I am building is a Slack bot for frequently asked questions. The bot can be connected to a workspace and brought into a specific channel. The user will be able to ask the bot questions and receive a response if the question is in its knowledge base. The knowledge base used for the bot is made from keywords, questions, and answers input by channel users. The updates are made by inputting slash commands. The knowledge base also contains chit chat.
## Tools used
The project is made with the Slack Bolt framework. This is a resource which eases the difficulty of making the bot. The documentation is located [here](https://slack.dev/bolt-js/tutorial/getting-started). The bot can be tailored to a user's needs with Node.js Also, the bot will be connected to communication channels via their respective adapters, config files, and packages.
## Step by step (with code snippets)
Here are the steps to making the app:
1. Create a workspace in Slack
2. Create a new Slack application in the Slack API dashboard
3. Click the Create New App button
4. Name the bot and then select what workspace the bot will be installed in
5. Push Create App and the dashboard for the app will appear
6. Go to OAuth and Permissions menu option on the left
7. Go to Scopes and give your bot the desired permissions 
8. Install the app to your workspace
9. Go to Settings > Install Apps > Install to Workspace.
10. On your local machine, create a directory and initialize npm:
11. mkdir your-dir-name && cd your-dir-name 
12.  npm init -y
13. Install the following packages in the directory:
- yarn add @slack/bolt
- yarn add -D nodemon dotenv
14. Edit your package.json to reflect the following:

...
  "main": "index.js",
  "scripts": {
    "dev": "nodemon app.js"
  },
....

15. Create a new file in your directory using touch app.js
16. Find your SLACK_SIGNING_SECRET by finding Basic Information > App Credentials > Signing Secret. 
17. Find your SLACK_BOT_TOKEN by finding Settings > Install App > Bot User oAuth Token. 
18. Create a .env file in the root directory of your project and include the following:

```JavaScript
SLACK_SIGNING_SECRET="YOUR SIGNING SECRET"
SLACK_BOT_TOKEN="YOUR BOT TOKEN"
```

19. Open app.js file and add the code below:

```JavaScript
const { App } = require("@slack/bolt");
require("dotenv").config();
// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

(async () => {
  const port = 3000
  // Start your app
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();
```

20. Enter yarn run dev in your terminal. This runs the program.
21. Generate a token by going to Settings > Basic Information > App-Level Tokens. Once there, click the Generate Token and Scopes button. Give your token a name, and give your app the scopes: connections:write and authorizations:read. 
22. Push the generate button and copy the token on the next screen into your .env file (create another variable and assign the token as its value).
23. Enable socket mode by going to Settings > Socket Mode and toggle socket mode. 
24. In app.js, make your code reflect the following:

```JavaScript
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode:true, // enable the following to use socket mode
  appToken: process.env.APP_TOKEN
});

```
25.  Create some slash commands by clicking the Slash Commands menu option on the left. Then click the Create New Command button, fill out the information for the /knowledge command (which prints the entire knowledge base), and click save. 
26. In your app.js file, add the following code:

```JavaScript
const { App } = require("@slack/bolt");
require("dotenv").config();
// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

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
    await client.chat.postEphemeral({ //this ensures that only the user sees the entire knowledge base
      channel: welcomeChannelId,
      user: command.user_id,
      text: "Here's my knowledge base!",
       blocks: message.blocks,
    });
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});


```
27. Click the subscribe to bot events dropdown and add the following events: 
message.channels, message.groups, message.im, message.mpim
28. Put this code in app.js. This will monitor every message and check if it contains
one of the keywords in its knowledge base. 

```
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

```

// require the fs module that's built into Node.js
const fs = require('fs')
// get the raw data from the db.json file
let raw = fs.readFileSync('db.json');
// parse the raw bytes from the file as JSON
let faqs= JSON.parse(raw);

29. Now put the following code in app.js. This will print the entire knowledge base in Slack:

```JavaScript
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
            text: "*Question*",
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
              text: "*Answer*",
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

```
We’re using blocks (provided by the Slack Bolt API) and markdown to format the messages we’ll be displaying to users. To further customize messages from your bot when they’re sent to the user, Slack provides a Block Kit Builder that you can use to get your desired template.

You can test this out by typing the command /knowledge in the private conversation with the ask-ztc-bot.

Test Command Bot Conversation
As you can see, it correctly lists all the FAQs in our knowledge base.

Next, we’ll use a simple regular expression to detect if a user has included the keyword products in their question. If they have, we’ll show them FAQs with the keyword products:

app.message(/products/, async ({ command, say }) => {
  try {
    let message = { blocks: [] };
    const productsFAQs = faqs.data.filter((faq) => faq.keyword === "products");

    productsFAQs.map((faq) => {
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
To test this out, send a message to the bot that includes the word products, and the bot will respond with all the information that has to do with the products keyword.

Test Bot Keywords Response
Updating the knowledge base
Finally, we want to give users the ability to add their own data to the knowledge base.

- Create a new Slash Command called /update. This command will be called by users to add new data to our knowledge base.

- We’ve made a slight change to this command. In the usage hint, we’ve specified that users should separate the different fields using the pipe | character. This way, we can take the input string sent by a user and split it using the pipe character.

```JavaScript
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
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});

```

- You can deploy your app to a platform like Heroku in the same way you would deploy a regular Node.js application. Don’t forget to change the URL in the event subscription section to the new one provided by Heroku.
## Challenges + lessons learned
At the beginning my goals were fairly lofty. I listed many services on my project plan. As the project progressed, the project architecture became much more simple and scalable. Also, while working with the Bolt Framework, I found it difficult to make the conversations thread. Although there was excellent documentation, there were several errors which were difficult to resolve. The errors had to do with generated code, and I had to have enough knowledge of the generated code to work out the issues. 
## Thanks and Acknowledgements
Thanks to Bit Project for sharing their talent, time, and expertise to teach motivated individuals from all walks of life the value of using serverless technologies. 