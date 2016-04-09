var name = require("/var/apps/rpc/config.json").name;
var socket = require("socket.io-client")("http://abonetti.fr:3003/"+name);
var fs = require("fs");


socket.on('connect', function(){
    console.log("Connected to the server");

});

socket.on('disconnect', function(){
    console.log("Disconnected from the server");
});

socket.on('paths', function(data) {
    for (var path in data) {
        if (data.hasOwnProperty(path)) {
            savePath(path, data[path]);
        }
    }
});

function savePath(name, path) {
    console.log("Saving path "+ name);
    // TODO : save the paths in several files (according to seashells config and team)
}
