function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
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
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
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
                <div class="WeatherForecastPreview">
                  <div class="forecast-day">${formatDay(forecastDay.time)}</div>
                
                  <img src = "${
                    forecastDay.condition.icon_url
                  }" class = "forecast-img" alt="" width="50" />
                  <div class="forecast-temperature">
                    <span class="forecast-temperature-max">${Math.round(
                      forecastDay.temperature.maximum
                    )}°| </span
                    ><span class="forecast-temperature-min">${Math.round(
                      forecastDay.temperature.minimum
                    )}°</span>
                  </div>
                </div>
              </div>
          
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  // console.log(coordinates);
  let apiKey = "b9c57493680f5d1841o38aa42d7dft4f";
  let apiURL = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;

  // let apiURL = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKeykey}&units=metric`;
  // console.log(apiURL);
  axios.get(apiURL).then(displayForecast);
}

function displayTemperature(response) {
  // console.log(response.data);
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#main-city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");

  celciusTemp = response.data.temperature.current;

  temperatureElement.innerHTML = Math.round(response.data.temperature.current);
  cityElement.innerHTML = response.data.city;
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = response.data.temperature.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.time * 1000);
  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute("alt", response.data.condition.description);

  getForecast(response.data.coordinates);
}

function search(city) {
  let apiKey = "b9c57493680f5d1841o38aa42d7dft4f";
  let apiURL = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiURL).then(displayTemperature);
}
function submit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#cityInput");
  search(cityInputElement.value);
}
function displayFanTemp(event) {
  event.preventDefault();
  let fanTemp = (celciusTemp * 9) / 5 + 32;

  celciusLink.classList.remove("active");
  fahreinheitLink.classList.add("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(fanTemp);
}
function displayCelciusTemp(event) {
  event.preventDefault();
  celciusLink.classList.add("active");
  fahreinheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celciusTemp);
}

let celciusTemp = null;

let formElement = document.querySelector("#form");
formElement.addEventListener("submit", submit);

let fahreinheitLink = document.querySelector("#fan");
fahreinheitLink.addEventListener("click", displayFanTemp);

let celciusLink = document.querySelector("#celcius");
celciusLink.addEventListener("click", displayCelciusTemp);

// displayForecast();
