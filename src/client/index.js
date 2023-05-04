import {handleSubmitAddTrip} from './js/formHandler.js';
import {refreshTrips} from './js/tripsLoader.js';

import './styles/resets.scss';
import './styles/header.scss';
import './styles/base.scss';
import './styles/footer.scss';
import './styles/add-trip.scss';
import './styles/trips.scss';

window.addEventListener('DOMContentLoaded', refreshTrips);
document.getElementById('form-add-trip').addEventListener('submit', handleSubmitAddTrip);
