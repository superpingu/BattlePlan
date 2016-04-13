var name = require("/var/apps/rpc/config.json").name;
var socket = require("socket.io-client")("http://abonetti.fr:3004/"+name);
var fs = require("fs");

var pathsDir = "/var/paths/";

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
function saveFile(name, content) {
    fs.writeFile(name, content, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log(name+" saved !");
    });
}
function dumpPoints(points) {
    var str ='';
    for (var i = 0; i < points.length; i++) {
        str += ' ' + points[i].x + ' ' + points[i].y;
    }
    return str;
}
function mirrorPoints(points) {
    var tab ='';
    for (var i = 0; i < points.length; i++) {
        tab.push({x: 3000-points[i].x, y:points[i].y});
    }
    return tab;
}
function savePath(name, path) {
    var prefix = path.cruiseSpeed + ' ' + path.endSpeed;
    console.log("Saving path "+ name);
    for (var i = 0; i < 5; i++) {
        saveFile(pathsDir+name+'-green-'+i+'.path', prefix+dumpPoints(path.green[i].points));
        saveFile(pathsDir+name+'-purple-'+i+'.path', prefix+dumpPoints(mirrorPoints(path.purple[i].points)));
    }
}
