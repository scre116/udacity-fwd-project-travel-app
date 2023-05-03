import dotenv from 'dotenv';

dotenv.config();

function getInfoFromWeatherbit(lat, lng, departureDate) {
    const formattedDate = formatDate(departureDate);

    const url = `https://api.weatherbit.io/v2.0/normals?lat=${lat}&lon=${lng}&start_day=${formattedDate}&end_day=${formattedDate}&tp=daily&key=${process.env.WEATHERBIT_API_KEY}`;

    console.log('Fetching data from Weatherbit: ', url);
    return fetch(url)
        .then((res) => res.json())
        .then((data) => {
            console.log('Received data from Weatherbit: ', data);
            const {max_temp, min_temp, wind_spd, precip} = data.data[0];
            return {
                weather: {
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

export {getInfoFromWeatherbit};