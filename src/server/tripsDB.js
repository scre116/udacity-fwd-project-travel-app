import fs from "fs";

function loadTrips() {
    if (!fs.existsSync('trips-db.json')) {
        return [];
    }
    return JSON.parse(fs.readFileSync('trips-db.json', 'utf8'));
}

function saveTrips(trips) {
    fs.writeFileSync('trips-db.json', JSON.stringify(trips), 'utf8');
}

export {loadTrips, saveTrips};