var express = require('express');
var path = require('path');
var PathFollower = require('./pathfollower.js');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
