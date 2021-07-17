
async function getImage(event) {
    event.preventDefault()
    const myform = document.getElementById("myform");
    const payload = new FormData(myform);
    console.log(payload);
    var username = document.getElementById("username").value;

    if (username.value != '') {
        $('#output').text("Thanks!")

        console.log("Posting your image...");

        try {
            const url = "https://bunnimage-upload.azurewebsites.net/api/bunnimage-upload";
            console.log("Image was uploaded, making POST request to Azure function")

            const resp = await fetch(url, {
                method: 'POST',
                headers: {
                    'codename': username.value
                },
                body: payload
            })

            var data = await resp.text();
            console.log(data);
            $('#output').text("Your image has been stored successfully!")
        } catch(err) {
            $('#output').text(err)
        }
    } else {
        alert("No name error.")
    }
}

function downloadImage() {
    let username = document.getElementById("downladusername".value)
    if(document.getElementById("downloadusername".value != '')) {
        let url = "https://bunnimage-download2.azurewebsites.net/api/bunnimage-download"
        
        console.log("Got file name, making GET request to download image")

        const resp = fetch(url, {
            method: 'GET',
            header: {
               'username': username
            }
        })

        console.log("Made GET request successfully")

        window.open(resp, _self)
    } else {
        alert("No name error.")
    }
}