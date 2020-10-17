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

app.get('/trails', trailHandler);
function trailHandler(req, res) {
    let key = process.env.TRAIL_API_KEY;
    let lat = req.query.latitude;
    let lon = req.query.longitude;


    const URL = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=10&key=${key}`;
    
    superagent.get(URL)
    .then(data => {
        console.log(data.body.trails);
            let trail = data.body.trails.map (value => {
                return new Trail(value);
            });
            res.status(200).json(trail);
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

function Trail(obj) {
    this.name = obj.name;
    this.location = obj.location;
    this.length = obj.length;
    this.stars = obj.stars;
    this.star_votes = obj.starVotes;
    this.summary = obj.summary;
    this.trail_url = obj.url;
    this.conditions = obj.conditionStatus;
    this.condition_date = obj.conditionDate.slice(0,10);
    this.condition_time = obj.conditionDate.slice(11,20);
}

// function notFoundHandler(req, res) {
//     res.status(404).send('huh?');
// }

// start server
app.listen(PORT, () => {
    console.log(`Server is lurking on ${PORT}`);
});
