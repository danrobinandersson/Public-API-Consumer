import { WEATHER_API_KEY } from "./config.js";

const citySelect = document.getElementById("City-choice");
const output = document.getElementById("weather-output");

function fetchWeather(city) {
  const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${city}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log("Full JSON response:", data);

      const tempC = data.current.temp_c;
      const rain = data.current.precip_mm;
      const condition = data.current.condition.text;

      output.innerHTML = `
        <p><strong>City:</strong> ${city}</p>
        <p><strong>Temperature:</strong> ${tempC}°C</p>
        <p><strong>Rain:</strong> ${rain} mm</p>
        <p><strong>Condition:</strong> ${condition}</p>
        <p><strong>Cat advice:</strong> ${getCatAdvice(tempC)}</p>
      `;
    })
    .catch((error) => {
      console.error("Error fetching the weather data:", error);
      output.innerHTML = "<p>Error loading weather data.</p>";
    });
}

function getCatAdvice(temp) {
  if (temp <= 3) {
    return "It's too cold for the cat!";
  } else if (temp <= 10) {
    return "Not really warm but... let the poor cat out anyway!";
  } else {
    return "Nice weather, the cat should be outside!";
  }
}

fetchWeather(citySelect.value);

citySelect.addEventListener("change", () => {
  fetchWeather(citySelect.value);
});
