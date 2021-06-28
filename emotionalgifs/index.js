var multipart = require('parse-multipart');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // here's your boundary:
    var boundary = multipart.getBoundary(req.headers['content-type']);
  
    // TODO: assign the body variable the correct value
    var body = req.query.body

    // parse the body
    var parts = multipart.Parse(body, boundary);
    var convertedResult = Buffer.from(parts[0].data).toString('base64');
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: convertedResult
    };
}