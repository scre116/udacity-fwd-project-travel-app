import {addTrip, loadTrips} from './tripsDB.js';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.static('dist'));
app.use(cors());

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile('dist/index.html');
})

app.post('/trip', function (req, res) {
    console.log(req.body);
    // extract destination from request body
    const destination = req.body.destination;
    const departureDate = req.body.departureDate;
    console.log(`::: Received request to add trip with destination ${destination} and departure date ${departureDate} :::`);

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

    res.send({message: 'Trip added successfully'});
 
})

app.get('/trips', function (req, res) {
    console.log('Received request to get trips');
    const trips = loadTrips();
    console.log('Sending trips: ', trips);
    res.send(trips);
})


export {app};




