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

function updateTripsUI(savedTrips) {
    const trips = document.getElementById('trips');
    trips.innerHTML = '';

    if (savedTrips.length === 0) {
        // show message that no trips are saved
        const noTripsMessage = document.createElement('h2');
        noTripsMessage.id = 'no-trips-message';
        noTripsMessage.innerHTML = 'No trips saved yet';
        trips.appendChild(noTripsMessage);
        return;
    }

    // add new trips
    let tripsFragment = document.createDocumentFragment();
    savedTrips.forEach(trip => {
        const tripElement = createTripElement(trip);
        tripsFragment.appendChild(tripElement);
    });
    trips.appendChild(tripsFragment);
}

function createTripElement(trip) {
    const template = document.getElementById('trip-template');
    const tripElement = template.content.cloneNode(true);

    // set destination
    const destination = tripElement.querySelector('.destination');
    destination.innerHTML = trip.destination;

    // set departure date
    const departureDate = tripElement.querySelector('.departure-date');
    departureDate.innerHTML = trip.departureDate.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'});

    // set days until departure
    const daysUntilDeparture = tripElement.querySelector('.days-until-departure');
    const daysCount = computeDaysUntilDeparture(trip.departureDate);
    if (daysCount === 0) {
        daysUntilDeparture.innerHTML = '(Today)';
    } else if (daysCount > 0) {
        daysUntilDeparture.innerHTML = `(${daysCount} days away)`;
    } else {
        daysUntilDeparture.innerHTML = `(${-daysCount} days ago)`;
    }

    // set image
    const imgDestination = tripElement.querySelector('.img-destination');
    imgDestination.src = trip.imgDestination;
    imgDestination.alt = trip.destination;

    // set temperature-high
    const tempHigh = tripElement.querySelector('.temp-high');
    tempHigh.innerHTML = trip.weather.tempHigh;

    // set temperature-low
    const tempLow = tripElement.querySelector('.temp-low');
    tempLow.innerHTML = trip.weather.tempLow;

    // set humidity
    const humidity = tripElement.querySelector('.humidity');
    humidity.innerHTML = trip.weather.humidity;

    // set chance-of-rain
    const chanceOfRain = tripElement.querySelector('.chance-of-rain');
    chanceOfRain.innerHTML = trip.weather.chanceOfRain;

    return tripElement;

}

function computeDaysUntilDeparture(departureDate) {
    const today = new Date();

    const timeDifference = departureDate.getTime() - today.getTime();
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    return Math.round(daysDifference);
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


export {handleSubmit, validateForm, refreshTrips}
