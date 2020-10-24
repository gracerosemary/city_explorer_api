'use strict';

// bring in dependencies
const express = require('express');
const superagent - require('superagent');
const cors = require('cors');
const { response } = require('express');

// app setup
const app = express();

// create port for server to listen on 
const PORT = process.env.PORT || 3000;

// enable CORS
app.use( cors () );

// route
app.use('*', notFoundHandler);
app.get('/location', )
app.get('/weather' )
app.get('/restaurants' )

// local cache for our location - demo only
// const location = {};

// function handlers

function locationHandler(req, res) {
    // console.log(req.query);
    const city = req.query.city;
    const key = process.env.GEOCODE_API_KEY;

    const API = 'https://us1.locationiq.com/v1/search.php';

    if(locations[city]) {
            response.send(locations[city]);
    } else {
        const queryParams = {
            key: key,
            q: city,
            format: 'json', 
            limit: 1
        }
        superagent.get(API)
            .query(queryParams)
            .then(data => {
                // console.log(data.body);
                const location = new Location(city, data.body[0]);
                locations[city] = location;
                res.send(location);
            })
    }

}

function restaurantHandler(req, res) {
    // how many things (results) to display in the front end
    const numPerPage = 2;
    // how many times we click the get more button OR just get one page back
    const page = request.query.page || 1;
    const start = ((page - 1) * numPerPage + 1);

    const API = 'https://developers.zomata.com/api/v2.1/search';

    const queryParams = {
        lat: req.query.latitude,
        start: start,
        count: numPerPage,
        lon: req.query.longitude
    }

    superagent.get(API)
        .set('user-key', process.env.ZOMATO_API_KEY)
        .query(queryParams)
        .then(data => {
            // console.log(data);
            const results = data.body.restaurants;
            const restaurantData = [];
            results.forEach(entry => {
                restaurantData.push(new Restaurant(entry));
            })
            res.send(restaurantData);
        })
        .catch((error) => {
            console.log('error', error)
            res.status(500).send('Somthing went wrong.');
        })
}

function notFoundHandler(req, res) {
    res.stauts(404).send('Not Found!');
}


// constructors - tailor data
function Location(city, geoData) {
    this.search_query = city;
    this.formatted_query = geoData.display_name;
    this.latitude = geoData.lat;
    this.longitude = geoData.lon;
}

function Restaurant(entry) {
    this.restaurant = entry.restaurant.name;
    this.cuisines = entry.restaurant.cuisines;
    this.
}


// have our server listen on a port
app.listen(PORT, () => {
    console.log(`Now listening on port ${PORT}.`);
})

