import {refreshTrips} from "./tripsLoader.js";

async function handleSubmitAddTrip(event) {
    event.preventDefault();
    resetStatusLine();

    const searchedDestination = document.getElementById('input-destination').value;
    const departureDate = document.getElementById('input-departure-date').value;

    console.log(`::: Form Submitted with destination ${searchedDestination} and departure date ${departureDate} :::`);

    // send request to server
    let newTrip = {destination: searchedDestination, departureDate: departureDate};
    console.log('Sending request to server with body: ', newTrip);

    let responseBody;
    try {
        const response = await fetch('http://localhost:8080/trip', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTrip),
        });


        if (!response.ok) {
            console.error('Error response:', response);
            throw new Error('Server responded with status ' + response.status);
        }
        responseBody = await response.json();
        console.log('Received response from server: ', responseBody);

        if (responseBody.warnings && responseBody.warnings.length > 0) {
            console.warn('Trip added with warnings: ', responseBody.warnings);
        }
    } catch (error) {
        console.error('Error:', error);
        showAddTripError("Webservice call resulted in an error: " + JSON.stringify(error.message));
        return;
    }

    resetForm();

    if (responseBody.warnings && responseBody.warnings.length > 0) {
        showAddTripWarning('Trip added with warnings: ' + responseBody.warnings.join(', '));
    } else {
        showAddTripSuccess('Trip added successfully');
    }

    await refreshTrips();

}

function resetForm() {
    document.getElementById('input-destination').value = '';
    document.getElementById('input-departure-date').value = '';
}

function showAddTripSuccess(textToShow) {
    showTextInAddTripStatusLine(textToShow, 'success');
}


function showAddTripError(textToShow) {
    showTextInAddTripStatusLine(textToShow, 'error');
}

function showAddTripWarning(textToShow) {
    showTextInAddTripStatusLine(textToShow, 'warning');
}

function showTextInAddTripStatusLine(textToShow, type) {
    let statusLine = document.querySelector('#add-trip-status-line');
    statusLine.innerHTML = textToShow;
    statusLine.className = type;
}

function resetStatusLine() {
    showTextInAddTripStatusLine('', '');
}


export {handleSubmitAddTrip};
