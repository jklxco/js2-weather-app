import './style.css';
import {format} from 'date-fns';

getWeatherData('Birmingham');


async function getWeatherData(location){
    try {
        const url = `https://api.weatherapi.com/v1/forecast.json?key=b4466b3aae3b4ecb8e2100139231309&q=${location}&days=3`;
        const response = await fetch(url, {mode:'cors'});
        const data = await response.json();
        const todayWeather = createTodayWeather(data);
        const tomorrowWeather = createForecast(data.forecast.forecastday[1], 'tomorrow')
        const overmorrowWeather = createForecast(data.forecast.forecastday[2], 'overmorrow')
        console.log(data)
        displayData(todayWeather)
        hourlyWidget(data.forecast.forecastday[0].hour)
        displayForecast(tomorrowWeather)
        displayForecast(overmorrowWeather)
        
    } catch (error){
        console.log(`Error Message: ${error}`);
    }
    
}

function createTodayWeather(data){
    return {
            name: 'today',
            date: format(new Date (data.forecast.forecastday[0].date,), 'PPPP').toUpperCase(),
            location: data.location.name,
            currentTemp: data.current.temp_c,
            maxTemp: data.forecast.forecastday[0].day.maxtemp_c,
            minTemp: data.forecast.forecastday[0].day.mintemp_c,
            chanceOfRain: data.forecast.forecastday[0].day.daily_chance_of_rain,
            chanceOfSnow: data.forecast.forecastday[0].day.daily_chance_of_snow,
            uv: data.forecast.forecastday[0].day.uv,
            feelsLike: data.current.feelslike_c,
            condition: data.current.condition.text,
            humidity: data.current.humidity,
            windSpeedMph: data.current.wind_mph,
            localTime: data.location.localtime,
            region: data.location.region,
            country: data.location.country,
        }
}

function createForecast(data, name){
    return {
        name,
        day: format(new Date (data.date), 'EEE').toUpperCase(),
        date: data.date,
        avgTemp: data.day.avgtemp_c,
        maxTemp: data.day.maxtemp_c,
        minTemp: data.day.mintemp_c,
        condition: data.day.condition.text,
        chanceOfRain: data.day.daily_chance_of_rain,     
        }
}

function displayData(weatherObj) {
    const currentTemp = document.querySelector('[data-current-temp]');
    const feelsLike = document.querySelector('[data-feels-like]');
    const condition = document.querySelector('[data-condition]');
    const humidity = document.querySelector('[data-humidity]');
    const windSpeed = document.querySelector('[data-wind-speed]');
    const location = document.querySelector('[data-current-location]');
    const country = document.querySelector('[data-current-country]');
    const date = document.querySelector('[data-current-date');
    const minTemp = document.querySelector('[data-current-min-temp');
    const maxTemp = document.querySelector('[data-current-max-temp');


    currentTemp.innerText = weatherObj.currentTemp;
    feelsLike.innerText = weatherObj.feelsLike;
    condition.innerText = weatherObj.condition;
    humidity.innerText = weatherObj.humidity;
    windSpeed.innerText = weatherObj.windSpeedMph;
    location.innerText = weatherObj.location;
    country.innerText = weatherObj.country;
    date.innerText = weatherObj.date;
    minTemp.innerText = weatherObj.minTemp;
    maxTemp .innerText = weatherObj.maxTemp;
}

function displayForecast(forecast){
    const day = document.querySelector(`[data-day-${forecast.name}]`);
    const avg = document.querySelector(`[data-avg-${forecast.name}]`);
    const min = document.querySelector(`[data-min-${forecast.name}]`);
    const max = document.querySelector(`[data-max-${forecast.name}]`);
    const rain = document.querySelector(`[data-rain-${forecast.name}]`);
    const condition = document.querySelector(`[data-condition-${forecast.name}]`);

    day.innerText = forecast.day;
    avg.innerText = `${forecast.avgTemp}°C`;
    max.innerText = `H:${forecast.maxTemp}°C`;
    min.innerText = `L:${forecast.minTemp}°C`;
    rain.innerText = `${forecast.chanceOfRain}%`;
    condition.innerText = forecast.condition;
}

function createIconifyIcon(condition) {
    const icon = document.createElement('iconify-icon');
    
    icon.width="2rem";
    icon.height="2rem";

    if (condition === 1000) {
        icon.icon="mdi:white-balance-sunny"
        icon.style.color = "orange"
    } else if (condition===1003 ||condition===1006 || condition===1009 || condition ===1030 ) {
        icon.icon="mdi:weather-cloudy"
        
    } else if (condition===1183 ||condition===1186 || condition===1189 ) {
        icon.icon="mdi:weather-pouring"
    } else {
        console.log(condition)
    }
    return icon
}

function hourlyWidget(data) {
    const hourlyWidgetContainer = document.querySelector('[data-hourly-container]')
    data.forEach((hour) => {
        const container = document.createElement('div');
        container.classList.add('hourly-item');
        const time = document.createElement('div');
        time.classList.add('hourly-time')
        const temp = document.createElement('div');
        temp.classList.add('hourly-temp')
        const condition = createIconifyIcon(hour.condition.code);
        time.innerText = format(new Date(hour.time), 'HH' );
        temp.innerText = Math.round(hour.temp_c);
        container.appendChild(time)
        container.appendChild(condition);
        container.appendChild(temp);
        hourlyWidgetContainer.appendChild(container);
    })
    
}


// <iconify-icon icon="mdi:weather-cloudy"></iconify-icon>