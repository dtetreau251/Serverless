const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const { BlobServiceClient } = require("@azure/storage-blob");
const fetch = require("node-fetch");

module.exports = async function (context, myTimer) {
    var timeStamp = new Date().toISOString(); 
    await fetch('https://cataas.com/cat')
        .then(async function(response) {
            context.log(response)
            let buffer = await response.arrayBuffer()
            context.log(data);
            let base64data = Buffer.from(buffer).toString('base64');
            //context.log(base64data);
            context.log('JavaScript HTTP trigger function processed a request.');
            return base64data;
        })
        .then(async function(data) {
            const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
            context.log(blobServiceClient);
            const containerName = "images"
            //context.log('\nCreating container...');
            //context.log('\t', containerName);
            const containerClient = blobServiceClient.getContainerClient(containerName);
            //context.log(containerClient);
            const blobName = 'cat' + '.' + 'jpeg';
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            //context.log('\nUploading to Azure storage as blob:\n\t', blobName);
            const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
            context.log("Blob was uploaded successfully. requestId: ", uploadBlobResponse.requestId);
            return "File Saved";    
        })


    if (myTimer.isPastDue)
    {
        context.log('JavaScript is running late!');
    }
    context.log('JavaScript timer trigger function ran!', timeStamp);   
};