const multipart = require('parse-multipart');
const fetch = require('node-fetch');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var boundary = multipart.getBoundary(req.headers['content-type']);
    var body = req.body;
    var parts = multipart.Parse(body, boundary);
    var imageData = parts[0].data;
    var result = await analyzeImage(imageData);
    var emotions = result[0].faceAttributes.emotion;
    var objects = Object.values(emotions);
    var main_emotion = Object.keys(emotions).find(key => emotions[key] === Math.max(...objects));
    var gifUrl = await findGifs(main_emotion);

    context.res = {
        body: gifUrl;
    };
}

async function analyzeImage(img) {
    var subKey = process.env.SUBSCRIPTIONKEY;
    var uriBase = process.env.ENDPOINT + '/face/v1.0/detect';

    var params = new URLSearchParams({
        'returnFaceId': 'true',
        'returnFaceAttributes': 'emotion'
    })

    var urlToUse = uriBase + '?' + params.toString();
    console.log(urlToUse)
    var resp = await fetch(urlToUse, {
        method: 'POST', 
        body: img,


        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': subKey
        }
    })

    var data = await resp.json();
    return data;

}

async function findGifs(emotion) {
    var giphykey = process.env.GIPHY_API
    var apiResult = await fetch (`https://api.giphy.com/v1/gifs/translate?api_key=${giphykey}&s=${emotion}`);
    var gifresp = await gifresponse.json()
    return gifresp.data.url
}