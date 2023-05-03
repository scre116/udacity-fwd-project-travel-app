function updateTripsUI(savedTrips) {
    console.log('Updating UI with trips: ', savedTrips);
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
    const date = new Date(trip.departureDate);
    departureDate.innerHTML = date.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'});

    // set days until departure
    const daysUntilDeparture = tripElement.querySelector('.days-until-departure');
    const daysCount = computeDaysUntilDeparture(date);
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

    setWeather(tripElement, trip);

    return tripElement;

}

function setWeather(tripElement, trip) {
    if (!trip.weather) {
        const weather = tripElement.querySelector('.weather');
        weather.innerHTML = 'Destination unknown - weather unavailable';
        return;
    }

    const forecastType = tripElement.querySelector('.forecast-type');
    if (trip.weather.forecastType === 'normals') {
        forecastType.innerHTML = 'Typical weather for this day of year';
    } else {
        forecastType.innerHTML = 'Weather forecast';
    }

    const tempHigh = tripElement.querySelector('.temp-high');
    tempHigh.innerHTML = trip.weather.tempHigh;

    const tempLow = tripElement.querySelector('.temp-low');
    tempLow.innerHTML = trip.weather.tempLow;

    const windSpeed = tripElement.querySelector('.wind-speed');
    windSpeed.innerHTML = trip.weather.windSpeed;

    const precipitation = tripElement.querySelector('.precipitation');
    precipitation.innerHTML = trip.weather.precipitation;
}

function computeDaysUntilDeparture(departureDate) {
    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const departureDateMidnight = new Date(departureDate.getFullYear(), departureDate.getMonth(), departureDate.getDate());

    const timeDifference = departureDateMidnight.getTime() - todayMidnight.getTime();
    if (timeDifference == 0) {
        return 0;
    }
    return Math.round(timeDifference / (1000 * 60 * 60 * 24));
}

export {updateTripsUI, createTripElement, computeDaysUntilDeparture}