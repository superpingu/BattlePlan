window.globals = {updatePath: updatePath, onPathSelect: onPathSelect};

// connections to the robots
var smallConnected = false, bigConnected = false;
var socket = io.connect("http://abonetti.fr:3004/client");
socket.on('pathUpdate', function(data) {
    paths = data;
    processUpdateFromServer();
});
socket.on('smallConnected', function() {
    smallConnected = true;
    $('.smallpi').removeClass('disabled');
});
socket.on('bigConnected', function() {
    bigConnected = true;
    $('.bigpi').removeClass('disabled');
});
socket.on('smallDisconnected', function() {
    smallConnected = false;
    $('.smallpi').addClass('disabled');
});
socket.on('bigDisconnected', function() {
    bigConnected = false;
    $('.bigpi').addClass('disabled');
});

// change the icon of the robot download buttons
function setRobotIcon(icon, ok) {
    if(ok) {
        $(icon).removeClass("fa-download").addClass("fa-check");
    } else {
        $(icon).removeClass("fa-check").addClass("fa-download");
    }
}

$(function () {
    // on download to robot, send data and change icon if robot is connected
    $(".smallpi").click(function() {
        if(smallConnected) {
            setRobotIcon(".smallicon", true);
            socket.emit("smallUpdate", paths.small);
        }
    });
    $(".bigpi").click(function() {
        if(bigConnected) {
            setRobotIcon(".bigicon", true);
            socket.emit("bigUpdate", paths.big);
        }
    });
});
