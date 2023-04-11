"use strict";

const displayCity = document.querySelector(".city");
const displayTemperature = document.querySelector(".temp");
const displayHumidity = document.querySelector(".humidity");
const displayWindSpeed = document.querySelector(".wind");
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search-button");
const apiKey = "2516d20c133df7556447df32ef0e8311";
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?&appid=${apiKey}&units=metric`;
const apiUrlHourly = `https://api.openweathermap.org/data/2.5/onecall?&exclude=hourly,daily&appid=${apiKey}`; // API requires payment :(
const weatherIcon = document.querySelector(".weather-icon");
const myInput = document.getElementById("my-imput");
const tinyTemp = document.querySelector(".tiny-temperature");
const addCityButton = document.querySelector(".bookmark-button");
const citiesList = document.getElementById("cities-list");
let currentLocation = "Sibiu";

// getting the API information by city and displayng
async function checkWeather(city) {
  const response = await fetch(`${apiUrl}&q=${city}`);

  const data = await response.json();

  displayCity.innerHTML = data.name;
  displayTemperature.innerHTML = Math.round(data.main.temp) + "°C";
  displayHumidity.innerHTML = data.main.humidity + "%";
  displayWindSpeed.innerHTML = data.wind.speed + " km/h";

  if (data.weather[0].main) {
    weatherIcon.src = `src/resources/${data.weather[0].main}.png`;
    document.body.style.backgroundColor = getColor(data.weather[0].main);
  } else weatherIcon.src = `src/resources/clouds.png`;
}

// API requires payment to be able to show hourly information... :( but this is how I would have integrated it

// async function checkWeatherHourly(city) {
//   const response = await fetch(`${apiUrlHourly}&q=${city}`);
//   const data = await response.json();

//   console.log(data); <- assign data to each html element accordingly like above
// }

// Changes the "theme" of the app based on the weather
function getColor(input) {
  return input == "Clear"
    ? "#3C98FF"
    : input == "Clouds"
    ? "#44607F"
    : input == "Drizzle"
    ? "#1E4C7F"
    : input == "Humidity"
    ? "#307ACC"
    : input == "Mist"
    ? "#5D749A"
    : input == "Rain"
    ? "#5D749A"
    : input == "Snow"
    ? "#8EA6CC"
    : "";
}

// Initializes the app with data from the current location using geolocation
function init() {
  navigator.geolocation.getCurrentPosition((position) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        checkWeather(data.name);
        // checkWeatherHourly(data.name); -> function call to initialize the hourly forecast (could not implement, API requires payment :( )
      });
  });
}
window.addEventListener("load", init);

// clicking the search button changes the city name to what is in the input field
searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});

// pressing enter changes the city name to what is in the input field
myInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchBtn.click();
  }
});

addCityButton.addEventListener("click", function () {
  let cityName = searchBox.value;
  if (cityName !== null && cityName !== "") {
    addCityToLocalStorage(cityName);
    renderCitiesList();
  }
});

function addCityToLocalStorage(cityName) {
  let cities = localStorage.getItem("cities");
  if (cities === null) {
    localStorage.setItem("cities", JSON.stringify([cityName]));
  } else {
    cities = JSON.parse(cities);
    if (!cities.includes(cityName)) {
      cities.push(cityName);
      localStorage.setItem("cities", JSON.stringify(cities));
    }
  }
}

// Function to render the cities list from local storage
function renderCitiesList() {
  citiesList.innerHTML = "";

  let cities = JSON.parse(localStorage.getItem("cities"));

  if (cities !== null) {
    for (let i = 0; i < cities.length; i++) {
      let listItem = document.createElement("option");
      listItem.textContent = cities[i];
      citiesList.appendChild(listItem);
    }
  }
}

citiesList.addEventListener("change", function handleChange(event) {
  checkWeather(event.target.value);
});

// Render the cities list on page load
renderCitiesList();
