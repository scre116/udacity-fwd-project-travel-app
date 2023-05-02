import request from 'supertest';
import {app} from '../../src/server/index.js';
import fetch from 'jest-fetch-mock';
import * as tripsDB from '../../src/server/tripsDB.js';

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
            destination: 'Test Destination',
            departureDate: '2023-01-01',
        };

        tripsDB.addTrip = jest.fn().mockImplementation(() => {
        });

        const response = await request(app).post('/trip').send(tripData);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Trip added successfully');
        expect(tripsDB.addTrip).toHaveBeenCalledWith(
            expect.objectContaining({
                destination: tripData.destination,
                departureDate: tripData.departureDate,
            }),
        );
    });
});


describe('GET /analyze', () => {
    it('should response with analysis', async () => {
        fetch.mockResponseOnce(JSON.stringify({
            agreement: 'AGREEMENT',
            confidence: '100',
            irony: 'NONIRONIC',
            model: 'general_en',
            score_tag: 'NONE',
            sentence_list: [{
                whatever: 'whatever',
            }],
            sentimented_concept_list: [],
            sentimented_entity_list: [],
            status: {code: '0', msg: 'OK', credits: '1', remaining_credits: '19956'},
            subjectivity: 'OBJECTIVE'
        }));

        const response = await request(app).get('/analyze?text=test');

        expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/https:\/\/api\.meaningcloud\.com\/sentiment-2\.1\?key=.*&lang=en&egp=y&txt=test/));
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            polarity: 'Without Polarity',
            subjectivity: 'Objective',
            irony: 'Nonironic',
            agreement: 'Agreement',
            confidence: '100'
        });
    });

    it('should response with error if status code is not 0', async () => {
        fetch.mockResponseOnce(JSON.stringify({
            status: {code: '1', msg: 'ERROR MSG', credits: '1', remaining_credits: '19956'},
        }));

        const response = await request(app).get('/analyze?text=test');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({"error": "ERROR MSG"});
    });

    it('should response with error if fetch fails', async () => {
        fetch.mockRejectOnce('some error');

        const response = await request(app).get('/analyze?text=test');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({"error": "some error"});
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
