import dotenv from 'dotenv';

dotenv.config();

function getInfoFromPixabay(searchTerm) {
    const escapedSearchTerm = encodeURIComponent(searchTerm);
    const pixabayApiKey = process.env.PIXABAY_API_KEY;
    if (!pixabayApiKey) {
        return {error: new Error('Pixabay API key was not configured')};
    }

    const urlWithoutKey = `https://pixabay.com/api/?q=${escapedSearchTerm}&image_type=photo&orientation=horizontal&per_page=3&key=`;
    console.log(`Fetching data from Pixabay: ${urlWithoutKey}*****`);
    const url = `${urlWithoutKey}${pixabayApiKey}`;

    return fetch(url)
        .then((res) => res.json())
        .then((data) => {
            console.log('Received data from Pixabay: ', data);
            if (data.totalHits === 0) {
                return {resultCount: 0};
            }
            const {webformatURL} = data.hits[0];
            const resultCount = data.totalHits;
            return {resultCount, imgUrl: webformatURL};
        })
        .catch((err) => {
            console.log(err);
            return {error: err};
        });
}

export {getInfoFromPixabay};