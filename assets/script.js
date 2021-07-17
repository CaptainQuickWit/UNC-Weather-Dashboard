const APIKey = "2a2005a0ff35a5631cce91e317e7d835"; //API key unique to each acct

var currentForecastCard = $('#current');
var weekForecastCard = $('#weekForecast');
var userInputEle = $('.form-input');
var historyEle = $('#history');
var searchBtn = $('#search-button');
var searchHistory = [];
var userInput;

window.addEventListener('DOMContentLoaded', (event) => {

  getSearchHistory();
});



function helperFetchUVImg (getUVURL) {
  fetch (getUVURL)
    .then(function (response) {
                        console.log('responseUVQUERY'+response);
                        let uvIndex = $('<span class = "badge badge-danger">');
                        uvIndex.text(response.data[0].value);
                        currentForecastCard.append(uvIndex);
                    }
        );
}

/**
 * event listener for submit button
 */
searchBtn.on("click", function(event) {
  //historyEle.html('');
  getSearchHistory();
  currentForecastCard.html('');
  weekForecastCard.html('');
  event.preventDefault();
  userInput = userInputEle.val();
  console.log('userInput==>'+userInput);
  //getWeather(userInput);
  fetchWeather(userInput);
  saveSearch(userInput);
  getSearchHistory();
  
});

function getSearchHistory (input) {
  var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  historyEle.html('');
  // Check if data is returned, if not exit out of the function
  if (searchHistory !== null) {

    var historyValue
    var storedUserInput;
    var val;

    for (var i = 0; i < searchHistory.length; i++) {
      val = searchHistory[i];
      historyValue = $('<p>').text(val);
      historyValue.addClass('hover'); //when hovering mouse it will turn green

      historyValue.on("click",function(event) {
        
        event.preventDefault();
        console.log('userInputStoredInHistory==>'+val);
        fetchWeather(val);

      });

      historyEle.append(historyValue);



    }
  
  } else {
    var searchHistory = [];
    return;
  }

}

function saveSearch(input) {
  console.log('searchhistoryB4==>'+searchHistory);
  searchHistory.push(input);
  console.log('searchhistoryAFTER==>'+searchHistory);
  // Use .setItem() to store object in storage and JSON.stringify to convert it as a string
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}


/**
 * gets the data out from the object that has been retreived from the server
 * @param {the object of the data being fetched from the server api} data 
 * @param {the index of the loop; this function will be used multiple times} index 
 */
function fetchData (data, index) {
  var date = data.daily[index].dt;
  var tempHi = data.daily[index].temp.max;         
  var tempLo = data.daily[index].temp.min;        
  var humidity = data.daily[index].humidity;         
  var wind = data.daily[index].wind_speed;         
  var uvi = data.daily[index].uvi;   
  var weatherImg = data.daily[index].weather[0].icon;         
  var humidity = data.daily[index].humidity;        
  var windSpeed = data.current.wind_speed;        
  var uvi = data.daily[index].uvi
  return {date,tempHi,tempLo,humidity,wind,uvi,weatherImg, humidity,windSpeed, uvi};
}

/**
 * this function renders the content on each card that is retrieved from the API
 * @param {what needs to be rendered} data 
 * @param {the type of info it is} dataType 
 * @param {what to render it on} target 
 * @param {any label to attatch to the data before its rendered} text 
 */
function render(data, dataType, target, text) {

  switch(dataType) {
    case 'stats':
      ele = $('<h3>').text(`${text}: `+ data);
      target.append(ele);
    case 'img' :
      var weatherImgEle = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + data + "@2x.png");
      target.append(weatherImgEle);
      break;
    case 'date':
      var dateText = moment.unix(data).format('dddd MMM Do');
      console.log("date==>"+dateText);
      var forecastDiv = $('<div>');
      forecastDiv.append($('<h1>').text(dateText));
      target.append(forecastDiv);
    break;
    case 'history':

      
      /*
      for (let i = 0; i < searchHistory.length; i++) {
        const historyItem = document.createElement("input");
        historyItem.setAttribute("type", "text");
        historyItem.setAttribute("readonly", true);
        historyItem.setAttribute("class", "form-control d-block bg-white");
        historyItem.setAttribute("value", searchHistory[i]);
        historyItem.addEventListener("click", function () {
            getWeather(historyItem.value);
        })
        historyEl.append(historyItem);
    }*/
      
      break;

      case 'uv':
      if (data < 5) {
        target.append($('<h3>').text(`${text}: `+ data).addClass('low'));
      } else if (data < 10) {
        target.append($('<h3>').text(`${text}: `+ data).addClass('moderate'));
      } else if (data >= 10) {
        target.append($('<h3>').text(`${text}: `+ data).addClass('high'));
      }
        break;
  }
}

/**
 * this function will return json object with info needed
 * 
 * city name, the date, an icon representation of weather conditions, the temperature, 
 * the humidity, the wind speed, and the UV index
 * @param {what user searches as a string} input 
 */
function fetchWeather(input) {

  let URL = "https://api.openweathermap.org/data/2.5/weather?q=" + input + "&appid=" + APIKey;

    fetch(URL)
    .then(response => response.json())
    .then(function (data) {
      console.log('data ==>'+data);
      
      // Sets the API call url to the variable oneCallUrl in order to get the weather data for the searched city
      var URL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data.coord.lat + "&lon=" + data.coord.lat + "&appid=" + APIKey + "&units=imperial";

      fetch(URL)
        
          .then(response => response.json())
          .then(function (data) {
          console.log('data==>'+data);

          var weatherObj = fetchData(data,0);
          let {date,tempHi,tempLo,humidity,wind,uvi,weatherImg,windSpeed} = weatherObj;

          render (date, 'date', currentForecastCard, "");
          render (weatherImg, 'img', currentForecastCard, "");
          render (tempHi, 'stats', currentForecastCard, "Temperature High");
          render (tempLo, 'stats', currentForecastCard, "Temperature Low");
          render (humidity, 'stats', currentForecastCard, "Humidity");
          render (windSpeed, 'stats', currentForecastCard, "Wind Speed");
          render (uvi, 'uv', currentForecastCard, "UV");


          for (var i = 1; i < 6; i++) {

            var weekForecastCardDayOfCard = $('<div class = container style = "border: 5px solid red;">');
            var weatherObj = fetchData(data,i);
            let {date,tempHi,tempLo,humidity,wind,uvi,weatherImg,windSpeed} = weatherObj;

            render (date, 'date', weekForecastCardDayOfCard);
            render (weatherImg, 'img', weekForecastCardDayOfCard);
            render (tempHi, 'stats', weekForecastCardDayOfCard, "Temperature High");
            render (tempLo, 'stats', weekForecastCardDayOfCard, "Temperature Low");
            render (humidity, 'stats', weekForecastCardDayOfCard, "Humidity");
            weekForecastCard.append(weekForecastCardDayOfCard);
          }        
        });
    });
}