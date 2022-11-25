var cityFormEl = document.getElementById("citySearch-form");
var userInputEl = document.getElementById("user-input");
var pastSearchBtnEl = document.getElementById("previousSearches-btn");
var currentForecastEl = document.getElementById("current-forecast");
var searchedInputEl = document.getElementById("searched-city");
var weatherContainerEl = document.getElementById("weather-container");
var forecastHeaderEl = document.getElementById("forecast-title");
var forecastContainerEl = document.querySelector("#fiveday-container");
var cities = [];

var entryForm = function (event) {
  event.preventDefault();
  var city = userInputEl.value;

  if (city) {
    cityWeather(city);
    fiveDayForecast(city);
    cities.unshift({ city });
    userInputEl.value = "";
  } else {
    alert("Please enter a city");
  }
  saveSearch();
  pastSearch(city);
};

//--Fetching OpenWeather Api--

var cityWeather = function (city) {
  var apiKey = "593a759aad448abed5e31e1c88e856a7";
  var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  fetch(apiURL).then(function (response) {
    response.json().then(function (data) {
      currentForecast(data, city);
    });
  });
};

//--Getting current weather--

var currentForecast = function (weather, searchCity) {
  weatherContainerEl.textContent = "";
  searchedInputEl.textContent = searchCity;

  //--Displaying current day--
  var currentDay = document.createElement("span");
  currentDay.textContent =
    " (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
  searchedInputEl.appendChild(currentDay);

  //--Displaying current weather icon--
  var weatherIconEl = document.createElement("span");
  var weatherIcon = document.createElement("img");
  weatherIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`
  );
  weatherIconEl.appendChild(weatherIcon);
  searchedInputEl.appendChild(weatherIconEl);

  //--Displaying current temperature--
  var temperatureEl = document.createElement("span");
  temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
  temperatureEl.classList = "list-group-item";

  //--Appending to the main weather-container--
  weatherContainerEl.appendChild(temperatureEl);

  //--Displaying current humidity--
  var humidityEl = document.createElement("span");
  humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
  humidityEl.classList = "list-group-item";

  //--Appending to the main weather-container--
  weatherContainerEl.appendChild(humidityEl);

  //--Displaying current wind-speed--
  var windSpeedEl = document.createElement("span");
  windSpeedEl.textContent = "Wind-Speed: " + weather.wind.speed + " MPH";
  windSpeedEl.classList = "list-group-item";

  //--Appending to the main weather-container--
  weatherContainerEl.appendChild(windSpeedEl); 

  
};

var fiveDayForecast = function(city) {
  var apiKey = "bce9440981ad900551728142cb10927b";
  var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

  fetch(apiURL).then(function (response) {
    response.json().then(function (data) {
      displayForecast(data);
    });
  });
};


var displayForecast = function (weather) {
  forecastContainerEl.textContent = "";
  forecastHeaderEl.textContent = "5 Day Forecast: ";

  var forecast = weather.list;
  for (var i = 5; i < forecast.length; i = i + 8) {
    var dailyForecast = forecast[i];

    var forecastEl = document.createElement("div");
    forecastEl.classList = "card bg-info text-light m-1";

    //--Displaying date--
    var dateEl = document.createElement("h5");
    dateEl.textContent = moment.unix(dailyForecast.dt).format("MMM D, YYYY");
    dateEl.classList = "card-header text-center";
    forecastEl.appendChild(dateEl);

    //--Displaying weather image--
    var weatherIconEl = document.createElement("img");
    weatherIconEl.classList = "card-body text-center";
    weatherIconEl.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`
    );
    forecastEl.appendChild(weatherIconEl);

    //--Displaying temperature for that day--
    var tempEl = document.createElement("span");
    tempEl.classList = "card-body text-center";
    tempEl.textContent = "Temperature: " + dailyForecast.main.temp + " °F";
    forecastEl.appendChild(tempEl);

    //--Displaying wind-speed--
    var windEl = document.createElement("span");
    windEl.classList = "card-body text-center";
    windEl.textContent = "Wind: " + dailyForecast.wind.speed + " MPH";
    forecastEl.appendChild(windEl);

    //--Displaying humidity--
    var humidEl=document.createElement("span");
    humidEl.classList = "card-body text-center";
    humidEl.textContent = "Humidity: " + dailyForecast.main.humidity + "  %";
    forecastEl.appendChild(humidEl);

    //--Appending to main forecast-container--
    forecastContainerEl.appendChild(forecastEl);
  }
};

var pastSearch = function (pastSearch) {
  var pastSearchEl = document.createElement("button");
  pastSearchEl.textContent = pastSearch;
  pastSearchEl.classList = "d-flex w-100 bg-indigo-900 text-black border p-2";
  pastSearchEl.setAttribute("data-city", pastSearch);
  pastSearchEl.setAttribute("type", "submit");

  pastSearchBtnEl.append(pastSearchEl);
};

var saveSearch = function () {
  localStorage.setItem("cities", JSON.stringify(cities));
};

var pastSearchHandler = function (event) {
  var city = event.target.getAttribute("data-city");

  if (city) {
    cityWeather(city);
    fiveDayForecast(city);
  }
};

cityFormEl.addEventListener("submit", entryForm);
pastSearchBtnEl.addEventListener("click", pastSearchHandler);