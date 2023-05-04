import dotenv from 'dotenv';

dotenv.config();

function getInfoFromPixabay(searchTerm) {
    const escapedSearchTerm = encodeURIComponent(searchTerm);
    const url = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${escapedSearchTerm}&image_type=photo&orientation=horizontal&per_page=3`;

    console.log('Fetching data from Pixabay: ', url);
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