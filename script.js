import { WEATHER_API_KEY } from "./config.js";

const input = document.getElementById("city-input");
const button = document.getElementById("search-btn");
const output = document.getElementById("weather-output");

async function fetchWeather(city) {
  const weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${city}`;
  const catUrl = "https://cataas.com/cat?json=true";

  try {
    const [weatherRes, catRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(catUrl),
    ]);

    const weatherData = await weatherRes.json();
    const catData = await catRes.json();

    if (weatherData.error) {
      output.innerHTML = `<p>City not found. Try again!</p>`;
      return;
    }

    const tempC = weatherData.current.temp_c;
    const rain = weatherData.current.precip_mm;
    const condition = weatherData.current.condition.text;
    const icon = "https:" + weatherData.current.condition.icon;

    const catImg = `https://cataas.com/cat/${catData.id}`;

    output.innerHTML = `
      <p><strong>City:</strong> ${city}</p>
      <p><strong>Temperature:</strong> ${tempC}°C</p>
      <p><strong>Rain:</strong> ${rain} mm</p>
      <p><strong>Condition:</strong> ${condition}</p>
      <p><strong>Cat advice:</strong> ${getCatAdvice(tempC)}</p>
      <img src="${icon}" alt="${condition}">

      <hr>
      <p><strong>Random cat of the day:</strong></p>
      <img src="${catImg}" 
           alt="Random cat" 
           style="max-width: 300px; border-radius: 10px; margin-top: 10px;">
    `;
  } catch (err) {
    output.innerHTML = `<p>Error fetching data.</p>`;
  }
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
  input.value = "";
});

// Script for banner buttons
const bannerButtons = document.querySelectorAll(".banner button");

bannerButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const city = btn.dataset.city;
    fetchWeather(city);
  });
});
