/* eslint-disable indent */
'use strict';

// dependencies
require('dotenv').config();

const express = require('express');
const cors= require('cors');


// declare port for server to listen on 
const PORT = process.env.PORT || 3000;

// instanciate express
const app = express();

// use cors
app.use(cors());

// test route
// app.get('/testing', (request, response) => {
//     console.log('Im here.');
//     const test = {test: `this works on PORT${PORT}`}
//     response.send(test);
//   });

// routes
// app.use('*', notFoundHandler);

app.get('/location', (request, response) => {
    try {
        let city = request.query.city;
        let data = require('./data/location.json')[0];
        let location = new Location(data, city);
        console.log(location);
        response.send(location);
        // console.log(request);
    }
    catch (error) {
        console.log('ERROR', error);
        response.status(500).send('Yikes. Something went wrong.');
    }
 });

// app.get('/weather', (request, response) => {
//         let data = require('./data/weather.json');
//         data = data.data;
//         let weatherArray = [];
//         data.forEach(value => {
//             let weather = new Weather(value);
//             weatherArray.push(weather);
//         });
//         // console.log(weatherArray);
//         response.send(weatherArray);
//     }
// );

// another way to refactor weather
app.get('/weather', weatherHandler);

function weatherHandler(req, res) {
    try {
        let data = req('./data/weather.json');
        data = data.data;
        let weatherArray = [];
        data.forEach(value => {
            let weather = new Weather(value);
            weatherArray.push(weather);
        });
        res.send(weatherArray);
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

// function notFoundHandler(request, response) {
//     response.status(404).send('huh?');
// }

// start server
app.listen(PORT, () => {
    console.log(`Server is lurking on ${PORT}`);
});
