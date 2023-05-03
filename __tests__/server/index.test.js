import request from 'supertest';
import {app} from '../../src/server/index.js';
import * as tripsDB from '../../src/server/tripsDB.js';
import * as geonamesConnector from '../../src/server/geonamesConnector.js';


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
                lat: 1,
                lng: 1,
                name: 'Found Destination',
                countryName: 'Found Country',
            };
        });
        tripsDB.addTrip = jest.fn().mockImplementation(() => {
        });

        const response = await request(app).post('/trip').send(tripData);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Trip added successfully');
        expect(tripsDB.addTrip).toHaveBeenCalledWith(
            expect.objectContaining({
                destination: "Found Destination, Found Country",
                departureDate: tripData.departureDate,
            }),
        );
    });

    it('should return a warning if no destination was found', async () => {
        const tripData = {
            destination: 'Searched Destination',
            departureDate: '2023-01-01',
        };

        geonamesConnector.getInfoFromGeonames = jest.fn().mockImplementation(() => {
            return {
                resultCount: 0,
            };
        });
        tripsDB.addTrip = jest.fn().mockImplementation(() => {
        });

        const response = await request(app).post('/trip').send(tripData);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Trip added successfully');
        expect(response.body.warnings).toEqual(['No results found for destination Searched Destination']);
        expect(tripsDB.addTrip).toHaveBeenCalledWith(
            expect.objectContaining({
                destination: tripData.destination,
                departureDate: tripData.departureDate,
            }),
        );
    });

    it('should return a warning if geonames API returned an error', async () => {
        const tripData = {
            destination: 'Searched Destination',
            departureDate: '2023-01-01',
        };

        geonamesConnector.getInfoFromGeonames = jest.fn().mockImplementation(() => {
            return {
                error: 'Error while calling geonames API',
            };
        });
        tripsDB.addTrip = jest.fn().mockImplementation(() => {
        });

        const response = await request(app).post('/trip').send(tripData);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Trip added successfully');
        expect(response.body.warnings).toEqual(['Error while calling geonames API: Error while calling geonames API']);
        expect(tripsDB.addTrip).toHaveBeenCalledWith(
            expect.objectContaining({
                destination: tripData.destination,
                departureDate: tripData.departureDate,
            }),
        );
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
