// Get the dropdown and button so the user can choose a city.
    let citySelect = document.querySelector("#city-select");
    let checkButton = document.querySelector("#check-button");

// This function gets current weather information from Open-Meteo.
async function getWeather() {
    let selectedCity = citySelect.value;
    let latitude;
    let longitude;

// The API needs latitude and longitude for each city.
    if (selectedCity === "Mississauga") {
        latitude = 43.59;
        longitude = -79.64;
    } else {
        latitude = 19.08;
        longitude = 72.88;
    }

    let apiURL = "https://api.open-meteo.com/v1/forecast?latitude=" + latitude +
        "&longitude=" + longitude +
        "&current=temperature_2m,cloud_cover,precipitation&timezone=auto";

    document.querySelector("#status").textContent = "Loading weather...";
    checkButton.disabled = true;

    try {
    // Fetch data from the API and turn the response into JSON.
    let response = await fetch(apiURL);

    if (!response.ok) {
        throw new Error("The weather request failed.");
    }

    let data = await response.json();

// Read three weather values from the JSON response.
    let temperature = data.current.temperature_2m;
    let clouds = data.current.cloud_cover;
    let precipitation = data.current.precipitation;

// Update the text shown on the webpage.
    document.querySelector("#city-name").textContent = selectedCity;
    document.querySelector("#temperature").textContent = temperature.toFixed(1) + "°C";
    document.querySelector("#cloud-cover").textContent = "Cloud cover: " + clouds + "%";
    document.querySelector("#precipitation").textContent = "Precipitation: " + precipitation + " mm";

 // Make the blue bar match the live cloud-cover percentage.
    document.querySelector("#cloud-bar").style.width = clouds + "%";

// Change the page background and message based on the weather.
    if (precipitation > 0) {
        document.body.className = "wet";
        document.querySelector("#weather-message").textContent =
            "Precipitation is being reported. Bring appropriate weather protection.";

    } else if (temperature < 10) {
        document.body.className = "cold";
        document.querySelector("#weather-message").textContent =
        "It's cold outside. A warm jacket would be a good idea.";

    } else if (temperature < 25) {
        document.body.className = "mild";
        document.querySelector("#weather-message").textContent =
        "The weather feels fairly mild. Enjoy your day!";

    } else {
        document.body.className = "hot";
        document.querySelector("#weather-message").textContent =
        "It's hot outside. Remember to stay hydrated.";
    }

// The API returns the time for the selected city's local timezone.
    document.querySelector("#updated-time").textContent =
    "Weather data time: " + data.current.time.replace("T", " ") + " (local time)";

    document.querySelector("#status").textContent = "Weather loaded successfully.";

    } catch (error) {

// Show a message instead of leaving incorrect or outdated weather visible.
    console.error("Error:", error);
    document.querySelector("#status").textContent = "Could not load weather. Please try again.";
    document.querySelector("#city-name").textContent = selectedCity;
    document.querySelector("#temperature").textContent = "--°C";
    document.querySelector("#cloud-cover").textContent = "Cloud cover: --%";
    document.querySelector("#precipitation").textContent = "Precipitation: -- mm";
    document.querySelector("#cloud-bar").style.width = "0%";
    document.querySelector("#weather-message").textContent =
        "The weather service may be unavailable right now.";
    document.querySelector("#updated-time").textContent = "";
    document.body.className = "";

    } finally {
// Enable the button again whether the request succeeds or fails.
    checkButton.disabled = false;
    }
}

// Run again when the user clicks the button, and once when the page loads.
checkButton.addEventListener("click", getWeather);
getWeather();

