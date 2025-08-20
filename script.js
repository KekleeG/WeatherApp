// Replace this with your actual OpenWeather API key:
const apiKey = "8e7a86c99463f59c174e49d1b33cfabd";

let isCelsius = true;
let currentCity = "";

// Get weather by city name
async function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) {
    alert("Please enter a city name.");
    return;
  }
  currentCity = city;
  await fetchWeatherData(city);
}

// Fetch weather data using city name
async function fetchWeatherData(city) {
  const unit = isCelsius ? "metric" : "imperial";
  const unitSymbol = isCelsius ? "°C" : "°F";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    const temperature = data.main.temp;
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;

    document.getElementById("weatherResult").innerHTML = `
      <h2>${data.name}</h2>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" />
      <p><strong>${temperature.toFixed(1)}${unitSymbol}</strong></p>
      <p>${description}</p>
    `;

    const toggleBtn = document.getElementById("toggleUnit");
    toggleBtn.textContent = isCelsius ? "Show °F" : "Show °C";
    toggleBtn.style.display = "inline-block";

  } catch (error) {
    document.getElementById("weatherResult").innerText = "Error fetching weather. Please try again.";
    console.error("Error:", error);
  }
}

// Toggle between Celsius and Fahrenheit
function toggleTemperature() {
  isCelsius = !isCelsius;
  if (currentCity) {
    fetchWeatherData(currentCity);
  }
}

// Get weather using browser location
function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        document.getElementById("weatherResult").innerText = "Fetching weather for your location...";
        fetchWeatherDataByCoords(lat, lon);
      },
      (error) => {
        document.getElementById("weatherResult").innerText =
          "Error getting location: " + error.message;
      }
    );
  } else {
    document.getElementById("weatherResult").innerText =
      "Geolocation is not supported by this browser.";
  }
}

// Fetch weather data using latitude and longitude
async function fetchWeatherDataByCoords(lat, lon) {
  const unit = isCelsius ? "metric" : "imperial";
  const unitSymbol = isCelsius ? "°C" : "°F";

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Location not found");

    const data = await response.json();
    const temperature = data.main.temp;
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;

    currentCity = data.name;

    document.getElementById("weatherResult").innerHTML = `
      <h2>${data.name}</h2>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" />
      <p><strong>${temperature.toFixed(1)}${unitSymbol}</strong></p>
      <p>${description}</p>
    `;

    const toggleBtn = document.getElementById("toggleUnit");
    toggleBtn.textContent = isCelsius ? "Show °F" : "Show °C";
    toggleBtn.style.display = "inline-block";

  } catch (error) {
    document.getElementById("weatherResult").innerText = "Error fetching weather by location.";
    console.error("Error:", error);
  }
}
