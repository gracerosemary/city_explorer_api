/* eslint-disable indent */
'use strict';

// dependencies
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
const pg = require('pg');

// declare port for server to listen on
const PORT = process.env.PORT || 3000;

// instanciate express
const app = express();

// use cors
app.use(cors());

// create our postgres client
const client = new pg.Client(process.env.DATABASE_URL);

// routes
// app.use('*', notFoundHandler);

app.get('/location', locationHandler);
function locationHandler(req, res) {
    let city = req.query.city;
    let key = process.env.GEOCODE_API_KEY;
    const URL = `https://us1.locationiq.com/v1/search.php/?key=${key}&q=${city}&format=json`;

    let SQL = `SELECT * FROM location WHERE search_query LIKE ($1)`;
    let safeValues = [city];

    client.query(SQL, safeValues)
        .then(data => {
            // console.log(data);
            if (data.rowCount !== 0) {
            res.status(200).json(data.rows[0]);
            // request data from API only if it does not exist in database
            } else {
                superagent.get(URL)
                    .then(data => {
                        // console.log(data.body[0]);
                        let location = new Location (data.body[0], city);
                        res.status(200).json(location);
                        // console.log(location);
                        let sql = `INSERT INTO location (latitude, longitude, search_query, formatted_query) VALUES ($1, $2, $3, $4) RETURNING *`;
                        // create parametrized queries
                        let safeValues = [location.latitude, location.longitude, location.search_query, location.formatted_query];
                        client.query(sql, safeValues)
                            .then( results => {
                                console.log(results);
                            });
                    })
                    .catch ((error) => {
                        console.log('ERROR', error);
                        res.status(500).send('Yikes. Something went wrong.');
                    });
            }
        });
}

app.get('/movies', moviesHandler);
function moviesHandler(req, res) {
    let key = process.env.MOVIE_API_KEY;
    let city = req.query.search_query;

    const URL = `https://api.themoviedb.org/3/search/movie?api_key=${key}&language=en-US&query=${city}`;

    superagent.get(URL)
        .then(data => {
            console.log(data.body.results);
            let movies = data.body.results.map(value => {
                return new Movies(value);
            });
            res.status(200).json(movies);
        })
        .catch((error) => {
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
        .catch((error) => {
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

function Movies(obj) {
    this.title = obj.original_title;
    this.overview = obj.overview;
    this.average_votes = obj.vote_average;
    this.total_votes = obj.vote_count;
    this.image_url = `https://image.tmdb.org/t/p/w500${obj.poster_path}`;
    this.popularity = obj.popularity;
    this.released_on = obj.release_date;
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

// connect to database and start our server
client.connect()
    .then( () => {
        app.listen(PORT, () => {
            console.log(`Server is lurking on ${PORT}`);
        });
    })
    .catch(err => {
        console.log('ERROR', err);
    });
