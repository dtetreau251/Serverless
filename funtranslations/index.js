// var twilio = require('twilio');
// var accountSid = ACCOUNT_SID; 
// var authToken = AUTH_TOKEN;
// var toNumber = TO_NUMBER;
// var fromNumber = FROM_NUMBER;
// var client = new twilio(accountSid, authToken);

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    const params = {
        text: 'Master Obiwan has arrived'
    };
    const options = {
        method: 'POST',
        body: JSON.stringify( params ),
        headers: {
            'Content-Type': 'application/json'
        }  
    };
    await fetch( 'https://api.funtranslations.com/translate/yoda.json?', options )
    .then( response => response.json() )
    .then( data => {
        console.log(data)
        var result = data.contents.translated
        console.log('Success:', data)
        context.res = {
            body: result
        }
        // client.messages.create({
        //     body: data.contents.translated,
        //     to: toNumber,  
        //     from: fromNumber 
        // })
        // .then((message) => console.log(message.sid))
    } )
    .catch((error) => {
        console.error('Error:', error);
    });
}