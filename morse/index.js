const morse = require("morse-code-converter");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    let plaintext = req.query.plaintext
    const code = morse.textToMorse(plaintext); // .... . -.--   .... --- .--   .- .-. .   -.-- --- ..- ..-..
    //const text = morse.morseToText(code); // HEY HOW ARE YOU?

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: code
    };
}