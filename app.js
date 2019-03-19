// coding: utf-8

const express = require('express');
const request = require('request');
const nconf = require('nconf');
const apiKey = 'a39cca2ccb399fb4152574fc86109c83';

// config
nconf.argv()
.env()
.file({ file: 'config.json' });

// define listening port
var port = nconf.get('app.port') | 3001;

// declare express app
const app = express();

// set the templating engine
app.set('view engine', 'ejs')

// config api routes
// landing page
app.get('/', function(req, res){
    res.render('index');
})

// a city page, no functions
app.get('/city', function(req, res){
    res.render('index');
})

// get weather for city from openweathermap.org
app.get('/weather/city/:cityname', function(req, res) {
    let city = req.params.cityname;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    // make it so...
    request(url, function(err, response, body){
        if(err){
            res.json({'Error': err});
            console.log(err);
        } else {
            let data = JSON.parse(body);
            console.log(data);
            if(response.statusCode == 404) {
                res.json({'Error': 'Could not get weather data for ' + city});
            } else {
                res.json({'Response': data, 'Status': response.statusCode});
            }
        }
    })
})

// weather by coordinates
app.get('/weather/lat/:lat/lng/:lng', function(req, res){
    let lat = req.param.lat;
    let lng = req.params.lng;
    let url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lng=${lng}&appid=${apiKey}`;

    // call the api
    request(url, function(err, response, body){
        if(err) {
            res.json({'Error': err});
        } else {
            let data = JSON.parse(body);
            console.log(data);
            if(response.statusCode == 404) {
                res.json({'Error': 'Can not get weather data for ' + lat + '/' + lng});
            } else {
                res.json({'Response': data});
            }
        }
    })

})

// weather by zip code
app.get('/weather/:zipcode', function(req, res){
    let zipCode = req.param.zipcode;
    let url = `http://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${apiKey}`;

    // a different design pattern for request library
    request
        .get(url)
        .on('error', function(err) {
            res.json({'Error': err});
        })
        .on('response', function(response, body) {
            let data = JSON.parse(body);
            console.log(data);
            if(response.statusCode == 404) {
                res.json({'Error': 'Could not get weather data for ' + zipCode});
            } else {
                res.json({'Response': data});
            }
        })
})

// start the server
app.listen(port, function() {
    console.log('Server is listening on port: ' + port);
})


