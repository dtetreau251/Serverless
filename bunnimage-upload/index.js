var multipart = require("parse-multipart")
const connectionString = process.env.STORAGE_ACCOUNT_CONNECTION_STRING;
const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var boundary = multipart.getBoundary(req.headers['content-type']);
    var body = req.body;
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

    var responseMessage = await uploadFile(parsedBody, ext);

    context.res = {
        body: responseMessage
    };    

}

async function uploadFile(parsedBody, ext) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerName = process.env.CONTAINER_NAME;
    const containerClient = blobServiceClient.getContainerClient(containerName);    // Get a reference to a container
    const blobName = 'test.' + ext;    // Create the container
    const blockBlobClient = containerClient.getBlockBlobClient(blobName); // Get a block blob client
    const uploadBlobResponse = await blockBlobClient.upload(parsedBody[0].data, parsedBody[0].data.length);
    return 'File Saved'
}