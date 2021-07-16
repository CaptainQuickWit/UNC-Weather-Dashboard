const APIKey = "2a2005a0ff35a5631cce91e317e7d835"; //API key unique to each acct

var currentForecastCard = $('#current');
var weekForecastCard = $('#weekForecast');
var userInputEle = $('.form-input');
var historyEle = $('#history');
var searchBtn = $('#search-button');
//var weekForecastCardDayOfCard = $('<div>');
var userInput;

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



searchBtn.on("click", function(event) {
  userInput = userInputEle.val();
  console.log('userInput==>'+userInput);
  //getWeather("raleigh");
  fetchWeather('raleigh');
  
});

function render(data, dataType, target) {

  switch(dataType) {
    case 'stats':
      target.append($('<h3>').text(data));
      //return $('<h3>').text(data);
      
    case 'img' :

      break;
  }

}

/**
 * 
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

function helperFetchCoord(currentForcastUrl) {
  fetch(currentForcastUrl)
    .then(response => response.json())
    .then(function (response) {
      console.log('response ==>'+response);
      var cityName = response.name;
      // Creates a button with the name and values of the searched city
      var lat = response.coord.lat;
      var lon = response.coord.lat;
      return {cityName, lat, lon};
      // Sets the API call url to the variable oneCallUrl in order to get the weather data for the searched city

    });

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
  //let { lat, lon } = helperFetchCoord(URL);
    //let getUVURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
    //helperFetchUVImg(getUVURL);
  // Starts the fetch request to the URL set in the oneCallUrl variable

    fetch(URL)
    .then(response => response.json())
    .then(function (data) {
      console.log('data ==>'+data);
      
      // Creates a button with the name and values of the searched city
      //createCityButtons(response.name);

      // Sets the API call url to the variable oneCallUrl in order to get the weather data for the searched city
      var URL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data.coord.lat + "&lon=" + data.coord.lat + "&appid=" + APIKey + "&units=imperial";

      // Starts the fetch request to the URL set in the oneCallUrl variable
      fetch(URL)
        //helperFetchUVImg(getUVURL);
          .then(response => response.json())
          .then(function (data) {
          console.log('data==>'+data);

          var weatherObj = fetchData(data,0);
          let {date,tempHi,tempLo,humidity,wind,uvi,weatherImg,windSpeed} = weatherObj;
          render (date, 'stats', currentForecastCard);
          render (weatherImg, 'img', currentForecastCard);
          render (tempHi, 'stats', currentForecastCard);
          render (tempLo, 'stats', currentForecastCard);
          render (humidity, 'stats', currentForecastCard);
          render (windSpeed, 'stats', currentForecastCard);
          render (uvi, 'stats', currentForecastCard);

          for (var i = 1; i < 5; i++) {

            var weekForecastCardDayOfCard = $('<div class = container style = "border: 5px solid red;">');
            var weatherObj = fetchData(data,i);
            let {date,tempHi,tempLo,humidity,wind,uvi,weatherImg,windSpeed} = weatherObj;
            render (date, 'stats', weekForecastCardDayOfCard);
            render (weatherImg, 'img', weekForecastCardDayOfCard);
            render (tempHi, 'stats', weekForecastCardDayOfCard);
            render (tempLo, 'stats', weekForecastCardDayOfCard);
            render (humidity, 'stats', weekForecastCardDayOfCard);

            weekForecastCard.append(weekForecastCardDayOfCard);

          }

          localStorage.setItem(response.name, response.name);
        
        });

    });
    

}


function fetchWeather(input) {

  let URL = "https://api.openweathermap.org/data/2.5/weather?q=" + input + "&appid=" + APIKey;
  //let { lat, lon } = helperFetchCoord(URL);
    //let getUVURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
    //helperFetchUVImg(getUVURL);

    fetch(URL)
    .then(response => response.json())
    .then(function (response) {
      console.log('reponse ==>'+response);
      var cityName = response.name;
      // Creates a button with the name and values of the searched city
      //createCityButtons(response.name);

      // Sets the API call url to the variable oneCallUrl in order to get the weather data for the searched city
      var URL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + response.coord.lat + "&lon=" + response.coord.lat + "&appid=" + APIKey + "&units=imperial";

      // Starts the fetch request to the URL set in the oneCallUrl variable
      fetch(URL)
        //helperFetchUVImg(getUVURL);
          .then(response => response.json())
          .then(function (data) {
          console.log('data==>'+data);

          var weatherObj = fetchData(data,0);
          let {date,tempHi,tempLo,humidity,wind,uvi,weatherImg,windSpeed} = weatherObj;
          render (date, 'stats', currentForecastCard);
          render (weatherImg, 'img', currentForecastCard);
          render (tempHi, 'stats', currentForecastCard);
          render (tempLo, 'stats', currentForecastCard);
          render (humidity, 'stats', currentForecastCard);
          render (windSpeed, 'stats', currentForecastCard);
          render (uvi, 'stats', currentForecastCard);

          for (var i = 1; i < 5; i++) {

            var weekForecastCardDayOfCard = $('<div class = container style = "border: 5px solid red;">');
            var weatherObj = fetchData(data,i);
            let {date,tempHi,tempLo,humidity,wind,uvi,weatherImg,windSpeed} = weatherObj;
            render (date, 'stats', weekForecastCardDayOfCard);
            render (weatherImg, 'img', weekForecastCardDayOfCard);
            render (tempHi, 'stats', weekForecastCardDayOfCard);
            render (tempLo, 'stats', weekForecastCardDayOfCard);
            render (humidity, 'stats', weekForecastCardDayOfCard);

            weekForecastCard.append(weekForecastCardDayOfCard);

          }

          localStorage.setItem(response.name, response.name);
        
        });

    });
    

}

function getWeather(event) {
  // Clears the previously searched city's weather data if there was any
  $("#currentWeatherCard").empty();
  event.preventDefault();

  // Sets the city the user input into the search bar as a variable
  var searchInput = document.getElementById("searchInput").value;

  // Sets the API call url to the variable currentForcastURL in order to get the latitude and logitude 
  var currentForcastUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&appid=" + APIKey + "&units=imperial";

  // Starts the fetch request to the URL set in the currentForcastRUL variable
  fetch(currentForcastUrl)
    .then(response => response.json())
    .then(function (response) {
      console.log(response);
      var cityName = response.name;
      // Creates a button with the name and values of the searched city
      createCityButtons(response.name);

      // Sets the API call url to the variable oneCallUrl in order to get the weather data for the searched city
      var oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + response.coord.lat + "&lon=" + response.coord.lat + "&appid=" + APIKey + "&units=imperial";

      // Starts the fetch request to the URL set in the oneCallUrl variable
      fetch(oneCallUrl)
        .then(response2 => response2.json())
        .then(function (response2) {
          console.log(response2);
          
          // Sets the fetched weather data into their own variables
          var dateEl = $('<h5>').text(moment.unix(response2.daily[0].dt).format('dddd MMM Do',));
          var temp = "Temperature: " + response2.current.temp;
          var weatherIcon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + response2.daily[0].weather[0].icon + "@2x.png");
          weatherIcon.attr("width", 50);
          var humidity = $("<h4>").html("Humidity: " + response2.daily[0].humidity);
          var windSpeed = $("<h4>").html("Wind Speed: " + response2.current.wind_speed);
          var UVI = $("<h4>").html("UV Index: " + response2.daily[0].uvi).addClass("UVIndex");
          // Calls the function to set the color of the UV Index text
          singleUVindex();

          // If loop to determine whether the UV Index is low, moderate, or high, and then sets the text color of the UV Index to the coresponding color depending on how high the UV Index is
          function singleUVindex() {
            if (response2.daily[0].uvi < 5) {
                UVI.addClass('low');
            } else if (response2.daily[0].uvi < 10) {
                UVI.addClass('moderate');
            } else if (response2.daily[0].uvi >= 10) {
                UVI.addClass('high');
            };
          }
          // Appends the weather data variables into the current weather card
          $("#currentWeatherCard").append(cityName, dateEl, weatherIcon, temp, humidity, windSpeed, UVI);
          // Clears the data from the previous search from the five day weather forcast if there was one
          $(".fiveDayDisplay").empty();

          // For loop to loop through the one call api call five times using the future forcast api resonse to get the five day forcast and appends the data to the 5 day forcast card
          for (var i = 1; i < 6; i++) {
            var fiveDayDateEl = moment.unix(response2.daily[i].dt).format('dddd MMM Do');
            var fiveDayTempHigh = "High Temperature: " + response2.daily[i].temp.max;
            var fiveDayTempMin = "Low Temperature: " + response2.daily[i].temp.min;
            var fiveDayHumidity = "Humidity: " + response2.daily[i].humidity;
            var fiveDayWindSpeed = "Wind Speed: " + response2.daily[i].wind_speed;
            var fiveDayUVI = "UV Index: " + response2.daily[i].uvi;
            var fiveDayWeatherIcon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + response2.daily[i].weather[0].icon + "@2x.png");
            var forcastDiv = $("<div>")
            var tempHighEl = $("<h3>").text(fiveDayTempHigh);
            var tempLowEl = $("<h3>").text(fiveDayTempMin);
            var humidityEl = $("<h3>").text(fiveDayHumidity);
            var windSpeedEl = $("<h3>").text(fiveDayWindSpeed);
            var uviEl = $("<h3>").text(fiveDayUVI).addClass("UVIndex");
            $(".fiveDayDisplay").append(forcastDiv);
            forcastDiv.append(fiveDayDateEl, fiveDayWeatherIcon, tempHighEl, tempLowEl, humidityEl, windSpeedEl, uviEl);

            localStorage.setItem(response.name, response.name);
            // Calls the five day UV Index color coding function
            fiveDayUVIndex();
            // For loop to check the UV Index numbers and set them to the corresponding color for low, moderate, and high
            function fiveDayUVIndex() {
            if (response2.daily[i].uvi < 5) {
                uviEl.addClass('low');
            } else if (response2.daily[i].uvi < 10) {
              uviEl.addClass('moderate');
            } else if (response2.daily[i].uvi >= 10) {
              uviEl.addClass('high');
            }
          };
        };
      });
  });
};