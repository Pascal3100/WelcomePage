// jshint esversion:6

const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const _ = require('lodash');
const SunCalc = require('suncalc');

const app = express();

// view engine setup
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

//
var geolocation = {};


app.get("/", function (req, res) {
  res.render("landingPage");
});

app.get("/home", function (req, res) {
  res.render("home");
});

app.post("/setGeoLocation", function (req, res) {
  geolocation = req.body;
});

app.get("/getGeoLocation", function (req, res) {
  res.send(geolocation);
});

app.get("/askSunriseSunset", function (req, res) {
    var response ={};
    // get today's sunlight times for London
    const times = SunCalc.getTimes(new Date(), geolocation.latitude, geolocation.longitude);
    // format sunrise time from the Date object
    response.sunrise = {hour: times.sunrise.getHours(),
                        minute: times.sunrise.getMinutes()};
    response.sunset = {hour: times.sunset.getHours(),
                        minute: times.sunset.getMinutes()};
    res.send(response);
});

app.listen(3000, function () {
  console.log("Server is up on port 3000");
});