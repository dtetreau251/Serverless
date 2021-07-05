var multipart = require("parse-multipart")
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.log(connectionString)

    var boundary = multipart.getBoundary(req.headers['content-type']);
    var body = req.body;
    var responseMessage = "";
    var headers = req.headers;
     
    if (body == null) {
        responseMessage = "Sorry! No image attached."
    } else {
        var password = headers['codename'];
        var parsedBody = multipart.Parse(body, boundary);
        // get the file extension
        var ext = determineExt(parsedBody[0].type);
        // upload the file to blob
        responseMessage = await uploadFile(parsedBody, ext, password);
    }

    context.res = {
        body: responseMessage
    }
}

async function uploadFile(parsedBody, ext, password) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerName = process.env.CONTAINER_NAME;
    const containerClient = blobServiceClient.getContainerClient(containerName);    // Get a reference to a container
    const blobName = password + "." + ext;    // Create the container
    const blockBlobClient = containerClient.getBlockBlobClient(blobName); // Get a block blob client
    const uploadBlobResponse = await blockBlobClient.upload(parsedBody[0].data, parsedBody[0].data.length);
    return uploadBlobResponse;
}

function determineExt(filetype) {
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
    return ext
}