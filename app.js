var express = require('express');
var config = require('./config');
var consign = require('consign');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var bluebird = require('bluebird');
var mongoose = require('mongoose');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(validator());
mongoose.Promise = bluebird;
mongoose.connect(config.mongoDb.url);

consign()
  .include('util')
  .then('models')  
  .then('controllers')
  .then('routes')
  .into(app);

app.listen(config.server.port, function() {
    console.log('running on Port:' + config.server.port);
});

module.exports = app;