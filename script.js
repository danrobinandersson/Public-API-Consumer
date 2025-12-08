import { WEATHER_API_KEY } from "./config.js";

const input = document.getElementById("city-input");
const button = document.getElementById("search-btn");
const output = document.getElementById("weather-output");

// Function to fetch weather for a typed city
function fetchWeather(city) {
  const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${city}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log("Full JSON response:", data);

      if (data.error) {
        output.innerHTML = `<p>City not found. Try again!</p>`;
        return;
      }

      const tempC = data.current.temp_c;
      const rain = data.current.precip_mm;
      const condition = data.current.condition.text;
      const icon = "https:" + data.current.condition.icon;

      output.innerHTML = `
      <p><strong>City:</strong> ${city}</p>
      <p><strong>Temperature:</strong> ${tempC}°C</p>
      <p><strong>Rain:</strong> ${rain} mm</p>
      <p><strong>Condition:</strong> ${condition}</p>
      <p><strong>Cat advice:</strong> ${getCatAdvice(tempC)}</p>
      <img src="${icon}" alt="${condition}">
      `;
    })
    .catch(() => {
      output.innerHTML = `<p>Error fetching weather data.</p>`;
    });
}

function getCatAdvice(temp) {
  if (temp <= 3) return "It's too cold for the cat!";
  if (temp <= 10) return "Not really warm but… let the poor cat out anyway!";
  return "Nice weather, the cat should be outside!";
}

button.addEventListener("click", () => {
  const city = input.value.trim();
  if (city === "") {
    output.innerHTML = "<p>Please type a city name.</p>";
    return;
  }
  fetchWeather(city);
});
