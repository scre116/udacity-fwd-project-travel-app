process.env.WEATHERBIT_API_KEY = 'test-key';
import {forecastIsAvailable, getInfoFromWeatherbit} from '../../src/server/weatherbitConnector';

global.fetch = require('jest-fetch-mock');

describe('forecastIsAvailable', () => {
    it('should return true if departure date is within 15 days', () => {
        const today = new Date();
        const departure = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15);

        expect(forecastIsAvailable(departure)).toBe(true);
    });

    it('should return false if departure date is more than 15 days away', () => {
        const today = new Date();
        const departure = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 16);

        expect(forecastIsAvailable(departure)).toBe(false);
    });

    it('should return true if departure date is today', () => {
        const today = new Date();
        const departure = new Date();

        expect(forecastIsAvailable(departure)).toBe(true);
    });

    it('should return false if departure date is in the past', () => {
        const today = new Date();

        const departure = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);

        expect(forecastIsAvailable(departure)).toBe(false);
    });
});

describe('getInfoFromWeatherbit', () => {
    describe('Get weather normals', () => {
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
                    forecastType: 'normals',
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

    describe('Get weather forecast', () => {
        beforeEach(() => {
            // Mock the new Date() call
            jest.useFakeTimers('modern');
            jest.setSystemTime(new Date('2017-04-01'));
        });

        afterEach(() => {
            // Restore the system time after each test
            jest.useRealTimers();
        });

        it('should return the correct data', async () => {
            fetch.mockResponseOnce(JSON.stringify({
                data: [{
                    valid_date: "2017-04-01",
                    max_temp: 20,
                    min_temp: 10,
                    wind_spd: 5,
                    precip: 0,
                }, {
                    valid_date: "2017-04-02",
                    max_temp: 40,
                    min_temp: 30,
                    wind_spd: 15,
                    precip: 10,
                }]
            }));

            const data = await getInfoFromWeatherbit(51.50853, -0.12574, '2017-04-02');

            expect(fetch).toHaveBeenCalledWith("https://api.weatherbit.io/v2.0/forecast/daily?lat=51.50853&lon=-0.12574&key=test-key");
            expect(data).toEqual({
                weather: {
                    forecastType: 'forecast',
                    tempHigh: 40,
                    tempLow: 30,
                    windSpeed: 15,
                    precipitation: 10,
                }
            });
        });

        it('should return empty result if an error has occurred', async () => {
            // fetch throws an error
            fetch.mockRejectOnce(new Error('Bad request'));

            const data = await getInfoFromWeatherbit(51.50853, -0.12574, '2017-04-02');

            expect(data).toEqual({error: new Error('Bad request')});
        });

        it('should return empty result if no forecast is available', async () => {
            fetch.mockResponseOnce(JSON.stringify({
                data: [{
                    valid_date: "2017-04-01",
                    max_temp: 20,
                    min_temp: 10,
                    wind_spd: 5,
                    precip: 0,
                }, {
                    valid_date: "2017-04-03",
                    max_temp: 40,
                    min_temp: 30,
                    wind_spd: 15,
                    precip: 10,
                }]
            }));

            const data = await getInfoFromWeatherbit(51.50853, -0.12574, '2017-04-02');

            expect(data).toEqual({error: new Error('No forecast available for departure date')});
        });
    });

    describe('Error handling', () => {
        it('should return an error if Weatherbit API key is not configured', async () => {
            delete process.env.WEATHERBIT_API_KEY;

            const data = await getInfoFromWeatherbit(51.50853, -0.12574, '2021-01-01');

            expect(data).toEqual({error: new Error('Weatherbit API key is not configured')});
        });
    });
});
