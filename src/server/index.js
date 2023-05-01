var path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(express.static('dist'));
app.use(cors());

app.get('/', function (req, res) {
    res.sendFile('dist/index.html');
})

app.post('/add-trip', function (req, res) {
    const destination = req.query.destination;
    const departureDate = req.query.departureDate;
    console.log(`::: Received request to add trip with destination ${destination} and departure date ${departureDate} :::`);
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


module.exports = app;




