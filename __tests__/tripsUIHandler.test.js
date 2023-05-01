import {computeDaysUntilDeparture, createTripElement} from '../src/client/js/tripsUIHandler';
import {JSDOM} from 'jsdom';
import fs from 'fs';
import path from 'path';

describe('computeDaysUntilDeparture', () => {

    let dateNowSpy;

    beforeEach(() => {
        // Mock the new Date() call
        const fixedDate = new Date('2023-01-01T07:00:00Z');
        dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => fixedDate.valueOf());
    });

    afterEach(() => {
        // Restore the original Date.now() function after each test
        dateNowSpy.mockRestore();
    });

    test('returns the correct number of days until departure', () => {
        const departureDate = new Date('2023-01-06T00:00:00Z');
        const daysUntilDeparture = computeDaysUntilDeparture(departureDate);
        expect(daysUntilDeparture).toBe(5);
    });

    describe('when the departure date is today', () => {
        test('returns 0 when the departure date is now', () => {
            const now = new Date('2023-01-01T07:00:00Z');
            const daysUntilDeparture = computeDaysUntilDeparture(now);
            expect(daysUntilDeparture).toBe(0);
        });
        test('returns 0 when the departure date is one hour before now', () => {
            const oneHourBeforeNow = new Date('2023-01-01T06:00:00Z');
            const daysUntilDeparture = computeDaysUntilDeparture(oneHourBeforeNow);
            expect(daysUntilDeparture).toBe(0);
        });

        test('returns 0 when the departure date is one hour after now', () => {
            const oneHourAfterNow = new Date('2023-01-01T08:00:00Z');
            const daysUntilDeparture = computeDaysUntilDeparture(oneHourAfterNow);
            expect(daysUntilDeparture).toBe(0);
        });

        test('returns -1 when the departure date is on the previous day', () => {
            const sevenHoursBeforeNow = new Date('2022-12-31T23:30:00Z');
            const daysUntilDeparture = computeDaysUntilDeparture(sevenHoursBeforeNow);
            expect(daysUntilDeparture).toBe(-1);
        });

        test('returns 1 when the departure date is on the next day', () => {
            const seventeenHoursAfterNow = new Date('2023-01-02T00:30:00Z');
            const daysUntilDeparture = computeDaysUntilDeparture(seventeenHoursAfterNow);
            expect(daysUntilDeparture).toBe(1);
        });
    });

    test('returns a negative value when the departure date is in the past', () => {
        const pastDate = new Date('2022-12-29T00:00:00Z');
        const daysUntilDeparture = computeDaysUntilDeparture(pastDate);
        expect(daysUntilDeparture).toBe(-3);
    });
});

function setupDOM() {
    // Read the contents of the index.html file
    const htmlContent = fs.readFileSync(
        path.resolve(__dirname, '../src/client/views/index.html'),
        'utf-8'
    );

    const dom = new JSDOM(htmlContent);

    global.document = dom.window.document;
}

describe('createTripElement', () => {

    let dateNowSpy;

    beforeEach(() => {
        setupDOM();

        // Mock the new Date() call
        const fixedDate = new Date('2023-01-01T00:00:00Z');
        dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => fixedDate.valueOf());
    });

    afterEach(() => {
        // Restore the original Date.now() function after each test
        dateNowSpy.mockRestore();
    });

    test('creates a trip element with the correct information', () => {
        const trip = {
            destination: 'New York',
            departureDate: new Date(2023, 7, 1),
            imgDestination: 'https://example.com/image.jpg',
            weather: {
                tempHigh: 85,
                tempLow: 60,
                humidity: 60,
                chanceOfRain: 20,
            },
        };

        const tripElement = createTripElement(trip);

        const destination = tripElement.querySelector('.destination');
        expect(destination.innerHTML).toBe('New York');

        const departureDate = tripElement.querySelector('.departure-date');
        expect(departureDate.innerHTML).toBe('August 1, 2023');

        const daysUntilDeparture = tripElement.querySelector('.days-until-departure');
        expect(daysUntilDeparture.innerHTML).toBe('(91 days away)');

        const imgDestination = tripElement.querySelector('.img-destination');
        expect(imgDestination.src).toBe('https://example.com/image.jpg');
        expect(imgDestination.alt).toBe('New York');

        const tempHigh = tripElement.querySelector('.temp-high');
        expect(tempHigh.innerHTML).toBe('85');

        const tempLow = tripElement.querySelector('.temp-low');
        expect(tempLow.innerHTML).toBe('60');

        const humidity = tripElement.querySelector('.humidity');
        expect(humidity.innerHTML).toBe('60');

        const chanceOfRain = tripElement.querySelector('.chance-of-rain');
        expect(chanceOfRain.innerHTML).toBe('20');

    });

    // Add more tests for different scenarios, e.g., trips in the past, trips today, etc.
});