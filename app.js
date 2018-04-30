var jsonfile = require('jsonfile');
var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var config = require('./config.json');

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
	for(var p in paths.big) {
		if (paths.big.hasOwnProperty(p)) {
			jsonfile.writeFile(path.join(config.bigpath, p + ".json"), paths.big[p], function(error) {
				if(error)
					console.log("Error saving path : " + error);
			});
		}
	}
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
    console.log("New client connected");
});
