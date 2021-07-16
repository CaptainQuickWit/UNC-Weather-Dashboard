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