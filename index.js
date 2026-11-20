// Get the dropdown and button so the user can choose a city. It helps JS read and select the city.
    let citySelect = document.querySelector("#city-select");
    let checkButton = document.querySelector("#check-button");

// This function gets current weather information from Open-Meteo.
// async function helps fetch data from an API and since it takes time, the function waits for the response before using the data.
async function getWeather() {
    let selectedCity = citySelect.value;
    let latitude;
    let longitude;

// The API needs latitude and longitude for each city to determine the location and weather.
    if (selectedCity === "Mississauga") {
        latitude = 43.59;
        longitude = -79.64;
    } else {
        latitude = 19.08;
        longitude = 72.88;
    }

// The API URL is constructed using the selected city's latitude and longitude, and it requests current temperature, cloud cover, and precipitation data.
    let apiURL = "https://api.open-meteo.com/v1/forecast?latitude=" + latitude +
        "&longitude=" + longitude +
        "&current=temperature_2m,cloud_cover,precipitation&timezone=auto";

// Displaying a loading message while the request is being processed.
    document.querySelector("#status").textContent = "Loading weather...";
    checkButton.disabled = true;

    try {
// fetch() sends a GET request to the API and retrieves the response.
    let response = await fetch(apiURL);
// response.ok was used as shown in class because a request can receive an unsuccessful HTTP response even when fetch itself does not throw an error.
    if (!response.ok) {
        throw new Error("The weather request failed.");
    }

// Read the JSON response so JS can access the weather data.
    let data = await response.json();

// Read three weather values from the JSON response.
    let temperature = data.current.temperature_2m;
    let clouds = data.current.cloud_cover;
    let precipitation = data.current.precipitation;

// Update the text shown on the webpage. This helps update the HTML elements using the weather values retrieved. textContent replaces the original placeholder text with the actual data.
    document.querySelector("#city-name").textContent = selectedCity;
    document.querySelector("#temperature").textContent = temperature.toFixed(1) + "°C";
    document.querySelector("#cloud-cover").textContent = "Cloud cover: " + clouds + "%";
    document.querySelector("#precipitation").textContent = "Precipitation: " + precipitation + " mm";

 // Make the blue bar match the live cloud-cover percentage.
    document.querySelector("#cloud-bar").style.width = clouds + "%";

// Change the page background and message based on the weather. Depending on the result, JS changes the body's CSS class and displays a suggestion that matches the reported conditions.
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

// The API returns the time for the selected city's local timezone and replace() changes the T between the date and time into a space.
    document.querySelector("#updated-time").textContent =
    "Weather data time: " + data.current.time.replace("T", " ") + " (local time)";

    document.querySelector("#status").textContent = "Weather loaded successfully.";

// If the API request fails or an error occurs while processing the data, this block shows an error message and resets the displayed information.
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

// The "finally" tag runs whether the request succeeds or fails so the user can possibly make another attempt with another city.
    } finally {
// Enable the button again whether the request succeeds or fails.
    checkButton.disabled = false;
    }
}

// This block addEventListener runs getWeather when the user clicks Get Weather.
checkButton.addEventListener("click", getWeather);
getWeather();

