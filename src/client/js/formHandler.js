import {updateTripsUI} from './tripsUIHandler'

function handleSubmit(event) {
    event.preventDefault()

    const destination = document.getElementById('input-destination').value
    const departureDate = document.getElementById('input-departing-date').value

    console.log(`::: Form Submitted with destination ${destination} and departure date ${departureDate} :::`)


    // send request to server


    // load data from server
    refreshTrips();

    // return fetch('http://localhost:8080/analyze?text=' + formText)
    //     .then(res => res.json())
    //     .then(function (res) {
    //         console.log(res);
    //         if (res.error) {
    //             console.error("ERROR: ", res.error);
    //             showError(res.error);
    //         } else {
    //             showResult(res);
    //         }
    //     })
}

function refreshTrips() {
    const trips = loadTrips();
    updateTripsUI(trips);
}

function loadTrips() {
    // fake trips
    const savedTrips = [
        {
            destination: 'New York',
            departureDate: new Date('2023-06-01'),
            imgDestination: 'https://cdn.pixabay.com/photo/2013/04/11/19/46/building-102840_960_720.jpg',
            weather: {
                tempHigh: 20,
                tempLow: 10,
                humidity: 80,
                chanceOfRain: 20
            }
        },
        {
            destination: 'London',
            departureDate: new Date('2023-05-01'),
            imgDestination: 'https://cdn.pixabay.com/photo/2013/04/11/19/46/building-102840_960_720.jpg',
            weather: {
                tempHigh: 10,
                tempLow: 3,
                humidity: 90,
                chanceOfRain: 100
            }
        },
        {
            destination: 'Paris',
            departureDate: new Date('2021-07-01'),
            imgDestination: 'https://cdn.pixabay.com/photo/2013/04/11/19/46/building-102840_960_720.jpg',
            weather: {
                tempHigh: 30,
                tempLow: 20,
                humidity: 50,
                chanceOfRain: 0
            }
        }
    ];

    return savedTrips;
}


function showError(error) {
    let textToShow = "Webservice call resulted in an error: " + JSON.stringify(error);
    showTextInStatusLine(textToShow);
}

function validateForm() {
    const textarea = document.getElementById('text');

    if (textarea.value.trim() === '') {
        showTextInStatusLine('Please enter some text to analyze');
        return false;
    } else {
        return true;
    }
}

function showTextInStatusLine(textToShow) {
    let statusLine = document.getElementById('status-line');
    statusLine.innerHTML = textToShow;
    statusLine.style.visibility = 'visible';

    document.getElementById('results-table').style.visibility = 'hidden';
}

window.addEventListener('DOMContentLoaded', refreshTrips)


export {handleSubmit, validateForm}
