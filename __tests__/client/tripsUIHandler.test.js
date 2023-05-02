import {computeDaysUntilDeparture, createTripElement, updateTripsUI} from '../../src/client/js/tripsUIHandler.js';
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
        path.resolve(__dirname, '../../src/client/views/index.html'),
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
            departureDate: '2023-08-01', // 'August 1, 2023'
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

    test('creates a trip element with the correct information when the departure date is now', () => {
        const trip = {
            destination: 'New York',
            departureDate: '2023-01-01', // 'January 1, 2023'
            imgDestination: 'https://example.com/image.jpg',
            weather: {
                tempHigh: 85,
                tempLow: 60,
                humidity: 60,
                chanceOfRain: 20,
            },
        };

        const tripElement = createTripElement(trip);

        const daysUntilDeparture = tripElement.querySelector('.days-until-departure');
        expect(daysUntilDeparture.innerHTML).toBe('(Today)');
    });

    test('creates a trip element with the correct information when the departure date is in the past', () => {
        const trip = {
            destination: 'New York',
            departureDate: '2022-12-29', // 'December 29, 2022
            imgDestination: 'https://example.com/image.jpg',
            weather: {
                tempHigh: 85,
                tempLow: 60,
                humidity: 60,
                chanceOfRain: 20,
            },
        };

        const tripElement = createTripElement(trip);

        const daysUntilDeparture = tripElement.querySelector('.days-until-departure');
        expect(daysUntilDeparture.innerHTML).toBe('(3 days ago)');
    });
});

describe('updateTripsUI', () => {

    beforeEach(() => {
        setupDOM();
    });


    test('updates the trips UI', () => {
        const trips = [
            {
                destination: 'New York',
                departureDate: '2023-08-01', // August 1, 2023
                imgDestination: 'https://example.com/image.jpg',
                weather: {
                    tempHigh: 85,
                    tempLow: 60,
                    humidity: 60,
                    chanceOfRain: 20,
                },
            },
            {
                destination: 'Paris',
                departureDate: '2023-09-01', // September 1, 2023 
                imgDestination: 'https://example.com/image.jpg',
                weather: {
                    tempHigh: 75,
                    tempLow: 50,
                    humidity: 50,
                    chanceOfRain: 10,
                },
            },
        ];

        updateTripsUI(trips);

        const tripElements = document.querySelectorAll('.trip');
        expect(tripElements.length).toBe(2);

        const firstTrip = tripElements[0];
        const firstTripDestination = firstTrip.querySelector('.destination');
        expect(firstTripDestination.innerHTML).toBe('New York');

        const secondTrip = tripElements[1];
        const secondTripDestination = secondTrip.querySelector('.destination');
        expect(secondTripDestination.innerHTML).toBe('Paris');
    });

    test('updates the trips UI when there are no trips', () => {
        const trips = [];

        updateTripsUI(trips);

        const tripElements = document.querySelectorAll('.trip');
        expect(tripElements.length).toBe(0);

        const noTripsMessage = document.querySelector('#no-trips-message');
        expect(noTripsMessage.innerHTML).toBe('No trips saved yet');
    });
});