var multipart = require("parse-multipart");
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const { BlobServiceClient } = require("@azure/storage-blob");
const fetch = require('node-fetch');

module.exports = async function (context, myTimer, req) {
    var timeStamp = new Date().toISOString();

    let resp = await fetch("https://cataas.com/cat/cute/says/Bitcamp", {
        method: 'GET',
        headers: {"Content-type": "application/octet-stream"}
    });
    
    let data = await resp.arrayBuffer()
    context.log(data)
    data = Buffer.from(data).toString('base64')
    let cat = await getCatPic()
 
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {
            cat: cat
        }
    };

    context.log('JavaScript HTTP trigger function processed a request.');
    var body = cat;
    var parsedBody = multipart.Parse(body, boundary);
    context.log(parsedBody);
        
    var filetype = parsedBody[0].type;
    if (filetype == "image/png") {
        ext = "png";
    } else if (filetype == "image/jpeg") {
        ext = "jpeg";
    } else {
        username = "invalidimage"
        ext = "";
    }

    var responseMessage = await uploadFile(parsedBody, ext);
    context.res = {
        body: responseMessage
    };
    console.log(responseMessage)

    async function uploadFile(parsedBody, ext){
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        const containerName = "images"
        console.log('\nCreating container...');
        console.log('\t', containerName);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blobName = 'test' + "." + ext;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        console.log('\nUploading to Azure storage as blob:\n\t', blobName);
        const uploadBlobResponse = await blockBlobClient.upload(parsedBody[0].data, parsedBody[0].data.length);
        console.log("Blob was uploaded successfully. requestId: ", uploadBlobResponse.requestId);
        return "File Saved";    
}

    if (myTimer.isPastDue)
    {
        context.log('JavaScript is running late!');
    }
    context.log('JavaScript timer trigger function ran!', timeStamp);   
};