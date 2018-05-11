window.globals = {updatePath: updatePath, onPathSelect: onPathSelect};

// change the icon of the robot download buttons
function setRobotIcon(icon, ok) {
    if(ok) {
        $(icon).removeClass("fa-download").addClass("fa-check");
    } else {
        $(icon).removeClass("fa-check").addClass("fa-download");
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
	}, 200);
});
