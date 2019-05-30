window.globals = {updatePath: updatePath, onPathSelect: onPathSelect};

// change the icon of the robot download buttons
function setRobotIcon(icon, ok) {
    if(ok) {
        $(icon).removeClass("fa-play").addClass("fa-spinner").addClass("fa-spin");
    } else {
        $(icon).removeClass("fa-spinner").removeClass("fa-spin").addClass("fa-play");
    }
}

var socket;
$(function () {
    window.setTimeout(function () {
        socket = io.connect(window.location.href);

        socket.on('pathUpdate', function(data) {
            paths = data;
            processUpdateFromServer();
        });

        socket.on('pathsent', function(data) {
            setRobotIcon('.smallicon', false);
        });
        socket.on('robotpos', function(pos) {
            window.globals.drawRobot(pos.x, pos.y, pos.heading);
        });
        socket.on('robotrm', function() {
            window.globals.removeRobot();
        });
    }, 200);

    $('.testrun').click(function () {
        setRobotIcon('.smallicon', true);
        socket.emit('test', {
            speed: paths[activeList][selectedPath[activeList]].cruiseSpeed*1000,
            points: paths[activeList][selectedPath[activeList]][selectedTeam][0].points
        });
    });
});
