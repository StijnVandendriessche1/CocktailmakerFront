let domUsername, domMachineId, domPassword, domPasswordRepeat, domRegister;

const callbackLogin = function(jsonObject)
{
    if(jsonObject.hasOwnProperty('result'))
    {
      if(jsonObject.result == "succes")
      {
          window.open("index.html", "_self");
      }
      else
      {
        domUsername.value = "username already taken";
        domUsername.style.color = "#FF0000";
      }
    }
    else
    {
        console.log("failed to sign up");
    }
}

const listenToRegister = function()
{
    if(domUsername.value && domPassword.value)
    {
        if(domPassword.value == domPasswordRepeat.value)
        {
            let body = `{"name": "${domUsername.value}","password": "${domPassword.value}"}`;
            if(domMachineId.value)
            {
                body = `{"name": "${domUsername.value}","password": "${domPassword.value}","machine_id":${domMachineId.value}}`;
            }
            handleData("https://cocktailmakerfunction.azurewebsites.net/api/signup", callbackLogin, "POST", body);
        }
    }
}

const eventListenersToevoegen = function () 
{
    domRegister.addEventListener('click', listenToRegister);
};

const init = function()
{
    //ophalen dom elementen
    domUsername = document.querySelector(".js-username");
    domMachineId = document.querySelector(".js-machine-id");
    domPassword = document.querySelector(".js-password");
    domPasswordRepeat = document.querySelector(".js-password-repeat");
    domRegister = document.querySelector(".js-register");

    //listeners linken
    eventListenersToevoegen();

    //ophalen data
}

document.addEventListener('DOMContentLoaded', init);

const handleData = function(url, callback, method = 'GET', body = null) {
    fetch(url, {
      method: method,
      body: body,
      headers: { 'content-type': 'application/json' }
    })
      .then(function(response) {
        if (!response.ok) {
          throw Error(`Probleem bij de fetch(). Status Code: ${response.status}`);
        } else {
          console.info('Er is een response teruggekomen van de server');
          return response.json();
        }
      })
      .then(function(jsonObject) {
        console.info('json object is aangemaakt');
        console.info('verwerken data');
        callback(jsonObject);
      })
      .catch(function(error) {
        console.error(`fout bij verwerken json ${error}`);
      });
  };