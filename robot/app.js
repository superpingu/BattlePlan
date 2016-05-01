var name = require("/var/apps/rpc/config.json").name;
var socket = require("socket.io-client")("http://abonetti.fr:3004/"+name);
var fs = require("fs");
var execFile = require('child_process').execFile;

var pathsDir = "/var/paths/";

socket.on('connect', function(){
    console.log("Connected to the server");

});

socket.on('disconnect', function(){
    console.log("Disconnected from the server");
});

socket.on('paths', function(data) {
    console.log("received paths");
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
    if(points.length==1) {
        return ' ' + points[0].x + ' ' + points[0].y;
    }
    // if more than one point, ignoring first point
    for (var i = 1; i < points.length; i++) {
        str += ' ' + points[i].x + ' ' + points[i].y;
    }
    return str;
}
function mirrorPoints(points) {
    var tab = [];
    for (var i = 0; i < points.length; i++) {
        tab.push({x: 3000-points[i].x, y:points[i].y});
    }
    return tab;
}
function savePath(name, path) {
    var prefix = path.endSpeed + ' ' + path.cruiseSpeed;
    console.log("Saving path "+ name);
    for (var i = 0; i < 5; i++) {
        saveFile(pathsDir+name+'-green-'+(i+1)+'.path', prefix+dumpPoints(path.green[i].points));
        saveFile(pathsDir+name+'-purple-'+(i+1)+'.path', prefix+dumpPoints(mirrorPoints(path.purple[i].points)));
    }
}

function startMain() {
    var main = execFile('/var/apps/main_robot/actiontest');
    main.on('close', function(code, signal) {
      console.log("out : " + main.stdout);
      console.log("err : " + main.stderr);
      if(code == -23) {
        startMain();
        console.log("restart");
      }
    });
}
startMain();
