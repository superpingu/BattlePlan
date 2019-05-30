var serialport = require("serialport");
var Readline = require('@serialport/parser-readline');

var port = null;
var parser = null;

function reconnect(openCallback, readCallback) {
    if(port != null && port.isOpen) {
        port.close();
    }

    serialport.list(function(err, ports) {
        if(err) { return console.log(err); }
        for (var i = 0; i < ports.length; i++) {
            console.log(ports[i]);
            if(ports[i].comName.startsWith('/dev/tty.usbmodem'))
                break;
        }
        if(i != ports.length) {
            port = new serialport(ports[i].comName, {
                baudRate: 115200,
            });
            parser = new Readline();
            port.pipe(parser);

            port.on('open', function() {
                parser.on('data', function(data) {
                    readCallback(data);
                });

                openCallback();
                //port.flush();
            });
        }
    });
}

function sendPath(path, callback, posCallback, endCallback) {
    var points = path.points;
    var speed = path.speed;
    var connected = function() {
        setTimeout(sendCmds, 1500);
    };
    var i = 0;

    var sendCmds = function() {
        if(i < points.length) {
            var strategy = points[i].strategy === "MOVE_TURN" ? 0 : (points[i].strategy === "TURN_MOVE" ? 1 : 2);
            port.write('addpoint ' + points[i].x + ' ' + points[i].y + ' ' + points[i].angle + ' ' + speed + ' ' + strategy + '\r\n');
            console.log('addpoint ' + points[i].x + ' ' + points[i].y + ' ' + points[i].angle + ' ' + speed + ' ' + strategy + '\r\n');
            i++;
            setTimeout(sendCmds, 400);
        } else {
            port.write("execpath\r\n");
            callback();
        }
        port.flush();
    };
    function onSerialRead(data) {
        var str = data + "";
        console.log(str);
        if(str.startsWith('pos ')) {
            var args = str.split(' ');
            posCallback({x: parseInt(args[1]), y: parseInt(args[2]), heading: parseInt(args[3])});
        }
        if(str.startsWith('path end')) {
            port.close();
            endCallback();
        }
    }
    reconnect(connected, onSerialRead);
}


module.exports = {
    sendPath: sendPath
};
