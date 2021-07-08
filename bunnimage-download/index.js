const fetch = require('node-fetch');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const username = req.headers.username;
    let download;
    let success;

    let downloadpng = "https://bunnimage.blob.core.windows.net/images/" + username + ".png";
    let downloadjpg = "https://bunnimage.blob.core.windows.net/images/" + username + ".jpeg";

    let pngresp = await fetch(downloadpng, {
        method: 'GET',
     })
     let pngdata = await pngresp;
     
     let jpgresp = await fetch(downloadjpg, {
        method: 'GET',
     })
     let jpgdata = await jpgresp;

     // check which one is valid
     if (pngdata.statusText == "The specified blob does not exist." && jpgdata.statusText == "The specified blob does not exist." ) {
        success = false;
        context.log("Does not exist: " + data)
     } else if (pngdata.statusText != "The specified blob does not exist.") {
        success = true;
        download = downloadpng
        context.log("Does exist: " + data)
     } else if (jpgdata.statusText != "The specified blob does not exist.") {
        success = true;
        download = downloadjpg
        context.log("Does exist: " + data)
     }

    context.res = {
        // status: 200, /* Defaults to 200 */
        "body": {
            body: {
                "downloadUri": download,
                "success": success
            }
        }
    };
}