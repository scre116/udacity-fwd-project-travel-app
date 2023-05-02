import fs from 'fs';
import {loadTrips, saveTrips} from '../../src/server/tripsDB';

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

    describe('saveTrips', () => {
        it('should write the JSON stringified trips to the file', () => {
            const trips = [{id: 1, destination: 'Paris'}];
            saveTrips(trips);

            expect(fs.writeFileSync).toHaveBeenCalledWith('trips-db.json', '[{"id":1,"destination":"Paris"}]', 'utf8');
        });
    });
});
