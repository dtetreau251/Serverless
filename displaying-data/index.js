var JSONFormatter = require("json-formatter-js")

const myJSON = {
    "person" : {
      "age" : 14,
      "hair color" : "brown",
      "name" : "Morty Smith"
    }
  };

const formatter = new JSONFormatter(myJSON);

document.body.appendChild(formatter.render());
