import {addTrip, loadTrips} from './tripsDB.js';
import {getInfoFromGeonames} from './geonamesConnector.js';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';


const app = express();
app.use(express.static('dist'));
app.use(cors());

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile('dist/index.html');
})

app.post('/trip', async function (req, res) {
    const errors = [];
    console.log('POST /trip received with body', req.body);
    let destination = req.body.destination;
    const departureDate = req.body.departureDate;
    console.log(`Received request to add trip with destination ${destination} and departure date ${departureDate}`);

    console.log('Calling geonames API with search term: ', destination);
    const geonamesInfo = await getInfoFromGeonames(destination);
    console.log('Received geonames info: ', geonamesInfo);
    if (geonamesInfo.resultCount === 0) {
        errors.push(`No results found for destination ${destination}`);
    } else {
        console.log(`Fount destination ${geonamesInfo.name} in country ${geonamesInfo.countryName} at lat ${geonamesInfo.lat} and lng ${geonamesInfo.lng}`);
        destination = `${geonamesInfo.name}, ${geonamesInfo.countryName}`;
    }

    const tripToSave = {
        destination: destination,
        departureDate: departureDate,
        imgDestination: 'https://cdn.pixabay.com/photo/2013/04/11/19/46/building-102840_960_720.jpg',
        weather: {
            tempHigh: 20,
            tempLow: 10,
            humidity: 80,
            chanceOfRain: 20
        }
    };

    addTrip(tripToSave);

    res.send({message: 'Trip added successfully', errors: errors});

})

app.get('/trips', function (req, res) {
    console.log('Received request to get trips');
    const trips = loadTrips();
    console.log('Sending trips: ', trips);
    res.send(trips);
})


export {app};




