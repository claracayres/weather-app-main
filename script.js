const dropdown = document.querySelector('.dropdown-menu');
const dropdownBtn = document.querySelector('.dropdown-toggle');

dropdownBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdown.classList.toggle("show");
});

window.addEventListener("click", function(e) {
  if (!e.target.closest(".dropdown")) {
    dropdown.classList.remove("show");
  }
});

// --- HTML ELEMENTS ---
const tempSelect = document.querySelector("#temperature");
const windSelect = document.querySelector("#wind-speed");
const precipitationSelect = document.querySelector("#precipitation");
const searchInput = document.querySelector(".search-bar input");
const searchBtn = document.querySelector(".search-button");
const locationElement = document.querySelector(".location");
const temperatureElement = document.querySelector(".temperature");
const additionalInfoElements = {
  feelsLike: document.querySelector(".additional-info div:nth-child(1) span"),
  humidity: document.querySelector(".additional-info div:nth-child(2) span"),
  wind: document.querySelector(".additional-info div:nth-child(3) span"),
  precipitation: document.querySelector(".additional-info div:nth-child(4) span")
};

// --- GLOBAL VARIABLES ---
let units = {
  temperature: "celsius",
  wind: "kmh",
  precipitation: "mm"
};
let currentLocation = { lat: 52.52, lon: 13.41 }; // default: Berlin

// --- UNIT CHANGE LISTENERS ---
tempSelect.addEventListener("change", () => {
  units.temperature = tempSelect.value.includes("Celsius") ? "celsius" : "fahrenheit";
  updateWeather();
});

windSelect.addEventListener("change", () => {
  units.wind = windSelect.value.includes("Km/h") ? "kmh" : "mph";
  updateWeather();
});

precipitationSelect.addEventListener("change", () => {
  units.precipitation = precipitationSelect.value.includes("Millimeters") ? "mm" : "inch";
  updateWeather();
});

// --- SEARCH HANDLER ---
searchBtn.addEventListener("click", handleSearch);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSearch();
});

async function handleSearch() {
  const query = searchInput.value.trim();
  if (!query) return;

  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`
    );
    const geoData = await geoRes.json();

    if (geoData.results && geoData.results.length > 0) {
      const place = geoData.results[0];
      currentLocation = { lat: place.latitude, lon: place.longitude };

      locationElement.textContent = `${place.name}, ${place.country}`;
      updateWeather();
    } else {
      alert("Location not found!");
    }
  } catch (err) {
    console.error("Error fetching location:", err);
  }
}

// --- FETCH WEATHER DATA FROM OPEN-METEO ---
async function getWeather(lat, lon) {
  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.append("latitude", lat);
    url.searchParams.append("longitude", lon);
    url.searchParams.append("current", "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m");
    url.searchParams.append("hourly", "temperature_2m");
    url.searchParams.append("temperature_unit", units.temperature);
    url.searchParams.append("windspeed_unit", units.wind);
    url.searchParams.append("precipitation_unit", units.precipitation);

    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    renderWeather(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

// --- RENDER WEATHER DATA TO HTML ---
function renderWeather(data) {
  temperatureElement.textContent = `${data.current.temperature_2m}°`;
  
  additionalInfoElements.feelsLike.textContent = `${data.current.temperature_2m}°`;
  additionalInfoElements.humidity.textContent = `${data.current.relative_humidity_2m}%`;
  additionalInfoElements.wind.textContent = `${data.current.wind_speed_10m} ${units.wind}`;
  additionalInfoElements.precipitation.textContent = `${data.current.precipitation} ${units.precipitation}`;
}

// --- GLOBAL UPDATE FUNCTION ---
function updateWeather() {
  getWeather(currentLocation.lat, currentLocation.lon);
}

// --- INITIALIZE ---
updateWeather();
