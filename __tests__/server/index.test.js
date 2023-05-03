import request from 'supertest';
import {app} from '../../src/server/index.js';
import * as tripsDB from '../../src/server/tripsDB.js';
import * as geonamesConnector from '../../src/server/geonamesConnector.js';
import * as weatherbitConnector from '../../src/server/weatherbitConnector.js';


describe('GET /', () => {
    it('should respond with index.html', async () => {
        const response = await request(app).get('/');

        expect(response.statusCode).toBe(200);
        expect(response.text).toContain("<title>Travel Planer</title>");
    });
});


describe('POST /trip', () => {

    it('should add a trip and return a success message', async () => {
        const tripData = {
            destination: 'Searched Destination',
            departureDate: '2023-01-01',
        };

        geonamesConnector.getInfoFromGeonames = jest.fn().mockImplementation(() => {
            return {
                resultCount: 1,
                lat: 1.57474,
                lng: -1.23423,
                name: 'Found Destination',
                countryName: 'Found Country',
            };
        });

        weatherbitConnector.getInfoFromWeatherbit = jest.fn().mockImplementation(() => {
            return {
                weather: {
                    tempHigh: 20,
                    tempLow: 10,
                    windSpeed: 5,
                    precipitation: 0,
                },
            };
        });

        tripsDB.addTrip = jest.fn().mockImplementation(() => {
        });

        const response = await request(app).post('/trip').send(tripData);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'Trip added successfully',
            warnings: [],
        });

        expect(geonamesConnector.getInfoFromGeonames).toHaveBeenCalledWith('Searched Destination');
        expect(weatherbitConnector.getInfoFromWeatherbit).toHaveBeenCalledWith(1.57474, -1.23423, '2023-01-01');

        expect(tripsDB.addTrip).toHaveBeenCalledWith({
            destination: 'Found Destination, Found Country',
            departureDate: '2023-01-01',
            imgDestination: 'https://cdn.pixabay.com/photo/2013/04/11/19/46/building-102840_960_720.jpg',
            weather: {
                precipitation: 0,
                tempHigh: 20,
                tempLow: 10,
                windSpeed: 5,
            },
        });

    });

    it('should add a trip and return a warning if no destination was found', async () => {
        const tripData = {
            destination: 'Searched Destination',
            departureDate: '2023-01-01',
        };

        geonamesConnector.getInfoFromGeonames = jest.fn().mockImplementation(() => {
            return {
                resultCount: 0,
            };
        });
        weatherbitConnector.getInfoFromWeatherbit = jest.fn();
        tripsDB.addTrip = jest.fn();

        const response = await request(app).post('/trip').send(tripData);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'Trip added successfully',
            warnings: ['No results found for destination Searched Destination'],
        });

        expect(weatherbitConnector.getInfoFromWeatherbit).not.toHaveBeenCalled();

        expect(tripsDB.addTrip).toHaveBeenCalledWith({
            destination: 'Searched Destination',
            departureDate: '2023-01-01',
            imgDestination: 'https://cdn.pixabay.com/photo/2013/04/11/19/46/building-102840_960_720.jpg',
            weather: null,
        });
    });

    it('should add a trip and return a warning if Geonames API returned an error', async () => {
        const tripData = {
            destination: 'Searched Destination',
            departureDate: '2023-01-01',
        };

        geonamesConnector.getInfoFromGeonames = jest.fn().mockImplementation(() => {
            return {
                error: 'Error while calling geonames API',
            };
        });
        weatherbitConnector.getInfoFromWeatherbit = jest.fn();
        tripsDB.addTrip = jest.fn();

        const response = await request(app).post('/trip').send(tripData);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'Trip added successfully',
            warnings: ['Error while calling Geonames API: Error while calling geonames API'],
        });

        expect(weatherbitConnector.getInfoFromWeatherbit).not.toHaveBeenCalled();

        expect(tripsDB.addTrip).toHaveBeenCalledWith({
            destination: 'Searched Destination',
            departureDate: '2023-01-01',
            imgDestination: 'https://cdn.pixabay.com/photo/2013/04/11/19/46/building-102840_960_720.jpg',
            weather: null,
        });
    });

    it('should add a trip and return a warning, if Weatherbit API returned an error', async () => {
        const tripData = {
            destination: 'Searched Destination',
            departureDate: '2023-01-01',
        };

        geonamesConnector.getInfoFromGeonames = jest.fn().mockImplementation(() => {
            return {
                resultCount: 1,
                lat: 1.57474,
                lng: -1.23423,
                name: 'Found Destination',
                countryName: 'Found Country',
            };
        });

        weatherbitConnector.getInfoFromWeatherbit = jest.fn().mockImplementation(() => {
            return {
                error: 'wrong API key',
            };
        });

        tripsDB.addTrip = jest.fn();

        const response = await request(app).post('/trip').send(tripData);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'Trip added successfully',
            warnings: ['Error while calling Weatherbit API: wrong API key'],
        });

        expect(geonamesConnector.getInfoFromGeonames).toHaveBeenCalledWith('Searched Destination');
        expect(weatherbitConnector.getInfoFromWeatherbit).toHaveBeenCalledWith(1.57474, -1.23423, '2023-01-01');

        expect(tripsDB.addTrip).toHaveBeenCalledWith({
            destination: 'Found Destination, Found Country',
            departureDate: '2023-01-01',
            imgDestination: 'https://cdn.pixabay.com/photo/2013/04/11/19/46/building-102840_960_720.jpg',
            weather: null,
        });

    });
});

describe('GET /trips', () => {

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return the trips from loadTrips', async () => {
        const mockTrips = [{destination: 'Paris', departureDate: '2020-01-01'}];
        tripsDB.loadTrips = jest.fn().mockReturnValue(mockTrips);

        const response = await request(app).get('/trips');

        expect(response.status).toEqual(200);
        expect(response.body).toEqual(mockTrips);
        expect(tripsDB.loadTrips).toHaveBeenCalled();
    });
});
