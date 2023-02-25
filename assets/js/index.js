// Global array to hold locations
let recentLocations = [];

// Form submission with conditionals
const submitSearch = (event) => {
    event.preventDefault();
    const userLocation = locationInput.value;
    if (userLocation === '') {
        alert('Please enter a location');
    } else {
        getLocation(userLocation);
    }
}

const recentsearches = (location) => {
    if (!location) return;

    recentLocations.push(location);

    localStorage.setItem('recentLocations', JSON.stringify(recentLocations));
    updateRecentLocationsList();
}

// Creates new list items for recent searches
const updateRecentLocationsList = () => {
    const recentLocationsList = document.getElementById('recent-locations');
    recentLocationsList.innerHTML = '';
    recentLocations.forEach(location => {
        const newLocation = document.createElement('li');
        newLocation.classList.add('recent');
        newLocation.addEventListener('click', onClickRecentLocation);
        console.log(location);
        newLocation.textContent = location.name;

        recentLocationsList.appendChild(newLocation);
    });
    if (recentLocations.length > 0) {
    const clearLocation = document.createElement('button');
    clearLocation.classList.add('clear-recents');
    clearLocation.textContent = 'Clear Recent Locations';
    clearLocation.addEventListener('click', clearRecent);
    recentLocationsList.appendChild(clearLocation);
    }
}

// Clears recent locations
const clearRecent = () => {
    localStorage.clear();
    recentLocations = [];
    loadRecentLocations();
}

// Grabs recent locations from local storage
const loadRecentLocations = () => {
    const locations = localStorage.getItem('recentLocations');
    if (locations) {
        recentLocations.push(...JSON.parse(locations));
    }
    updateRecentLocationsList();
}

const onClickRecentLocation = (event) => {
    const locationName = event.target.textContent;

    recentLocations.filter(location=> {
        if (location.name === locationName) {
            displayWeather(location);
        }
    })
}

// Fetches the city or town from the API
const getLocation = (search) => {
    const apiKey = '57114e0ec905ff83ebe17aa541380675';
    var apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=${apiKey}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const location = data[0];
            console.log(location)
            recentsearches(location);
            displayWeather(location);
        })
}

// Displays the current weather for the day
const displayCurrentWeather = (weatherData) => {
    const currentWeather = weatherData.current;
    console.log('Current Weather', currentWeather);
    const formattedDate = new Date(currentWeather.dt * 1000).toLocaleDateString('en-GB', {dateStyle: 'short'});

    document.querySelector('.weather-icon').innerHTML = `<img src="http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png">`;
    document.querySelector('.weather-date').textContent = `(${formattedDate})`;
    document.getElementById('temperature').textContent = `${currentWeather.temp}°F`;
    document.getElementById('wind-speed').textContent = `${currentWeather.wind_speed} mph`;
    document.getElementById('humidity').textContent = `${currentWeather.humidity}%`;
}

// Displays the forecast for the next 5 days
const displayWeatherForecast = (weatherData) => {
    const dailyData = weatherData.daily;

    const forecastList = document.getElementById('forecast');
    forecastList.innerHTML = '<h3>5-Day Forecast</h3>';

    for (let i = 0; i < 5; i++) {
        const dailyForecast = dailyData[i];
        console.log('Daily Forecast', dailyForecast);
        const day = new Date(dailyForecast.dt * 1000).toLocaleDateString('en-GB', {dateStyle: 'short'});
        const temp = `${dailyForecast.temp.day}°F`;
        const humidity = `${dailyForecast.humidity}%`;
        const wind = `${dailyForecast.wind_speed} mph`;

        const newForecast = document.createElement('div');
        newForecast.classList.add('forecast-day');
        newForecast.innerHTML = `
            <h4 class="date">${day}</h4>

            <img src="http://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png" width="60px" height="60px">

            <dl class="weather-info">
                <dt>Temp</dt>
                <dd>${temp}</dd>

                <dt>Wind</dt>
                <dd>${wind}</dd>

                <dt>Humidity</dt>
                <dd>${humidity}</dd>
            </dl>
        `;
        forecastList.appendChild(newForecast);
    }
}

// Grabs the weather based off the latitude and longitude
const getWeather = (lat, lon) => {
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=d91f911bcf2c0f925fb6535547a5ddc9`
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            displayWeatherForecast(data);
        })
}

const displayWeather = (weatherData) => {
    document.getElementById('location-name').textContent = `${weatherData.name}, ${weatherData.country}`;

    getWeather(weatherData.lat, weatherData.lon);
}

const locationInput = document.getElementById('location');
const searchForm = document.getElementById('search-form');

searchForm.addEventListener('submit', submitSearch);

loadRecentLocations();