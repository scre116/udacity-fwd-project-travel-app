import dotenv from 'dotenv';

dotenv.config();

function getInfoFromGeonames(searchTerm) {
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const url = `http://api.geonames.org/searchJSON?q=${encodedSearchTerm}&maxRows=1&fuzzy=0.8&username=${process.env.GEONAMES_USERNAME}`;

    return fetch(url)
        .then((res) => res.json())
        .then((data) => {
            console.log('Received data from geonames: ', data);
            if (data.totalResultsCount === 0) {
                return {resultCount: 0};
            }
            const {lat, lng, name, countryName} = data.geonames[0];
            const resultCount = data.totalResultsCount;
            return {resultCount, lat, lng, name, countryName};
        })
        .catch((err) => {
            console.log(err);
            return {error: err};
        });
}

export {getInfoFromGeonames};