 async function y1k3s() {
    let url = `https://twocatz3.azurewebsites.net/api/twocatz?name1=${document.getElementById("name1").value}&name2=${document.getElementById("name2").value}&name3=${document.getElementById("name3").value}&name4=${document.getElementById("name4").value}`
    console.log(url)
   let response = await fetch(url, {
        method: 'GET', 
    });

    let data = await response.json();

      document.getElementById("image1").src = "data:image/png;base64," + data.cat1
      document.getElementById("image2").src = "data:image/png;base64," + data.cat2
      document.getElementById("image3").src = "data:image/png;base64," + data.cat3
      document.getElementById("image4").src = "data:image/png;base64," + data.cat4
}
    