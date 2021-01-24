const urlParams = new URLSearchParams(window.location.search);
let id, username, session_id, standaardbody;
let domBack, domSettings, domLogout, domContent;
let standaardUrl = "https://cocktailmakerfunction.azurewebsites.net/api/";

const displayLogs = function (jsonObject) 
{
    if (!jsonObject.hasOwnProperty('result'))
    {
        let htmlTable = "";
        for(let i = 0; i < jsonObject.length; i++)
        {
            let obj = jsonObject[i];
            let icon = "fa-glass-martini-alt";
            let bg = "btn-primary";
            if (obj.mode == "warning") 
            {
                icon = "fa-exclamation-triangle";
                bg = "btn-warning";
            }
            let html =
            `<tr role="row">
                <td><div class="btn ${bg} btn-circle btn-lg"><i class="fas ${icon}"></i></div></i></td>
                <td colspan="2">${obj.message}</td>
                <td>${obj.mode}</td>
            </tr>
            `;
            htmlTable += html;
        }
        domContent.innerHTML = htmlTable;
    }
    else
    {
        alert("Session expired, you will be redirected to the login page.");
        window.open("index.html", "_self");
    }
}

const checkLogout = function(jsonObject)
{
  if(jsonObject.result == "succes")
  {
    window.open("index.html", "_self");
  }
}

const listenToLogout = function()
{
  handleData(standaardUrl + "logout", checkLogout, "POST", standaardbody);
}

const listenToSetName = function()
{
  if(domMachineName.value)
  {
    if(domMachineName.value.length < 17)
    {
      handleData(standaardUrl + "machine/setname/" + domMachineName.value, function(jsonObject)
      {
        if(jsonObject.result === "succes")
        {
          alert("succes");
          location.reload();
        }
      }, "POST", standaardbody);
    }
  }
}

const init = function () {
    //url parameters ophalen
    id = urlParams.get('ID');
    username = urlParams.get('name');
    session_id = urlParams.get('session_id');
    standaardbody = `{"ID": "${id}","session_id": "${session_id}"}`;

    //dom elementen zoeken
    domLogout = document.querySelector('.js-logout'); //done
    domSettings = document.querySelector('.js-settings'); //done
    document.querySelector('.js-name').innerHTML = username; //done
    domBack = document.querySelector('.js-back');
    domContent = document.querySelector('.js-content');
    domMachineName = document.querySelector('.js-machine-name');

    //ophalen data
    handleData(standaardUrl + "logs/all", displayLogs, "POST", standaardbody);

    //listeners linken
    domSettings.addEventListener('click', listenToSetName);
    domLogout.addEventListener('click', listenToLogout);
    domBack.addEventListener('click', function()
    {
        window.open(`start.html?ID=${id}&name=${username}&session_id=${session_id}`, "_self")
    });
}

document.addEventListener('DOMContentLoaded', init);

//dataHandler (handles api requests)
const handleData = function (url, callback, method = 'GET', body = null) {
    fetch(url, {
        method: method,
        body: body,
        headers: { 'content-type': 'application/json' }
    })
        .then(function (response) {
            if (!response.ok) {
                throw Error(`Probleem bij de fetch(). Status Code: ${response.status}`);
            } else {
                return response.json();
            }
        })
        .then(function (jsonObject) {
            callback(jsonObject);
        })
        .catch(function (error) {
            console.error(`fout bij verwerken json ${error}`);
        });
};