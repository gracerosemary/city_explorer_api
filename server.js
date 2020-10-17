/* eslint-disable indent */
'use strict';

// dependencies
require('dotenv').config();

const express = require('express');
const superagent = require('superagent');
const cors = require('cors');


// declare port for server to listen on
const PORT = process.env.PORT || 3000;

// instanciate express
const app = express();

// use cors
app.use(cors());

// routes
// app.use('*', notFoundHandler);

app.get('/location', locationHandler);
function locationHandler(req, res) {
    let city = req.query.city;
    let key = process.env.GEOCODE_API_KEY;

    const URL = `https://us1.locationiq.com/v1/search.php/?key=${key}&q=${city}&format=json`;

    superagent.get(URL)
        .then(data => {
            console.log(data.body[0]);
            let location = new Location (data.body[0], city);
            res.status(200).json(location);
        })
        .catch ((error) => {
            console.log('ERROR', error);
            res.status(500).send('Yikes. Something went wrong.');
        });
}


app.get('/weather', weatherHandler);
function weatherHandler(req, res) {
    let key = process.env.WEATHER_API_KEY;
    let lat = req.query.latitude;
    let lon = req.query.longitude;

    const URL = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${key}`;

    superagent.get(URL)
        .then(data => {
            let weather = data.body.data.map(value => {
                return new Weather(value);
            });
            res.status(200).json(weather);
        })
        .catch ((error) => {
            console.log('ERROR', error);
            res.status(500).send('Yikes. Something went wrong.');
        });
}

// constructor
function Location(obj, query) {
    this.latitude = obj.lat;
    this.longitude = obj.lon;
    this.search_query = query;
    this.formatted_query = obj.display_name;
}

function Weather(obj) {
    this.forecast = obj.weather.description;
    this.time = obj.valid_date;
}

// function notFoundHandler(req, res) {
//     res.status(404).send('huh?');
// }

// start server
app.listen(PORT, () => {
    console.log(`Server is lurking on ${PORT}`);
});
