import {addTrip, loadTrips} from './tripsDB.js';
import {getInfoFromGeonames} from './geonamesConnector.js';
import {getInfoFromWeatherbit} from './weatherbitConnector.js';
import {getInfoFromPixabay} from './pixabayConnector.js';
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
        warnings.push(`No results found for destination "${destination}" through Geonames API`);
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

    // *** Call Pixabay API ***
    let imgUrl = 'https://pixabay.com/get/g36febc1a57d6e60176f1eb69abe9eff3f2264cc91c32fd36a072a1fc813270901c99a082880ca1559f4d9852446a06ed_640.jpg';
    console.log(`Calling pixabay API with search term ${destination}`);
    const pixabayInfo = await getInfoFromPixabay(destination);
    console.log('Received pixabay info: ', pixabayInfo);
    if (pixabayInfo.error) {
        warnings.push(`Error while calling Pixabay API: ${pixabayInfo.error}`);
    } else if (pixabayInfo.resultCount === 0) {
        warnings.push(`No pictures found for destination ${destination}`);
    } else {
        imgUrl = pixabayInfo.imgUrl;
    }

    // *** Save trip in database ***
    const tripToSave = {
        destination: destination,
        departureDate: departureDate,
        imgDestination: imgUrl,
        weather: weather,
    };

    try {
        addTrip(tripToSave);
    } catch (error) {
        console.log('Error while saving trip in database: ', error);
        res.status(500).send({
            message: 'Error while saving trip in database: ' + error.message,
            warnings: warnings
        });
        return;
    }

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




