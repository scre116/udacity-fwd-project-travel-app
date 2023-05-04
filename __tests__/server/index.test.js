import request from 'supertest';
import {app} from '../../src/server/index.js';
import * as tripsDB from '../../src/server/tripsDB.js';
import * as geonamesConnector from '../../src/server/geonamesConnector.js';
import * as weatherbitConnector from '../../src/server/weatherbitConnector.js';
import * as pixabayConnector from '../../src/server/pixabayConnector.js';

beforeEach(() => {
    jest.clearAllMocks();
});

describe('GET /', () => {
    it('should respond with index.html', async () => {
        const response = await request(app).get('/');

        expect(response.statusCode).toBe(200);
        expect(response.text).toContain("<title>Travel Planer</title>");
    });
});


describe('POST /trip', () => {
    const placeholderImage = 'https://pixabay.com/get/g36febc1a57d6e60176f1eb69abe9eff3f2264cc91c32fd36a072a1fc813270901c99a082880ca1559f4d9852446a06ed_640.jpg';

    const tripData = {
        destination: 'Searched Destination',
        departureDate: '2023-01-01',
    };

    function mockGeonames() {
        geonamesConnector.getInfoFromGeonames = jest.fn().mockImplementation(() => {
            return {
                resultCount: 1,
                lat: 1.57474,
                lng: -1.23423,
                name: 'Found Destination',
                countryName: 'Found Country',
            };
        });
    }

    function mockWeatherbit() {
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
    }

    function mockPixabay() {
        pixabayConnector.getInfoFromPixabay = jest.fn().mockImplementation(() => {
            return {
                resultCount: 1,
                imgUrl: 'https://cdn.pixabay.com/abc.jpg',
            };
        });
    }

    function mockTripsDB() {
        tripsDB.addTrip = jest.fn();
    }

    it('should add a trip and return a success message', async () => {
        mockGeonames();

        mockWeatherbit();

        mockPixabay();

        mockTripsDB();

        const response = await request(app).post('/trip').send(tripData);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'Trip added successfully',
            warnings: [],
        });

        expect(geonamesConnector.getInfoFromGeonames).toHaveBeenCalledWith('Searched Destination');
        expect(weatherbitConnector.getInfoFromWeatherbit).toHaveBeenCalledWith(1.57474, -1.23423, '2023-01-01');
        expect(pixabayConnector.getInfoFromPixabay).toHaveBeenCalledWith('Found Destination, Found Country');

        expect(tripsDB.addTrip).toHaveBeenCalledWith({
            destination: 'Found Destination, Found Country',
            departureDate: '2023-01-01',
            imgDestination: 'https://cdn.pixabay.com/abc.jpg',
            weather: {
                precipitation: 0,
                tempHigh: 20,
                tempLow: 10,
                windSpeed: 5,
            },
        });
    });

    it('should add a trip and return a warning if no destination was found', async () => {

        geonamesConnector.getInfoFromGeonames = jest.fn().mockImplementation(() => {
            return {
                resultCount: 0,
            };
        });

        mockWeatherbit();

        mockPixabay();

        mockTripsDB();

        const response = await request(app).post('/trip').send(tripData);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'Trip added successfully',
            warnings: ['No results found for destination "Searched Destination" through Geonames API'],
        });

        expect(weatherbitConnector.getInfoFromWeatherbit).not.toHaveBeenCalled();

        expect(pixabayConnector.getInfoFromPixabay).toHaveBeenCalledWith('Searched Destination');

        expect(tripsDB.addTrip).toHaveBeenCalledWith({
            destination: 'Searched Destination',
            departureDate: '2023-01-01',
            imgDestination: 'https://cdn.pixabay.com/abc.jpg',
            weather: null,
        });
    });

    it('should add a trip and return a warning if Geonames API returned an error', async () => {

        geonamesConnector.getInfoFromGeonames = jest.fn().mockImplementation(() => {
            return {
                error: 'Error while calling geonames API',
            };
        });

        mockWeatherbit();

        mockPixabay();

        mockTripsDB();

        const response = await request(app).post('/trip').send(tripData);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'Trip added successfully',
            warnings: ['Error while calling Geonames API: Error while calling geonames API'],
        });

        expect(weatherbitConnector.getInfoFromWeatherbit).not.toHaveBeenCalled();

        expect(pixabayConnector.getInfoFromPixabay).toHaveBeenCalledWith('Searched Destination');

        expect(tripsDB.addTrip).toHaveBeenCalledWith({
            destination: 'Searched Destination',
            departureDate: '2023-01-01',
            imgDestination: 'https://cdn.pixabay.com/abc.jpg',
            weather: null,
        });
    });

    it('should add a trip and return a warning, if Weatherbit API returned an error', async () => {

        mockGeonames();

        weatherbitConnector.getInfoFromWeatherbit = jest.fn().mockImplementation(() => {
            return {
                error: 'wrong API key',
            };
        });

        mockPixabay();

        mockTripsDB();

        const response = await request(app).post('/trip').send(tripData);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'Trip added successfully',
            warnings: ['Error while calling Weatherbit API: wrong API key'],
        });

        expect(geonamesConnector.getInfoFromGeonames).toHaveBeenCalledWith('Searched Destination');
        expect(weatherbitConnector.getInfoFromWeatherbit).toHaveBeenCalledWith(1.57474, -1.23423, '2023-01-01');
        expect(pixabayConnector.getInfoFromPixabay).toHaveBeenCalledWith('Found Destination, Found Country');

        expect(tripsDB.addTrip).toHaveBeenCalledWith({
            destination: 'Found Destination, Found Country',
            departureDate: '2023-01-01',
            imgDestination: 'https://cdn.pixabay.com/abc.jpg',
            weather: null,
        });

    })

    it('should add a trip and return a warning if no picture was found', async () => {

        mockGeonames();

        mockWeatherbit();

        pixabayConnector.getInfoFromPixabay = jest.fn().mockImplementation(() => {
            return {
                resultCount: 0,
            };
        });

        mockTripsDB();

        const response = await request(app).post('/trip').send(tripData);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'Trip added successfully',
            warnings: ['No pictures found for destination Found Destination, Found Country'],
        });

        expect(geonamesConnector.getInfoFromGeonames).toHaveBeenCalledWith('Searched Destination');
        expect(weatherbitConnector.getInfoFromWeatherbit).toHaveBeenCalledWith(1.57474, -1.23423, '2023-01-01');
        expect(pixabayConnector.getInfoFromPixabay).toHaveBeenCalledWith('Found Destination, Found Country');

        expect(tripsDB.addTrip).toHaveBeenCalledWith({
            destination: 'Found Destination, Found Country',
            departureDate: '2023-01-01',
            imgDestination: placeholderImage,
            weather: {
                precipitation: 0,
                tempHigh: 20,
                tempLow: 10,
                windSpeed: 5,
            },
        });
    });

    it('should add a trip and return a warning if Pixaby API call resulted in an error', async () => {

        mockGeonames();

        mockWeatherbit();

        pixabayConnector.getInfoFromPixabay = jest.fn().mockImplementation(() => {
            return {
                error: 'wrong API key',
            };
        });

        mockTripsDB();

        const response = await request(app).post('/trip').send(tripData);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'Trip added successfully',
            warnings: ['Error while calling Pixabay API: wrong API key'],
        });

        expect(geonamesConnector.getInfoFromGeonames).toHaveBeenCalledWith('Searched Destination');
        expect(weatherbitConnector.getInfoFromWeatherbit).toHaveBeenCalledWith(1.57474, -1.23423, '2023-01-01');
        expect(pixabayConnector.getInfoFromPixabay).toHaveBeenCalledWith('Found Destination, Found Country');

        expect(tripsDB.addTrip).toHaveBeenCalledWith({
            destination: 'Found Destination, Found Country',
            departureDate: '2023-01-01',
            imgDestination: placeholderImage,
            weather: {
                precipitation: 0,
                tempHigh: 20,
                tempLow: 10,
                windSpeed: 5,
            },
        });
    });

    it('should add a trip and return a warning if all API calls resulted in errors', async () => {

        geonamesConnector.getInfoFromGeonames = jest.fn().mockImplementation(() => {
            return {
                error: 'wrong API key',
            };
        });

        mockWeatherbit();

        pixabayConnector.getInfoFromPixabay = jest.fn().mockImplementation(() => {
            return {
                error: 'wrong API key',
            };
        });

        mockTripsDB();

        const response = await request(app).post('/trip').send(tripData);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'Trip added successfully',
            warnings: [
                'Error while calling Geonames API: wrong API key',
                'Error while calling Pixabay API: wrong API key',
            ],
        });

        expect(geonamesConnector.getInfoFromGeonames).toHaveBeenCalledWith('Searched Destination');
        expect(weatherbitConnector.getInfoFromWeatherbit).not.toHaveBeenCalled();
        expect(pixabayConnector.getInfoFromPixabay).toHaveBeenCalledWith('Searched Destination');

        expect(tripsDB.addTrip).toHaveBeenCalledWith({
            destination: 'Searched Destination',
            departureDate: '2023-01-01',
            imgDestination: placeholderImage,
            weather: null,
        });
    });

    it('should return an error if the trip could not be saved', async function () {

        mockGeonames();

        mockWeatherbit();

        mockPixabay();

        tripsDB.addTrip = jest.fn().mockImplementation(() => {
            throw new Error('Could not save trip');
        });

        const response = await request(app).post('/trip').send(tripData);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            message: 'Error while saving trip in database: Could not save trip',
            warnings: [],
        });

        expect(geonamesConnector.getInfoFromGeonames).toHaveBeenCalledWith('Searched Destination');
        expect(weatherbitConnector.getInfoFromWeatherbit).toHaveBeenCalledWith(1.57474, -1.23423, '2023-01-01');
        expect(pixabayConnector.getInfoFromPixabay).toHaveBeenCalledWith('Found Destination, Found Country');

        expect(tripsDB.addTrip).toHaveBeenCalledWith({
            destination: 'Found Destination, Found Country',
            departureDate: '2023-01-01',
            imgDestination: 'https://cdn.pixabay.com/abc.jpg',
            weather: {
                precipitation: 0,
                tempHigh: 20,
                tempLow: 10,
                windSpeed: 5,
            },
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
