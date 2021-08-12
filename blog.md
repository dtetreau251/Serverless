# How David Built a Serverless Slack Bot

By using the Slack Bolt framework, Node.js, JavaScript, and serverless web app hosting, David built a solution to save time and help with productivity.

If you use Slack for work or school, you know that team members and/or instructors answer many of the same questions repeatedly, thus reducing their productivity. What is needed is a solution that allows team members/classmates/instructors to grow a knowledge base and have these questions answered by a bot in Slack. This project aims to do just that!

Wise-Guy, a Serverless Slack Bot, aims to help alleviate that stress, and will help boost productivity. It works by using slash commands in Slack to update the knowledge base. The bot then monitors whatever channel it is added to for keywords. If it recognizes one of the keywords, it will reply with a threaded conversation.
## About Me

<img src=""/david-t.jpg>

My name is David Tetreau. I am a career changer aiming to transitioning into a career in web development. I have taken several non-traditional training programs on my path to being a Web Developer. I enjoy sharing knowledge with others who have the same goal!
## Behind the scenes (include and describe flowchart)

<img src ="./project/Serverless Camp Project.png>

The chart above was the initial project plan. It included a much more complex architecture. The architecture was simplified and includes a Node.js app deployed to a serverless platform, the Slack Bolt Framework, and a JSON file which acts as a simple database. The conversation channel that interacts with the bot was simplified to only interact with Slack.
## The Technologies
The project is made with the Slack Bolt framework. This is a resource which eases the difficulty of making the bot. The documentation is located [here](https://slack.dev/bolt-js/tutorial/getting-started). The bot can be tailored to a user's needs with JavaScript/Node.js Also, the bot will be connected to communication channels via their respective adapters, config files, and packages. The project can be deployed to a platform like Azure in the same way you would deploy a regular Node.js application.
# Moving forward
There are a number of additional features which can be added to this bot. The bot can DM channel members if the bot doesn't know the answer to their question, there is a block builder kit to include features such as buttons and modals. Who knew you could customize and automate Slack to do exactly what you want it to do? What's more, who knew that you can incorporate serverless technologies such as Azure to host such a solution? I can't wait to see what you build with it!
## Thanks and Acknowledgements
Thanks to Bit Project for devoting their talent, time, and expertise to teaching students from all walks of life the value of using serverless technologies.