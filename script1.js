//------- Const for API Key -------//
const apiKey = 'a048d7baea0645f80c432a31eda5d1ae';  // Always replace with your actual OpenWeatherMap API key

//------- Async/Await with Fetch -------//
async function getWeather() {
    //------- Template Literals and Const -------//
    const city = document.getElementById('cityInput').value;

    // Check if the city input is empty
    if (city.trim() === '') {
        alert('Please enter a city name.');
        return; // Exit the function early if city input is empty
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    try {
        //------- Await with Fetch -------//
        const response = await fetch(currentWeatherUrl);
        if (!response.ok) {
            //------- Throw in Async/Await Context -------//
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        //------- Destructuring JSON Response -------//
        const data = await response.json();
        displayWeather(data);

        //------- Obtain Latitude and Longitude -------//
        const { coord } = data; // Extracting coordinates from the response data
        const { lat, lon } = coord;

        // URL for One Call API (weather forecast data) using obtained latitude and longitude
        const oneCallUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        // Fetch weather forecast data using One Call API
        const forecastResponse = await fetch(oneCallUrl);
        if (!forecastResponse.ok) {
            throw new Error(`HTTP error! Status: ${forecastResponse.status}`);
        }
        const forecastData = await forecastResponse.json();
        console.log("Forecast Data:", forecastData);
    } catch (error) {
        console.error('Failed to fetch weather data:', error);
        alert('Failed to fetch weather data.');
    }
}

function displayWeather(data) {
    //------- Destructuring for Easier Access to Nested Data -------//
    const { main: { temp, humidity }, weather, wind: { speed }, sys: { country }, name } = data;
    const [{ main: weatherMain, description, icon }] = weather;  // Nested Destructuring

    //------- Const for DOM Manipulation -------//
    const weatherDisplay = document.getElementById('weatherDisplay');
    if (data.cod !== 200) {
        weatherDisplay.innerHTML = `<p>Error: ${data.message}</p>`;
        return;
    }

    //------- Template Literals for HTML Generation -------//
    const weatherHTML = `
        <h2>Weather in ${name}, ${country}</h2>
        <p>Temperature: ${temp} °C</p>
        <p>Weather: ${weatherMain} (${description})</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind: ${speed} m/s</p>
        <img src="https://openweathermap.org/img/w/${icon}.png" alt="Weather icon">
    `;
    weatherDisplay.innerHTML = weatherHTML;
}
