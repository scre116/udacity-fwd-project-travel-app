import {updateTripsUI} from './tripsUIHandler.js'

async function handleSubmitAddTrip(event) {
    event.preventDefault()
    showTextInAddTripStatusLine(null)

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
        return;
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
    resetLoadTripStatusLine();
    try {
        const response = await fetch('http://localhost:8080/trips');

        const data = await response.json();

        if (data.error) {
            throw data.error;
        }
        return data;
    } catch (error) {
        console.error('Error:', error);
        showLoadTripError("Webservice call resulted in an error: " + JSON.stringify(error.message));
        return [];
    }

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
    showTextInAddTripStatusLine(textToShow, false);
}

function showAddTripError(textToShow) {
    showTextInAddTripStatusLine(textToShow, true);
}

function showTextInAddTripStatusLine(textToShow, isError) {
    let statusLine = document.querySelector('#add-trip-status-line');
    statusLine.innerHTML = textToShow;
    if (isError) {
        statusLine.className = 'error';
    } else {
        statusLine.className = 'success';
    }
}

function showLoadTripError(textToShow) {
    let statusLine = document.querySelector('#show-trips-status-line');
    statusLine.innerHTML = textToShow;
    statusLine.className = 'error';
}

function resetLoadTripStatusLine() {
    let statusLine = document.querySelector('#show-trips-status-line');
    statusLine.innerHTML = '';
    statusLine.className = '';
}

export {handleSubmitAddTrip, validateForm, refreshTrips}
