// mock .env before import of geonamesConnector.js
process.env.GEONAMES_USERNAME = 'test-username';
import {getInfoFromGeonames} from "../../src/server/geonamesConnector.js";

global.fetch = require('jest-fetch-mock');

describe('getInfoFromGeonames', () => {

    it('should return the correct data', async () => {
        fetch.mockResponseOnce(JSON.stringify({
            totalResultsCount: 100,
            geonames: [{
                lat: '51.50853',
                lng: '-0.12574',
                name: 'Bree',
                countryName: 'Middle Earth',
                geonameId: 2643743,
            }]
        }));

        const data = await getInfoFromGeonames('Bree');
        
        expect(fetch).toHaveBeenCalledWith('http://api.geonames.org/searchJSON?q=Bree&maxRows=1&fuzzy=0.8&username=test-username');

        expect(data).toEqual({
            lat: '51.50853',
            lng: '-0.12574',
            name: 'Bree',
            countryName: 'Middle Earth',
            resultCount: 100,
        });
    });

    it('should return empty result if nothing was found', async () => {
        fetch.mockResponseOnce(JSON.stringify({
            totalResultsCount: 0,
            geonames: []
        }));

        const data = await getInfoFromGeonames('Longbottom');

        expect(data).toEqual({resultCount: 0});
    });

    it('should return empty result if an error has occurred', async () => {
        // fetch throws an error
        fetch.mockRejectOnce(new Error('Prohibited destination'));

        const data = await getInfoFromGeonames('Barrow Downs');

        expect(data).toEqual({error: new Error('Prohibited destination')});
    });
});