process.env.WEATHERBIT_API_KEY = 'test-key';
import {getInfoFromWeatherbit} from '../../src/server/weatherbitConnector';

global.fetch = require('jest-fetch-mock');

describe('getInfoFromWeatherbit', () => {

    it('should return the correct data', async () => {
        fetch.mockResponseOnce(JSON.stringify({
            data: [{
                max_temp: 20,
                min_temp: 10,
                wind_spd: 5,
                precip: 0,
            }]
        }));

        const data = await getInfoFromWeatherbit(51.50853, -0.12574, '2021-01-01');

        expect(fetch).toHaveBeenCalledWith(
            'https://api.weatherbit.io/v2.0/normals?lat=51.50853&lon=-0.12574&start_day=01-01&end_day=01-01&tp=daily&key=test-key');
        expect(data).toEqual({
            weather: {
                tempHigh: 20,
                tempLow: 10,
                windSpeed: 5,
                precipitation: 0,
            }
        });
    });

    it('should return empty result if an error has occurred', async () => {
        // fetch throws an error
        fetch.mockRejectOnce(new Error('Bad request'));

        const data = await getInfoFromWeatherbit(51.50853, -0.12574, '2021-01-01');

        expect(data).toEqual({error: new Error('Bad request')});
    });
});