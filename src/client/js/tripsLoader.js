import {updateTripsUI} from './tripsUIHandler.js'

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

export {refreshTrips}