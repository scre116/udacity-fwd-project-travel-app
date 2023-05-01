import {updateTripsUI} from './tripsUIHandler'

async function handleSubmit(event) {
    event.preventDefault()
    showTextInStatusLine(null)

    const destination = document.getElementById('input-destination').value
    const departureDate = document.getElementById('input-departure-date').value

    console.log(`::: Form Submitted with destination ${destination} and departure date ${departureDate} :::`)

    // send request to server
    let newTrip = {destination: destination, departureDate: departureDate};
    console.log('Sending request to server with body: ', newTrip);

    try {
        const response = await fetch('http://localhost:8080/trip', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTrip),
        });

        const data = await response.json();

        if (data.error) {
            throw data.error;
        }
    } catch (error) {
        console.error('Error:', error);
        showAddTripError("Webservice call resulted in an error: " + JSON.stringify(error.message));
    }

    resetForm();
    showAddTripSuccess('Trip added successfully');
    await refreshTrips();

}

function resetForm() {
    document.getElementById('input-destination').value = '';
    document.getElementById('input-departure-date').value = '';
}

async function refreshTrips() {
    const trips = await loadTrips();
    updateTripsUI(trips);
}

async function loadTrips() {
// send request to server
    try {
        const response = await fetch('http://localhost:8080/trips');

        const data = await response.json();

        if (data.error) {
            throw data.error;
        }
        return data;
    } catch (error) {
        console.error('Error:', error);
        showAddTripError("Webservice call resulted in an error: " + JSON.stringify(error.message));
    }
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
        showAddTripError('Please enter some text to analyze');
        return false;
    } else {
        return true;
    }
}


function showAddTripSuccess(textToShow) {
    showTextInStatusLine(textToShow, false);
}

function showAddTripError(textToShow) {
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
