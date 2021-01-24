//global parameters ------------------------------------------------------------------------------------------------------------
const urlParams = new URLSearchParams(window.location.search);
let id, username, session_id, standaardbody;
let domSearchbar, domSearchButton, domNotificationButton, domNotifications, domName, domLogout, domShowAllAlerts, domActivitylog, domSettings, domNotificationCount, domLeftColumn, domRightColumn, domAll, domMachineName;
let standaardUrl = "https://cocktailmakerfunction.azurewebsites.net/api/";

//callbacks (to display the jsonObject gotten from the api calls)----------------------------------------------------------------
//display the cocktails
const displayCocktails = function (jsonObject) {
  if (!jsonObject.hasOwnProperty('result')) {
    let halfLength = Math.ceil(jsonObject.length / 2);
    let left = jsonObject.slice(0, halfLength);
    let right = jsonObject.slice(halfLength, jsonObject.length);
    let leftHtml = "";
    let rightHtml = "";

    for (let i = 0; i < left.length; i++) {
      let obj = left[i];
      let html = `<div class="card shadow mb-4">
                  <!-- Card Header - Accordion -->
                  <a href="#collapseCard${obj.ID}" class="d-block card-header py-3 collapsed" data-toggle="collapse" role="button" aria-expanded="false" aria-controls="collapseCard${obj.name}">
                    <h6 class="m-0 font-weight-bold text-primary">${obj.name}</h6>
                  </a>
                  <!-- Card Content - Collapse -->
                  <div class="collapse" id="collapseCard${obj.ID}" style="">
                    <div class="card-body js-recipe-${obj.ID}">
                          This is a collapsable card example using Bootstrap's built in collapse
                          functionality. <strong>Click on the card header</strong> to see the card body
                          collapse and expand!
                    </div>
                  </div>
                </div>`;
      leftHtml += html;
      handleData(standaardUrl + `recipe/${obj.ID}`, displayRecipe, "POST", standaardbody);
    }
    for (let i = 0; i < right.length; i++) {
      let obj = right[i];
      let html = `<div class="card shadow mb-4">
                  <!-- Card Header - Accordion -->
                  <a href="#collapseCard${obj.ID}" class="d-block card-header py-3 collapsed" data-toggle="collapse" role="button" aria-expanded="false" aria-controls="collapseCard${obj.name}">
                    <h6 class="m-0 font-weight-bold text-primary">${obj.name}</h6>
                  </a>
                  <!-- Card Content - Collapse -->
                  <div class="collapse" id="collapseCard${obj.ID}" style="">
                    <div class="card-body js-recipe-${obj.ID}">
                          This is a collapsable card example using Bootstrap's built in collapse
                          functionality. <strong>Click on the card header</strong> to see the card body
                          collapse and expand!
                    </div>
                  </div>
                </div>`;
      rightHtml += html;
      handleData(standaardUrl + `recipe/${obj.ID}`, displayRecipe, "POST", standaardbody);
    }
    domLeftColumn.innerHTML = leftHtml;
    domRightColumn.innerHTML = rightHtml;
  }
  else {
    alert("Session expired, you will be redirected to the login page.");
    window.open("index.html", "_self");
  }
}

//display the recipes (in the collapse)
const displayRecipe = function (jsonObject) {
  let domRecipe = document.querySelector(`.js-recipe-${jsonObject.id}`);
  let parts = jsonObject.recipe.split(",");
  let html = "";
  for (let p in parts) {
    html += `<p>${parts[p]}<p>`;
  }
  html +=
    `
  <div class="btn btn-success btn-icon-split btn-lg js-make-cocktail-${jsonObject.id}">
	  <span class="icon text-white-50">
		  <i class="fas fa-cocktail"></i>
	  </span>
	  <span class="text">Make this cocktail!</span>
  </div>
  `;
  domRecipe.innerHTML = html;
  document.querySelector(`.js-make-cocktail-${jsonObject.id}`).addEventListener('click', function () {
    makeCocktail(jsonObject.id);
  });
}

const displaySearchResults = function (jsonObject) {
  if (!jsonObject.hasOwnProperty('result')) {
    if (jsonObject.length == 0) {
      domLeftColumn.innerHTML = "nothing to show here";
      domRightColumn.innerHTML = "";
    }
    else {
      displayCocktails(jsonObject);
    }
  }
  else {
    alert("Session expired, you will be redirected to the login page.");
    window.open("index.html", "_self");
  }
}

//display the notifications (under the bell) and notification count
const displayNotifications = function (jsonObject) 
{
  if (!jsonObject.hasOwnProperty('result')) 
  {
    let notifHtml = "";
    if (!jsonObject.length == 0) 
    {
      domNotificationCount.innerHTML = jsonObject.length;
      for (let i = 0; i < jsonObject.length; i++) 
      {
        let obj = jsonObject[i];
        let icon = "fa-glass-martini-alt";
        let bg = "bg-primary"
        if(obj.mode == "warning")
        {
          icon = "fa-exclamation-triangle";
          bg = "bg-warning";
        }
        let html = 
        `
          <div class="dropdown-item d-flex align-items-center">
            <div class="mr-3">
              <div class="icon-circle ${bg}">
                <i class="fas ${icon} text-white"></i>
              </div>
            </div>
            <div>
              <div class="small text-gray-500">December 12, 2019</div>
                <span class="font-weight-bold">${obj.message}</span>
            </div>
          </div>
        `;
        notifHtml += html;
      }
    }
    else
    {
      notifHtml += `<div class="dropdown-item text-center small text-gray-500">No New Notifications</div>`;
    }
    notifHtml += `<a class="dropdown-item text-center small text-gray-500 js-show-all-alerts" href="logboek.html?ID=${id}&name=${username}&session_id=${session_id}">Show All Alerts</a>`;
    domNotifications.innerHTML = notifHtml;
  }
  else {
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

//make cocktail----------------------------------------------------------------------------------------------------------------------
//make cocktail (not complete)
const makeCocktail = function (id) {
  console.log(id);
}

//listeners (everything that happens when there is a certain action)----------------------------------------------------------------
//searchbutton click
const listenToSearch = function () {
  if (domSearchbar.value) {
    handleData(standaardUrl + "search/" + domSearchbar.value, displaySearchResults, "POST", standaardbody);
  }
  else {
    domSearchbar.placeholder = "CAN'T SEARCH FOR NOTHING EH!"
  }
}

const listenToAll = function () 
{
  handleData(standaardUrl + "cocktails", displayCocktails, "POST", standaardbody);
}

const listenToNotifications = function()
{
  handleData(standaardUrl + "read/logs", function(jsonObject)
  {
    domNotificationCount.style.visibility = 'hidden';
  }, "POST", standaardbody);
  domNotificationButton.removeEventListener('click', listenToNotifications);
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

//init (executes when DOM is loaded)
const init = function () {
  //url parameters ophalen
  id = urlParams.get('ID');
  username = urlParams.get('name');
  session_id = urlParams.get('session_id');
  standaardbody = `{"ID": "${id}","session_id": "${session_id}"}`;

  //dom elementen zoeken
  domSearchbar = document.querySelector('.js-search-bar'); //done
  domSearchButton = document.querySelector('.js-search-button'); //done
  domAll = document.querySelector('.js-all'); //done
  domNotificationButton = document.querySelector('.js-notification-button'); //done
  domNotifications = document.querySelector('.js-notifications'); //done
  document.querySelector('.js-name').innerHTML = username; //done
  domLogout = document.querySelector('.js-logout'); //done
  domShowAllAlerts = document.querySelector('.js-show-all-alerts'); //done
  domActivitylog = document.querySelector('.js-activitylog'); //done
  domSettings = document.querySelector('.js-settings');
  domNotificationCount = document.querySelector('.js-notification-count'); //done
  domLeftColumn = document.querySelector('.js-left-column'); //done
  domRightColumn = document.querySelector('.js-right-column'); //done
  domMachineName = document.querySelector('.js-machine-name');

  //ophalen data
  handleData(standaardUrl + "cocktails", displayCocktails, "POST", standaardbody);
  handleData(standaardUrl + "logs/new", displayNotifications, "POST", standaardbody);

  //listeners linken
  domSearchButton.addEventListener('click', listenToSearch);
  domAll.addEventListener('click', listenToAll);
  domNotificationButton.addEventListener('click', listenToNotifications);
  domLogout.addEventListener('click', listenToLogout);
  domActivitylog.href = `logboek.html?ID=${id}&name=${username}&session_id=${session_id}`;
  domShowAllAlerts.href = `logboek.html?ID=${id}&name=${username}&session_id=${session_id}`;
  domSettings.addEventListener('click', listenToSetName);
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