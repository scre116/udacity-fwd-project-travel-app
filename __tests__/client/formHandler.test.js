import {handleSubmitAddTrip} from '../../src/client/js/formHandler.js';
import * as tripsLoader from '../../src/client/js/tripsLoader.js';
import {JSDOM} from "jsdom";

global.fetch = jest.fn();

function setupDOM() {
    // Read the contents of the index.html file
    const htmlContent = `
      <input id="input-destination" />
      <input id="input-departure-date" />
      <div id="add-trip-status-line"></div>
      <div id="show-trips-status-line"></div>
      `;

    const dom = new JSDOM(htmlContent);

    global.document = dom.window.document;
}

tripsLoader.refreshTrips = jest.fn();

describe('handleSubmitAddTrip', () => {

    beforeEach(() => {
        setupDOM();
        fetch.mockClear();
        tripsLoader.refreshTrips.mockClear();
    });

    it('should submit the trip and refresh trips on success', async () => {

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
        });

        // Set up test data
        document.getElementById('input-destination').value = 'London';
        document.getElementById('input-departure-date').value = '2023-06-01';

        const event = {preventDefault: jest.fn()};
        await handleSubmitAddTrip(event);

        expect(event.preventDefault).toHaveBeenCalled();
        // Expect fetch to be called with the right parameters
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/trip', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                destination: 'London',
                departureDate: '2023-06-01',
            }),
        });

        // Expect the form to be reset
        expect(document.getElementById('input-destination').value).toBe('');
        expect(document.getElementById('input-departure-date').value).toBe('');
        expect(document.getElementById('add-trip-status-line').innerHTML).toBe('Trip added successfully');

        expect(tripsLoader.refreshTrips).toHaveBeenCalled();
    });

    it('should show an error message on failure', async () => {

        fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
        });

        // Set up test data
        document.getElementById('input-destination').value = 'London';
        document.getElementById('input-departure-date').value = '2023-06-01';

        const event = {preventDefault: jest.fn()};
        await handleSubmitAddTrip(event);

        // Expect the form not to be reset
        expect(document.getElementById('input-destination').value).toBe('London');
        expect(document.getElementById('input-departure-date').value).toBe('2023-06-01');
        expect(document.getElementById('add-trip-status-line').innerHTML).toBe('Webservice call resulted in an error: "Server responded with status 500"');

        expect(tripsLoader.refreshTrips).not.toHaveBeenCalled();
    });
});


