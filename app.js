var app = require('http').createServer();
var jsonfile = require('jsonfile');
var path = require('path');
var io = require('socket.io')(app);
app.listen(3004);

// load paths from file
var paths = jsonfile.readFileSync(path.join(__dirname,"paths.json"));
// save paths each time it's modified
function savePaths() {
    jsonfile.writeFile(path.join(__dirname,"paths.json"), paths, function(err) {
        if(err)
            console.log("Error saving paths : " + err);
    });
}

// connection to robots
var smallRobot, bigRobot;
io.of('/bigpi').on('connection', function (socket) {
    bigRobot = socket;
    bigRobot.emit('paths', paths.big);
    io.of('/client').emit('bigConnected');
    socket.on('disconnect', function() {
        io.of('/client').emit('bigDisconnected');
        bigRobot = null;
        console.log("big robot disconnected");
    });
    console.log("big robot connected");
});
io.of('/smallpi').on('connection', function (socket) {
    smallRobot = socket;
    smallRobot.emit('paths', paths.small);
    io.of('/client').emit('smallConnected');
    socket.on('disconnect', function() {
        io.of('/client').emit('smallDisconnected');
        smallRobot = null;
        console.log("small robot disconnected");
    });
    console.log("small robot connected");
});
// connection to clients
io.of('/client').on('connection', function (socket) {
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
    socket.on('smallUpdate', function(data) {
        if(typeof smallRobot !== "undefined")
            smallRobot.emit('paths', data);
    });
    socket.on('bigUpdate', function(data) {
        if(typeof bigRobot !== "undefined")
            bigRobot.emit('paths', data);
    });
    console.log("New client connected");
});
