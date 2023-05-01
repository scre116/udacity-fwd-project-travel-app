import {updateTripsUI} from './tripsUIHandler'

function handleSubmit(event) {
    event.preventDefault()
    showTextInStatusLine(null)

    const destination = document.getElementById('input-destination').value
    const departureDate = document.getElementById('input-departure-date').value

    console.log(`::: Form Submitted with destination ${destination} and departure date ${departureDate} :::`)

    // send request to server
    let newTrip = {destination: destination, departureDate: departureDate};
    console.log('Sending request to server with body: ', newTrip);

    fetch('http://localhost:8080/add-trip', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTrip),
    })
        .then(res => res.json())
        .then(function (res) {
            console.log(res);
            if (res.error) {
                throw res.error;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError("Webservice call resulted in an error: " + JSON.stringify(error.message));
        })
        .then(() => {
            resetForm();
        })
        .then(() => {
            showSuccess('Trip added successfully');
        })
        .then(() => refreshTrips());

}

function resetForm() {
    document.getElementById('input-destination').value = '';
    document.getElementById('input-departure-date').value = '';
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

function validateForm() {
    const textarea = document.getElementById('text');

    if (textarea.value.trim() === '') {
        showError('Please enter some text to analyze');
        return false;
    } else {
        return true;
    }
}


function showSuccess(textToShow) {
    showTextInStatusLine(textToShow, false);
}

function showError(textToShow) {
    showTextInStatusLine(textToShow, true);
}

function showTextInStatusLine(textToShow, isError) {
    let statusLine = document.getElementById('form-status-line');
    statusLine.innerHTML = textToShow;
    if (isError) {
        statusLine.className = 'error';
    } else {
        statusLine.className = 'success';
    }
}

window.addEventListener('DOMContentLoaded', refreshTrips)
document.getElementById('form-add-trip').addEventListener('submit', handleSubmit)


export {handleSubmit, validateForm}
