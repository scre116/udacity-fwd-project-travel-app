import {loadTrips, saveTrips} from './tripsDB';

var path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(express.static('dist'));
app.use(cors());
app.use(bodyParser.json());

const fs = require('fs');

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

    const trips = loadTrips();
    trips.push(tripToSave);
    console.log('Saving trips: ', trips);
    saveTrips(trips);


    res.send({message: 'Trip added successfully'});
    //
    // const meaningCloudUrl = `https://api.meaningcloud.com/sentiment-2.1?key=${process.env.MEANINGCLOUD_API_KEY}&lang=en&egp=y&txt=${text}`;
    // fetch(meaningCloudUrl)
    //     .then(response => response.json())
    //     .then(function (response) {
    //             console.log(response);
    //             res.send(extractData(response));
    //         }
    //     ).catch(function (error) {
    //     console.error(error);
    //     res.send({error: error});
    // })
})

app.get('/trips', function (req, res) {
    console.log('Received request to get trips');
    const trips = loadTrips();
    console.log('Sending trips: ', trips);
    res.send(trips);
})


module.exports = app;




