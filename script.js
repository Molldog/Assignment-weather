function formatDate(timestamp) {
  let now = new Date(timestamp);

  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];

  return `${day} | ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
       <div class="col-2">
             <div class="weather-forecast-date">${formatDay(
               forecastDay.dt
             )}</div>
             <img
             src="http://openweathermap.org/img/wn/${
               forecastDay.weather[0].icon
             }@2x.png"
             alt="weather-icon"
             width="42"
             />
             <div class="high-temp">
                 ${Math.round(
                   forecastDay.temp.max
                 )}° <span class="low-temp"> ${Math.round(
          forecastDay.temp.min
        )}° </span>
             </div>
             <li class="rain">${forecastDay.rain}</li>
            <li class="humidity">${forecastDay.humidity}</li>
             <li class="wind">${forecastDay.wind_speed}km/hr</li>
       </div>
   `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

forecastHTML = forecastHTML + `</div>`;
forecastElement.innerHTML = forecastHTML;

function getForecast(coordinates) {
  let apiKey = "0efb4fc16a9ed98dc0b3aafd8491d6ad";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayWeather(response) {
  document.querySelector("#current-city").innerHTML = response.data.name;
  document.querySelector("#main-temp").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;
  document.querySelector("#main-humidity").innerHTML =
    response.data.main.humidity;
  document.querySelector("#main-wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  let dayTime = document.querySelector("#day-time");
  dayTime.innerHTML = formatDate(response.data.dt * 1000);
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  celsiusTemperature = response.data.main.temp;

  let temperatureElement = document.querySelector("#celsius-link");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);

  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiKey = "9ff62228143f9cc1758df8baa86a6b09";
  let units = "metric";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${apiEndpoint}?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-text-input").value;
  searchCity(city);
}
let form = document.querySelector("#search-button");
form.addEventListener("submit", handleSubmit);

function showPosition(position) {
  let apiKey = "9ff62228143f9cc1758df8baa86a6b09";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${apiEndpoint}?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);
}
function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}
let currentLocationButton = document.querySelector("#current-location");
currentLocationButton.addEventListener("click", getCurrentPosition);

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#main-temp");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#main-temp");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

searchCity("Melbourne");
