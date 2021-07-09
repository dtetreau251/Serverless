var multipart = require("parse-multipart")
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    var boundary = multipart.getBoundary(req.headers['content-type']);
    var body = req.body;
    var responseMessage = ""

    try {
        var parsedBody = multipart.Parse(body, boundary);
        var filetype = parsedBody[0].type;
        if (filetype == "image/png") {
            ext = "png";
        } else if (filetype == "image/jpeg") {
            ext = "jpeg";
        } else if (filetype == "image/jpg") {
            ext = "jpg"
        } else {
            username = "invalidimage"
            ext = "";
        }
        var password = req.headers['codename'];
        responseMessage = await uploadFile(parsedBody, password, ext);
    }
    catch(err) {
        context.log(err)
        context.log("Undefined body image");
        responseMessage = "Sorry! No image attached."
    }

    context.res = {
        body: responseMessage
    };
    console.log(responseMessage)
}

async function uploadFile(parsedBody, password, ext){
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerName = "images";
    console.log('\nCreating container...');
    console.log('\t', containerName);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobName = password + '.' + ext;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    console.log('\nUploading to Azure storage as blob:\n\t', blobName);
    const uploadBlobResponse = await blockBlobClient.upload(parsedBody[0].data, parsedBody[0].data.length);
    console.log("Blob was uploaded successfully. requestId: ", uploadBlobResponse.requestId);
    return "File Saved";    
}
