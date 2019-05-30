var jsonfile = require('jsonfile');
var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var config = require('./config.json');
var fs = require('fs');
var serial = require('./serial.js');

server.listen(3000, function () {
  console.log('Listening on port 3000');
});

app.use(express.static('public'));

// load paths from file
var paths;

// save paths each time it's modified
function savePaths() {
    jsonfile.writeFile(path.join(__dirname,"paths.json"), paths, function(err) {
        if(err)
            console.log("Error saving paths : " + err);
    });

    var file = '#ifndef PATHS_HPP\n#define PATHS_HPP\n\n#include "motion/AbsoluteMotion.hpp"\n\n';
    for(var p in paths.big) {
        if(paths.big.hasOwnProperty(p)) {
            var points = paths.big[p].green[0].points;
            file +="static const MotionElement " + p + "PathYellow[] = {\n";
            for(var i in points) {
                file += "\t{.x = " + points[i].x + ", .y = " + points[i].y;
                file += ", .heading = " + points[i].angle + ", .speed = ";
                file += paths.big[p].cruiseSpeed*1000 + ", .strategy = " + points[i].strategy + "},\n";
            }
            file += "\tEND_PATH\n};\n";

            points = paths.big[p].orange[0].points;
            file +="static const MotionElement " + p + "PathPurple[] = {\n";
            for(var i in points) {
                file += "\t{.x = " + points[i].x + ", .y = " + points[i].y;
                file += ", .heading = " + points[i].angle + ", .speed = ";
                file += paths.big[p].cruiseSpeed*1000 + ", .strategy = " + points[i].strategy + "},\n";
            }
            file += "\tEND_PATH\n};\n";

            file += "static const MotionElement* const " + p + "Path[] = {";
            file += p + "PathYellow" + ", " +  p + "PathPurple};\n\n";
        }
    }
    file += "#endif";
    fs.writeFile(config.bigpath, file, function(err) { if(err) { return console.log(err); } });
}

try {
	paths = jsonfile.readFileSync(path.join(__dirname,"paths.json"));
} catch (e) {
	paths = {big:{}, small:{}, nameIndexbig: 1, nameIndexsmall: 1};
}

// connection to clients
io.on('connection', function (socket) {
    socket.emit('pathUpdate', paths);

    if(typeof smallRobot !== "undefined" && smallRobot !== null)
        socket.emit('smallConnected');
    if(typeof bigRobot !== "undefined" && bigRobot !== null)
        socket.emit('bigConnected');

    socket.on('paths', function(data) {
        paths = data;
        socket.broadcast.emit('pathUpdate', paths); // update all the clients but the sender
        savePaths();
    });
    socket.on('test', function(data) {
        console.log(data);
        serial.sendPath(data, function() {
            socket.emit('pathsent');
        }, function(pos) {
            socket.emit('robotpos', pos);
        }, function() {
            socket.emit('robotrm');
        });
    });
    console.log("New client connected");
});
