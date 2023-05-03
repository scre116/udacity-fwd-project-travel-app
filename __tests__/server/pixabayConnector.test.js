// mock .env before import of pixabayConnector.js
process.env.PIXABAY_API_KEY = 'pixabay-api-key';
import {getInfoFromPixabay} from '../../src/server/pixabayConnector';

global.fetch = require('jest-fetch-mock');

describe('getInfoFromPixabay', () => {

    it('should return the correct data', async () => {
        fetch.mockResponseOnce(JSON.stringify({
            totalHits: 100,
            hits: [{
                webformatURL: 'https://pixabay.com/get/54e8d14b4d52a814f6da8c7dda79367b1c3ad9e4564c704c7c2f7cd09e4dc15db8_640.jpg'
            }]
        }));

        const data = await getInfoFromPixabay('Bree, Middle Earth');

        expect(fetch).toHaveBeenCalledWith('https://pixabay.com/api/?key=pixabay-api-key' +
            '&q=Bree,+Middle+Earth&image_type=photo&orientation=horizontal&per_page=3');
        expect(data).toEqual({
            imgUrl: 'https://pixabay.com/get/54e8d14b4d52a814f6da8c7dda79367b1c3ad9e4564c704c7c2f7cd09e4dc15db8_640.jpg',
            resultCount: 100,
        });
    });

    it('should return empty result if nothing was found', async () => {
        fetch.mockResponseOnce(JSON.stringify({
            totalHits: 0,
            hits: []
        }));

        const data = await getInfoFromPixabay('Longbottom');

        expect(data).toEqual({resultCount: 0});
    });

    it('should return empty result if an error has occurred', async () => {
        // fetch throws an error
        fetch.mockRejectOnce(new Error('Prohibited destination'));

        const data = await getInfoFromPixabay('Barrow Downs');

        expect(data).toEqual({error: new Error('Prohibited destination')});
    });
});