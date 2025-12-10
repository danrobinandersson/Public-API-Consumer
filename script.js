import { WEATHER_API_KEY } from "./config.js";

const input = document.getElementById("city-input");
const button = document.getElementById("search-btn");
const output = document.getElementById("weather-output");

async function fetchWeatherAndCat(city) {
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
      output.innerHTML = `
        <div class="error-container">
          <p class="info-message">City not found. Try again!</p>
          <img 
            src="https://cataas.com/cat/sad?nocache=true&x=${Date.now()}"
            alt="Sad cat" 
            class="cat-img"
          >
        </div>
      `;
      return;
    }
    const cityName = weatherData.location.name;
    const feelsLike = weatherData.current.feelslike_c;
    const tempC = weatherData.current.temp_c;
    const rain = weatherData.current.precip_mm;
    const condition = weatherData.current.condition.text;
    const icon = "https:" + weatherData.current.condition.icon;
    const catImg = `https://cataas.com/cat/${catData.id}`;

    output.innerHTML = `
      <div class="output-container">
        <h3 class="cat-advice-text">${getCatAdvice(tempC, rain, condition)}</h3>

        <div class="weather-cat-container">
          <div class="weather-data">
            <p><strong>City:</strong> ${cityName}</p>
            <p><strong>Temperature:</strong> ${tempC}°C</p>
            <p><strong>Feels like:</strong> ${feelsLike}°C</p>
            <p><strong>Rain:</strong> ${rain} mm</p>
            <p><strong>Condition:</strong> ${condition}</p>      
            <img src="${icon}" alt="${condition}" class="weather-icon">
          </div>

          <div class="cat-section">
            <p><strong>Random cat of the day:</strong></p>
            <img src="${catImg}" alt="Random cat" class="cat-img">
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    output.innerHTML = `<p>Error fetching data.</p>`;
  }
}

// The API returns many conditions, so we select only those with rainy keywords
const rainyKeywords = ["rain", "drizzle", "shower"];

function getCatAdvice(temp, rain, condition) {
  // We check if condition contains any of the keywords
  const isRainy = rainyKeywords.some((keyword) =>
    condition.toLowerCase().includes(keyword)
  );

  if (temp <= 3) return "It's too cold for the cat!";
  if (rain > 0 || isRainy) {
    return "The cat might get wet!";
  }
  if (temp <= 10) return "Not really warm but… let the poor cat out anyway!";
  return "Nice weather, the cat should be outside!";
}

button.addEventListener("click", () => {
  const city = input.value.trim();
  if (city === "") {
    output.innerHTML = `<p class="info-message">Please type a city name.</p>`;
    return;
  }
  fetchWeatherAndCat(city);
  input.value = ""; // Clears the input after search
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const city = input.value.trim();
    if (city === "") {
      output.innerHTML = `<p class="info-message">Please type a city name.</p>`;
      return;
    }
    fetchWeatherAndCat(city);
    input.value = ""; // Clears the input after search
  }
});

// Function to fetch data from specific city buttons
const bannerButtons = document.querySelectorAll(".banner button");

bannerButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const city = btn.dataset.city;
    fetchWeatherAndCat(city);
  });
});
