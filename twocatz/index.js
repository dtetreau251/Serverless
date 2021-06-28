fetch = require('node-fetch')

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    async function getCat() {
        let resp = await fetch("https://cataas.com/cat/says/Serverless", { method: "GET" });
        let data = await resp.arrayBuffer();

        let base64data = Buffer.from(data).toString('base64');
        return base64data
    }

    function getNames(arr) {
        return arr[Math.floor(Math.random()*arr.length)];
    }

    let cats = [];
    let avaNames = ["Shreya", "Emily", "Fifi", "Beau", "Evelyn", "Julia", "Daniel", "Fardeen"];
    let chosenNames = [];

    for (var i=0; i<2; i++) {
        cats.push(await getCat());
    }

    for (var i=0; i<2; i++) {
        chosenNames.push(getNames(avaNames))
    }


    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {
            cat1: cats[0],
            cat2: cats[1],
            names: [chosenNames[0], chosenNames[1]]
        }

    };
}