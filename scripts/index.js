let domLogin, domUsername, domPassword;

const callbackLogin = function(jsonObject)
{
    if(jsonObject.hasOwnProperty('result'))
    {
      console.log(jsonObject.result);
    }
    else
    {
      window.open(`start.html?ID=${jsonObject.ID}&name=${jsonObject.name}&session_id=${jsonObject.session_id}`, "_self");
    }
}

const listenToLogin = function()
{
    if(domUsername.value && domPassword.value)
    {
        let body = `{"name": "${domUsername.value}","password": "${domPassword.value}"}`;
        domUsername.value = "";
        domPassword.value = "";
        handleData("https://cocktailmakerfunction.azurewebsites.net/api/login", callbackLogin, "POST", body);
    }
}

const eventListenersToevoegen = function () 
{
    domLogin.addEventListener('click', listenToLogin);
};

const init = function()
{
    //ophalen dom elementen
    domLogin = document.querySelector('.js-login');
    domUsername = document.querySelector('.js-username');
    domPassword = document.querySelector('.js-password');

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