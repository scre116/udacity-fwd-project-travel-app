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
    if (daysCount == 0) {
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
    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const departureDateMidnight = new Date(departureDate.getFullYear(), departureDate.getMonth(), departureDate.getDate());

    const timeDifference = departureDateMidnight.getTime() - todayMidnight.getTime();
    if (timeDifference == 0) {
        return 0;
    }
    return timeDifference / (1000 * 60 * 60 * 24);
}

export {updateTripsUI, createTripElement, computeDaysUntilDeparture}