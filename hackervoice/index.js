module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    let password = req.query.password
    let response

    if(password === "letmein") {
        response = "Access granted"
    } else {
        response = "Access denied"
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: response
    };
}