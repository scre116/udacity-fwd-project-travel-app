import {refreshTrips} from '../../src/client/js/tripsLoader.js';
import {updateTripsUI} from '../../src/client/js/tripsUIHandler.js';
import {JSDOM} from "jsdom";

jest.mock('../../src/client/js/tripsUIHandler.js', () => ({
    updateTripsUI: jest.fn(),
}));

global.fetch = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();

    const dom = new JSDOM('<div id="show-trips-status-line"></div>');
    global.document = dom.window.document;
});


describe('refreshTrips', () => {
    it('should load trips and update UI on success', async () => {
        const mockTrips = [
            {destination: 'London', departureDate: '2023-06-01'},
            {destination: 'Paris', departureDate: '2023-07-01'},
        ];

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockTrips,
        });

        await refreshTrips();

        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/trips');
        expect(updateTripsUI).toHaveBeenCalledWith(mockTrips);

        const statusLine = document.querySelector('#show-trips-status-line');
        expect(statusLine.innerHTML).toBe('');
        expect(statusLine.className).toBe('');
    });

    it('should show error message on load trips failure', async () => {
        const errorMessage = 'An error occurred while loading trips';

        fetch.mockRejectedValueOnce(new Error(errorMessage));

        await refreshTrips();

        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/trips');
        expect(updateTripsUI).toHaveBeenCalled();

        const statusLine = document.querySelector('#show-trips-status-line');
        expect(statusLine.innerHTML).toBe(`Webservice call resulted in an error: "${errorMessage}"`);
        expect(statusLine.className).toBe('error');
    });

});
