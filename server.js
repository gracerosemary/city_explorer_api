/* eslint-disable indent */
'use strict';

// dependencies
const express = require('express');
const cors= require('cors');

require('dotenv').config();

// declare port for server to listen on 
const PORT = process.env.PORT || 3000;

// instanciate express
const app = express();

// use cors
app.use(cors());

// routes
app.get('/location', (request, response) => {
    let city = request.query.city;
    let data = require('./data/location.json')[0];
    let location = new Location(data, city);
    response.send(location);
});

app.get('/weather', (request, response) => {
    let data = require('./data/weather.json');
    let weatherArray = [];
    data.weather.forEach(value => {
        let weather = new Weather(value);
        weatherArray.push(weather);
    });
    response.send(weatherArray);
});

// constructor
function Location(obj, query) {
    this.lat = obj.lat;
    this.lon = obj.lon;
    this.search_query = query;
    this.location = obj.display_name;
}

function Weather(obj) {
    this.description = obj.weather.description;
    this.date = obj.datetime;
}

// start server
app.listen(PORT, () => {
    console.log(`Server is lurking on ${PORT}`);
});