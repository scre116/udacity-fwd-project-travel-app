
# Evaluate a news article with Natural Language Processing

## Overview

This project is a web tool that allows users to run Natural Language Processing (NLP) on given text. The tool will give the user a sentiment analysis of the text, as well as a subjectivity analysis and other information. The analysis is done using the MeaningCloud API.

## Instructions

1. Get an API key from [MeaningCloud](https://www.meaningcloud.com/developer/create-account).
2. Create a `.env` file in the root directory of the project.
3. Put the API key into the `.env` file as property `MEANINGCLOUD_API_KEY=<your_api_key_here>`.
4. Start the server by running `npm run start` in the root directory of the project.
5. Go to `http://localhost:8080/` in your browser.
6. Enter your text in the form and click 'submit'.
7. The results will be displayed below the form.

## Dependencies

- Node.js
- Express
- Webpack
- Babel
- Sass
- Jest
- Service Workers
- MeaningCloud API

