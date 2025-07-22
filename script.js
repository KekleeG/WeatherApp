const apiKey = "8e7a86c99463f59c174e49d1b33cfabd"; // Replace with your actual API key

let isCelsius = true; // Default to Celsius
let currentCity = ""; // Store the last searched city

// Function to get weather
async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const weatherResult = document.getElementById("weatherResult");

  if (!city) {
    weatherResult.innerHTML = "Please enter a city name.";
    return;
  }

  currentCity = city; // Save the current city for toggling later
  fetchWeatherData(city); // Fetch the weather data
}

// Function to fetch weather data from the API
async function fetchWeatherData(city) {
  const weatherResult = document.getElementById("weatherResult");
  const unit = isCelsius ? "metric" : "imperial"; // Celsius for metric, Fahrenheit for imperial

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      // If response is not ok, check if it's a "404" (not found) or another error
      if (response.status === 404) {
        throw new Error(`City "${city}" not found.`);
      } else {
        throw new Error("Error fetching weather. Please try again.");
      }
    }

    const data = await response.json();
    const temperature = data.main.temp; // Temperature
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;

    // Set the correct unit symbol (°C or °F)
    const unitSymbol = isCelsius ? "°C" : "°F";

    // Display the weather data
    weatherResult.innerHTML = `
      <h2>${data.name}</h2>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" />
      <p><strong>${temperature.toFixed(1)}${unitSymbol}</strong></p>
      <p>${description}</p>
    `;
  } catch (error) {
    weatherResult.innerHTML = error.message;
  }
}

// Function to toggle between Celsius and Fahrenheit
function toggleTemperature() {
  isCelsius = !isCelsius; // Toggle between Celsius and Fahrenheit
  const button = document.querySelector("button:nth-of-type(2)");

  // Change button text
  button.textContent = isCelsius ? "Show in °F" : "Show in °C";

  // Re-fetch the weather data with the new unit
  if (currentCity) {
    fetchWeatherData(currentCity); // Re-fetch weather for the last city
  }
}

