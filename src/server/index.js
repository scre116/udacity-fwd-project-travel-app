import {addTrip, loadTrips} from './tripsDB.js';
import {getInfoFromGeonames} from './geonamesConnector.js';
import {getInfoFromWeatherbit} from './weatherbitConnector.js';
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
    const warnings = [];
    console.log('POST /trip received with body', req.body);
    let destination = req.body.destination;
    const departureDate = req.body.departureDate;
    console.log(`Received request to add trip with destination ${destination} and departure date ${departureDate}`);

    // *** Call Geonames API ***
    console.log('Calling geonames API with search term: ', destination);
    const geonamesInfo = await getInfoFromGeonames(destination);
    console.log('Received geonames info: ', geonamesInfo);
    if (geonamesInfo.error) {
        warnings.push(`Error while calling Geonames API: ${geonamesInfo.error}`);
    } else if (geonamesInfo.resultCount === 0) {
        console.warn(`No results found for destination ${destination}`);
        warnings.push(`No results found for destination ${destination}`);
    } else {
        console.log(`Fount destination ${geonamesInfo.name} in country ${geonamesInfo.countryName} at lat ${geonamesInfo.lat} and lng ${geonamesInfo.lng}`);
        destination = `${geonamesInfo.name}, ${geonamesInfo.countryName}`;
    }

    // *** Call Weatherbit API ***
    let weather = null;
    if (geonamesInfo.lat !== undefined && geonamesInfo.lng !== undefined) {
        console.log(`Calling weatherbit API with lat ${geonamesInfo.lat}, lng ${geonamesInfo.lng} and departure date ${departureDate}`);
        const weatherInfo = await getInfoFromWeatherbit(geonamesInfo.lat, geonamesInfo.lng, departureDate);
        console.log('Received weather info: ', weatherInfo);
        if (weatherInfo.error) {
            warnings.push(`Error while calling Weatherbit API: ${weatherInfo.error}`);
        } else {
            weather = weatherInfo.weather;
        }
    }

    // *** Save trip in database ***
    const tripToSave = {
        destination: destination,
        departureDate: departureDate,
        imgDestination: 'https://cdn.pixabay.com/photo/2013/04/11/19/46/building-102840_960_720.jpg',
        weather: weather,
    };

    addTrip(tripToSave);


    // *** Send response ***
    res.send({message: 'Trip added successfully', warnings: warnings});

})

app.get('/trips', function (req, res) {
    console.log('Received request to get trips');
    const trips = loadTrips();
    console.log('Sending trips: ', trips);
    res.send(trips);
})


export {app};




