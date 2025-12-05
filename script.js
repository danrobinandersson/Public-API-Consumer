import { WEATHER_API_KEY } from "./config.js";

const city = "Gothenburg";
const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${city}`;

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    console.log("Full JSON response:", data);

    const tempC = data.current.temp_c;
    if (tempC <= 3) {
      console.log("It's too cold for the cat!");
    } else if (tempC >= 3 && tempC <= 10) {
      console.log("Not really warm but.. let the poor cat out anyway!");
    } else {
      console.log("Nice weather, the cat should be outside!");
    }

    console.log(`Current temperature in ${city}: ${tempC}°C`);
    const rain = data.current.precip_mm;
    console.log(`Current precipitation in ${city}: ${rain} mm`);
    const condition = data.current.condition.text;
    console.log(`The current condition is ${condition}`);
  })
  .catch((error) => {
    console.error("Error fetching the weather data:", error);
  });
