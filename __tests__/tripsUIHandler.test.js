import {computeDaysUntilDeparture, createTripElement} from '../src/client/js/tripsUIHandler';
import {JSDOM} from 'jsdom';
import fs from 'fs';
import path from 'path';

describe('computeDaysUntilDeparture', () => {

    beforeEach(() => {
        // Mock the new Date() call
        jest.useFakeTimers('modern');
        jest.setSystemTime(new Date('2023-01-01'));
    });

    afterEach(() => {
        // Restore the system time after each test
        jest.useRealTimers();
    });

    test('returns the correct number of days until departure', () => {
        const departureDate = new Date('2023-01-06');
        const daysUntilDeparture = computeDaysUntilDeparture(departureDate);
        expect(daysUntilDeparture).toBe(5);
    });

    test('returns a positive value when the departure date is in the far future', () => {
        const futureDate = new Date('2026-04-01');
        const daysUntilDeparture = computeDaysUntilDeparture(futureDate);
        expect(daysUntilDeparture).toBe(1186);
    });

    test('returns 0 when the departure date is now', () => {
        const now = new Date('2023-01-01');
        const daysUntilDeparture = computeDaysUntilDeparture(now);
        expect(daysUntilDeparture).toBe(0);
    });

    test('returns a negative value when the departure date is in the past', () => {
        const pastDate = new Date('2022-12-29');
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

    beforeEach(() => {
        setupDOM();

        // Mock the new Date() call
        jest.useFakeTimers('modern');
        jest.setSystemTime(new Date('2023-01-01'));
    });

    afterEach(() => {
        // Restore the system time after each test
        jest.useRealTimers();
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
        expect(daysUntilDeparture.innerHTML).toBe('(212 days away)');

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