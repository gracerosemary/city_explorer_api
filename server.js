/* eslint-disable indent */
'use strict';

// dependencies
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');


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
    let key = PROCESS.ENV.GEOCODE_API_KEY;

    const URL = //url

    superagent.get(URL)
        .then(data => {
            console.log(data.body[0]);
            let location = new Location (city, data.body[0]);
            res.status(200).json(location);
        });
        .catch ((error) => {
            console.log('ERROR', error);
            res.status(500).send('Yikes. Something went wrong.');
        })
}


app.get('/weather', weatherHandler);
function weatherHandler(req, res) {
    try {
        let data = require('./data/weather.json');
        data = data.data;
        // let weatherArray = [];
        // data.forEach(value => {
        //     let weather = new Weather(value);
        //     weatherArray.push(weather);
        // });
        // res.send(weatherArray);
        let weather = data.map(value => {
            return new Weather(value);
        });
        res.send(weather);
    }
    catch (error){
        console.log('ERROR', error);
        res.status(500).send('Yikes. Something went wrong.');
    }
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
