# Travel Planner

## Overview

This project features a travel app that enables users to plan their trips. It provides a weather forecast for the destination on the departure date and an image of the location. The app utilizes the [Geonames](http://www.geonames.org/), [Weatherbit](https://www.weatherbit.io/), and [Pixabay](https://pixabay.com/) APIs to obtain the weather forecast and images.

If a weather forecast is unavailable, the weather normals for that day are displayed as an alternative. This is currently dependent on the free trial account for the Weatherbit API.

In the absence of an available image, a default image is displayed.

The trips are saved and loaded on the server within the 'trips-db.json' file.

## Instructions

1. Create a `.env` file in the root directory of the project.
2. Get a username for Geonames API [here](https://www.geonames.org/login). Put the username into the `.env` file as property `GEONAMES_USERNAME=<your username>`.
3. Get a Weatherbit API key [here](https://www.weatherbit.io/account/create). Put the key into the `.env` file as property `WEATHERBIT_API_KEY=<your key>`.
4. Get a Pixabay API key [here](https://pixabay.com/). Put the key into the `.env` file as property `PIXABAY_API_KEY=<your key>`.
5. Run `npm install` to install the dependencies.
6. Run `npm run build-prod` to build the project.
7. Run `npm start` to start the server.
8. Open `http://localhost:8080` in your browser.
9. Enter a destination, and the departure date. Click the "Add trip" button.
10. The app will display the weather forecast for the destination on the departure date and an image of the destination.

## Dependencies

- Node.js
- Express
- Webpack
- Babel
- Sass
- Jest
- Service Workers
- Geonames API
- Weatherbit API
- Pixabay API

## Licenses

- Geonames API: creative commons attributions license.
- Weatherbit API: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 Generic License.
- Pixabay API: Creative Commons Zero (CC0) license, Content License.

