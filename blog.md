# Serverless Bot

## About Me
My name is David Tetreau. I am a career changer aiming to transition into a career in Web Development. I have taken several non- traditional training programs on my path to being a Web Developer. I enjoy sharing knowledge with others who have the same goal!
## The Premise
The project I am building is an Azure QnA Maker bot. The bot will be connected to communication channels (i.e. Slack, Twilio (SMS), etc.). The user will be able to ask the bot questions about the Bit Project Intro To Serverless Program. The knowledge base used for the bot is made from questions that have been asked by other students. The knowledge base is also made from frequently asked questions on Azure pages. 
## Tools used
The project use QnAMaker. This is a resource which eases the difficulty of making the bot. The bot also uses LUIS (Language Understanding) - Cognitive Services - Microsoft Language Understanding (LUIS) is a machine learning-based service to build natural language into apps. Also, the bot will be connected to communication channels via their respective adapters, config files, and packages. 
## Step by step (with code snippets)
**These instructions were adapted from these documents**
[Connect a bot to Twilio](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-channel-connect-twilio?view=azure-bot-service-4.0)
[Quickstart: Create, train, and publish your QnA Maker knowledge base](https://docs.microsoft.com/en-us/azure/cognitive-services/QnAMaker/Quickstarts/create-publish-knowledge-base?tabs=v1)

1. Sign into the QnAMaker.ai portal with Azure credentials (student credentials if you are a student).
2. In the QnA Maker portal, create a knowledge base.
<img src="./project/Knowledge base.PNG/>

3. On the create page, either make a QnA Maker resource if you don't have one proceed to connecting your knowledge base to your AnA service. This involves configuration settings and naming your KB.
<img src="./project/connect.PNG>

4. Create your knowledge base by either adding questions and answer pairs manually, providing URLs to FAQ pages from the internet, or both. 
5. Publish the knowledge base
6. Create a bot with the "Create Bot" button
<img src="./project/create.png>

7. Test the bot under "Test in Web Chat"
8. Log into your communication channel. We will use Twilio. 
9. Create a TwiML Application
10. Select or add a phone number
11. Specify application to use for Voice and Messaging
12. Gather credentials
13. Submit credentials
14.Connect the bot to Twilio using the Twilio adapter
15. Code a Twilio adapter class

```
public class TwilioAdapterWithErrorHandler : TwilioAdapter
{
    public TwilioAdapterWithErrorHandler(IConfiguration configuration, ILogger<BotFrameworkHttpAdapter> logger)
            : base(configuration, logger)
        {
            OnTurnError = async (turnContext, exception) =>
            {
                // Log any leaked exception from the application.
                logger.LogError(exception, $"[OnTurnError] unhandled error : {exception.Message}");

                // Send a message to the user
                await turnContext.SendActivityAsync("The bot encountered an error or bug.");
                await turnContext.SendActivityAsync("To continue to run this bot, please fix the bot source code.");

                // Send a trace activity, which will be displayed in the Bot Framework Emulator
                await turnContext.TraceActivityAsync("OnTurnError Trace", exception.Message, "https://www.botframework.com/schemas/error", "TurnError");
            };
        }
}

```

16. Create a new controller for handling Twilio requests

```
[Route("api/twilio")]
[ApiController]
public class TwilioController : ControllerBase
{
    private readonly TwilioAdapter _adapter;
    private readonly IBot _bot;

    public TwilioController(TwilioAdapter adapter, IBot bot)
    {
        _adapter = adapter;
        _bot = bot;
    }

    [HttpPost]
    [HttpGet]
    public async Task PostAsync()
    {
        // Delegate the processing of the HTTP POST to the adapter.
        // The adapter will invoke the bot.
        await _adapter.ProcessAsync(Request, Response, _bot, default);
    }
}
```

17. Inject the Twilio adapter in your bot startup.cs

```
services.AddSingleton<TwilioAdapter, TwilioAdapterWithErrorHandler>();
```

18. Obtain a URL from your bot
19. Add Twilo app settings to your bot's configuration file
20. Complete configuration of your Twilio number
21. Test your bot with adapter in Twilio
22. You're ready!
## Challenges + lessons learned
At the beginning my goals were fairly lofty. I listed many services on my project plan. As the project progressed, the project architecture became much more simple and scalable. Also, while working with the MS Bot Framework Composer, there were several errors which were difficult to resolve. The errors had to do with generated code, and I had to have enough knowledge of the generated code to work out the issues. 
## Thanks and Acknowledgements
Thanks to Bit Project for sharing their talent, time, and expertise to teach motivated individuals from all walks of life the value of using serverless technologies. 