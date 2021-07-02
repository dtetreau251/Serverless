const querystring = require('querystring');
const fetch = require('node-fetch');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');	
    context.log(req.body)	
    const queryObject = querystring.parse(req.body);
    const url = queryObject.MediaUrl0;

    const binaryData = await downloadImage(url);
    const faceData = await getFaceData(binaryData)
    const age = faceData[0].faceAttributes.age.toString()
    context.log(age)

    const generation = determineAge(age)
    context.log("GENERATION: " + generation)


    context.res = {	    
        body: `${generation}`
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

    const subKey = process.env['SUBSCRIPTION_KEY'];
    const uriBase = process.env['API_ENDPOINT'] + 'face/v1.0/detect'

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

function determineAge(age) {
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
