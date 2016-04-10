// contains the paths (with configs and teams)
var paths = {big: {}, small:{}, nameIndexbig:1, nameIndexsmall: 1};

var visibilities = {big: {}, small:{}};
var serverUpdateNeeded = false; // true if new data need to be sent to the server

var tableConfig = 1;

// refresh the table view to match the content of paths
function updateView() {
    for (var path in paths) {
        if (paths.hasOwnProperty(path)) {
            // add new paths
            // update existing paths
        }
    }
    // delete removed paths

}

// send the current paths to the server
function updateServer() {
    serverUpdateNeeded = true;
    setRobotIcon(".smallicon", false);
    setRobotIcon(".bigicon", false);
}

// performs the actual send, not faster than every 500ms to avoid overloading the server
setInterval(function () {
    if(serverUpdateNeeded && typeof socket !== 'undefined') {
        socket.emit('paths', paths);
    }
}, 500);

function processUpdateFromServer() {
    function updateVisibilities(robot) {
        for(var visibility in visibilities[robot]) {
            if(visibilities[robot].hasOwnProperty(visibility) && !paths[robot].hasOwnProperty(visibility)) {
                delete visibilities[robot][visibility];
            }
        }
        for(var path in paths[robot]) {
            if(paths[robot].hasOwnProperty(path) && !visibilities[robot].hasOwnProperty(path)) {
                visibilities[robot][path] = true;
            }
        }
    }
    updateVisibilities('big');
    updateVisibilities('small');
    updateView();
    updateSidebar();
}

function renamePath(oldname, newname) {

}
function deletePath(name) {

}
function createPath(robot) {
    var name = "chemin "+paths["nameIndex"+robot];
    paths["nameIndex"+robot]++;
    var config = {points:{}, configLink:1, initAngle: 90};
    var config1 = {points:{}, configLink:1, initAngle: -90};
    paths[robot][name] = {
        name: name,
        cruiseSpeed: 0.3,
        endSpeed: 0,
        teamMirror: true,
        green: [{points:{}, configLink:0, initAngle:90}, config, config, config, config],
        purple: [{points:{}, configLink:0, initAngle:-90}, config1, config1, config1, config1]
    };
    updateView();
    updateServer();
    return name;
}
