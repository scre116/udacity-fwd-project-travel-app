import fs from 'fs';
import {addTrip, loadTrips} from '../../src/server/tripsDB';

jest.mock('fs');

describe('trips-db', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('loadTrips', () => {
        it('should return an empty array if the file does not exist', () => {
            fs.existsSync.mockReturnValue(false);
            const trips = loadTrips();
            expect(trips).toEqual([]);
        });

        it('should return the parsed JSON content if the file exists', () => {
            fs.existsSync.mockReturnValue(true);
            fs.readFileSync.mockReturnValue(JSON.stringify([{id: 1, destination: 'Paris'}]));

            const trips = loadTrips();
            expect(trips).toEqual([{id: 1, destination: 'Paris'}]);
        });
    });

    describe('addTrip', () => {
        it('should add the trip to the saved trips', () => {
            const oldTrips = [{id: 1, destination: 'Paris'}];
            fs.existsSync.mockReturnValue(true);
            fs.readFileSync.mockReturnValue(JSON.stringify(oldTrips));

            const newTrip = {id: 2, destination: 'London'};
            addTrip(newTrip);

            expect(fs.writeFileSync).toHaveBeenCalledWith('trips-db.json',
                '[{"id":1,"destination":"Paris"},{"id":2,"destination":"London"}]', 'utf8');
        });

        it('should add the trip to an empty list of trips', () => {
            fs.existsSync.mockReturnValue(false);

            const newTrip = {id: 2, destination: 'London'};
            addTrip(newTrip);

            expect(fs.writeFileSync).toHaveBeenCalledWith('trips-db.json',
                '[{"id":2,"destination":"London"}]', 'utf8');
        });
    });
});
