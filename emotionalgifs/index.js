const multipart = require('parse-multipart');
const fetch = require('node-fetch');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    let boundary = multipart.getBoundary(req.headers['content-type']);
    let body = req.body;
    let parts = multipart.Parse(body, boundary);
    let imageData = parts[0].data;
    let result = await analyzeImage(imageData);
    let emotions = result[0].faceAttributes.emotion;
    let objects = Object.values(emotions);
    let main_emotion = Object.keys(emotions).find(key => emotions[key] === Math.max(...objects));
    let gifUrl = await findGifs(main_emotion);

    context.res = {
        body: gifUrl
    };
    context.done();
}

async function analyzeImage(img) {
    let subscriptionKey = process.env.SUBSCRIPTIONKEY;
    let uriBase = process.env.ENDPOINT + '/face/v1.0/detect';

    let params = new URLSearchParams({
        'returnFaceId': 'true',
        'returnFaceAttributes': 'emotion'
    })

    let urlToUse = uriBase + '?' + params.toString();
    console.log(urlToUse)
    let resp = await fetch(urlToUse, {
        method: 'POST', 
        body: img,


        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': subscriptionKey
        }
    })

    let emotionData = await resp.json();
    return emotionData;

}

async function findGifs(emotion) {
    let giphykey = process.env.GIPHY_API
    let gifresponse = await fetch (`https://api.giphy.com/v1/gifs/translate?api_key=${giphykey}&s=${emotion}`);
    let gifresp = await gifresponse.json()
    return gifresp.data.url
}