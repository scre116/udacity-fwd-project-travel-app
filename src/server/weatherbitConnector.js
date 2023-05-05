import dotenv from 'dotenv';

dotenv.config();

function getInfoFromWeatherbit(lat, lng, departureDate) {
    const weatherbitApiKey = process.env.WEATHERBIT_API_KEY;
    if (!weatherbitApiKey) {
        return {error: new Error('Weatherbit API key is not configured')};
    }

    if (forecastIsAvailable(departureDate)) {
        return getWeatherForecast(lat, lng, departureDate);
    }
    return getWeatherNormals(lat, lng, departureDate);
}

function forecastIsAvailable(departure) {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    const departureDate = new Date(departure);
    const daysUntilDeparture = Math.round((departureDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    console.log(`Today is ${today}, departure is ${departureDate}, days until departure: ${daysUntilDeparture}`);

    return daysUntilDeparture >= 0 && daysUntilDeparture <= 15;
}

function getWeatherForecast(lat, lng, departureDate) {
    const urlWithoutKey = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=`;
    console.log(`Fetching data from Weatherbit: ${urlWithoutKey}*****`);

    const url = `${urlWithoutKey}${process.env.WEATHERBIT_API_KEY}`;

    return fetch(url)
        .then((res) => res.json())
        .then((data) => {
            console.log('Received data from Weatherbit: ', data);
            const {max_temp, min_temp, wind_spd, precip} = getForecastForDate(data, departureDate);
            return {
                weather:
                    {
                        forecastType: 'forecast',
                        tempHigh: max_temp,
                        tempLow: min_temp,
                        windSpeed: wind_spd,
                        precipitation: precip
                    }
            };
        })
        .catch((err) => {
            console.log(err);
            return {error: err};
        });
}

function getForecastForDate(data, departureDate) {
    const forecast = data.data.find((day) => day.valid_date === departureDate);
    if (forecast) {
        return forecast;
    } else {
        console.error(`Expected a forecast for departure date ${departureDate}, but none was found in data: ${data}`);
        throw new Error('No forecast available for departure date');
    }
}

function getWeatherNormals(lat, lng, departureDate) {
    const formattedDate = formatDate(departureDate);
    const urlWithoutKey = `https://api.weatherbit.io/v2.0/normals?lat=${lat}&lon=${lng}&start_day=${formattedDate}&end_day=${formattedDate}&tp=daily&key=`;
    console.log(`Fetching data from Weatherbit: ${urlWithoutKey}*****`);

    const url = `${urlWithoutKey}${process.env.WEATHERBIT_API_KEY}`;
    
    return fetch(url)
        .then((res) => res.json())
        .then((data) => {
            console.log('Received data from Weatherbit: ', data);
            const {max_temp, min_temp, wind_spd, precip} = data.data[0];
            return {
                weather: {
                    forecastType: 'normals',
                    tempHigh: max_temp,
                    tempLow: min_temp,
                    windSpeed: wind_spd,
                    precipitation: precip
                }
            };
        })
        .catch((err) => {
            console.log(err);
            return {error: err};
        });
}

function formatDate(departureDate) {
    // change date from YYYY-MM-DD to MM-DD
    return departureDate.slice(5, 10);
}

export {getInfoFromWeatherbit, forecastIsAvailable};