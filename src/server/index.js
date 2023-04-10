var path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(express.static('dist'));
app.use(cors());

console.log(__dirname);

// designates what port the app will listen to for incoming requests
app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
})

app.get('/', function (req, res) {
    res.sendFile('dist/index.html');
})

app.get('/analyze', function (req, res) {
    const text = req.query.text;
    console.log('text: ' + text);
    
    const meaningCloudUrl = `https://api.meaningcloud.com/sentiment-2.1?key=${process.env.MEANINGCLOUD_API_KEY}&lang=en&egp=y&txt=${text}`;
    fetch(meaningCloudUrl)
        .then(response => response.json())
        .then(function (response) {
            console.log(response);
            res.send(extractData(response));
        }
    ).catch(function (error) {
        console.error(error);
        res.send({error: error});
    })
})

const scoreTagMap = {
    'P+': 'Strong Positive',
    'P': 'Positive',
    'NEU': 'Neutral',
    'N': 'Negative',
    'N+': 'Strong Negative',
    'NONE': 'Without Polarity'
}

function extractData(response) {
    if (response.status.code !== '0') {
        return {error: response.status.msg};
    }
    return {
        polarity: scoreTagMap[response.score_tag],
        subjectivity: capitalize(response.subjectivity),
        irony: capitalize(response.irony),
        agreement: capitalize(response.agreement),
        confidence: response.confidence
    }
    
    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
}




