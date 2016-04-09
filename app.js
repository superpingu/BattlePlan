var express = require('express');
var jsonfile = require('jsonfile');
var path = require('path');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

var server = app.listen(3004, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Battle Plan listening at http://%s:%s', host, port);
});

// load paths from file
var paths = jsonfile.readFileSync(path.join(__dirname,"paths.json"));

// connection to robots
var io = require('socket.io')(server);
var smallRobot, bigRobot;
io.of('/bigpi').on('connection', function (socket) {
    bigRobot = socket;
    bigRobot.emit('paths', paths.big);
    io.emit('bigConnected');
    socket.on('disconnect', function() { io.emit('bigDisconnected'); });
});
io.of('/smallpi').on('connection', function (socket) {
    smallRobot = socket;
    smallRobot.emit('paths', paths.small);
    io.emit('smallConnected');
    socket.on('disconnect', function() { io.emit('smallDisconnected'); });
});
io.of('/client').on('connection', function (socket) {
    socket.emit('pathUpdate', paths);
    socket.on('paths', function(data) {
        paths = data;
        io.emit('pathUpdate', paths); // update all the clients
        savePaths();
    });
    socket.on('smallUpdate', function(data) {
        if(typeof smallRobot !== "undefined")
            smallRobot.emit('paths', paths.small);
    });
    socket.on('bigUpdate', function(data) {
        if(typeof bigRobot !== "undefined")
            bigRobot.emit('paths', paths.big);
    });
});

function savePaths() {
    jsonfile.writeFile(path.join(__dirname,"paths.json"), paths, function(err) {
        if(err)
            console.log("Error saving paths : " + err);
    });
}
