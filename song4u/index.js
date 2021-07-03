const querystring = require('querystring');
const fetch = require('node-fetch');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const queryObject = querystring.parse(req.body);
    const url = queryObject.MediaUrl0;
    const binaryData = await downloadImage(url);
    const faceData = await getFaceData(binaryData)
    const age = faceData[0].faceAttributes.age.toString()
    context.log(age)

    const generation = determineAge(age)
    const song = getSong(generation)
    context.log("GENERATION: " + generation)

    context.res = {
        body: `We guessed you're part of this generation: ${generation}! Happy listening! ${song}`
    };
}

async function downloadImage(imgUrl) {
    let resp = await fetch(imgUrl,{
        method: 'GET',
    })

    let data = await resp.arrayBuffer();
    return data;
}

async function getFaceData(binaryData) {

    const subKey = process.env['SUBSCRIPTIONKEY'];
    const uriBase = process.env['ENDPOINT'] + 'face/v1.0/detect'

    let params = new URLSearchParams({
        'returnFaceId': 'true',
        'returnFaceAttributes': 'age' 
    });

    const urlToUse = uriBase + '?' + params.toString()
    // making the post request
    let resp = await fetch(urlToUse,{
        method: 'POST',
        body: binaryData,
        headers: {
            'Content-Type' : 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': subKey
        }
    })
    // receive the response
    let data = await resp.json();
    return data;
}

function determineAge(ageString) {
    let age = parseInt(ageString);
    if (age > 5 && age < 25) {
        return "GenZ"
    }
    else if (age > 24 && age < 41) {
        return "GenY"
    }
    else if (age > 40 && age < 57) {
        return "GenX"
    }
    else if (age > 56 && age < 76) {
        return "BabyBoomers"
    }
    else {
        return "Unknown"
    }
}

function getSong(gen) {
    const songs = {"GenZ":"https://open.spotify.com/track/0SIAFU49FFHwR3QnT5Jx0k?si=1c12067c9f2b4fbf", 
    "GenY":"https://open.spotify.com/track/1Je1IMUlBXcx1Fz0WE7oPT?si=a04bbdf6ec4948b9", 
    "GenX":"https://open.spotify.com/track/4Zau4QvgyxWiWQ5KQrwL43?si=790d9e3ef2ed408d", 
    "BabyBoomers":"https://open.spotify.com/track/4gphxUgq0JSFv2BCLhNDiE?si=1abb329f2dc24f50", 
    "Unknown":"https://open.spotify.com/track/5ygDXis42ncn6kYG14lEVG?si=84b49b41d09d4d11"}

    return songs[gen]
}