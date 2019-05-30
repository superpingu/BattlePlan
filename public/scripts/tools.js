// contains the paths (with configs and teams)
var paths = {big: {}, small:{}, nameIndexbig:1, nameIndexsmall: 1};

var visibilities = Cookies.getJSON('visibilities') ? Cookies.getJSON('visibilities') : {big: {}, small:{}};
var serverUpdateNeeded = false; // true if new data need to be sent to the server

var tableConfig = 0;

function decomposeViewPath(name) {
    var decompose = name.split('.');
    return {
        robot: decompose[0],
        name: decompose[1],
        team: decompose[2]
    };
}
// refresh the table view to match the content of paths
function updateView() {
    function updateRobotView(robot) {
        for (var path in paths[robot]) {
            if (paths[robot].hasOwnProperty(path)) {
                window.globals.setPath(
                    robot+'.'+path+'.green',
                    paths[robot][path].green[tableConfig].points
                );
                window.globals.getPaths()[robot+'.'+path+'.green'].setRobot(robot);
                window.globals.getPaths()[robot+'.'+path+'.green'].visible(visibilities[robot][path]);
                window.globals.setPath(
                    robot+'.'+path+'.orange',
                    paths[robot][path].orange[tableConfig].points
                );
                window.globals.getPaths()[robot+'.'+path+'.orange'].setRobot(robot);
                window.globals.getPaths()[robot+'.'+path+'.orange'].visible(visibilities[robot][path]);
            }
        }
    }
    updateRobotView('small');
    updateRobotView('big');
    // delete removed paths
    for (var viewPath in window.globals.getPaths()) {
        var p = decomposeViewPath(viewPath);
        if (window.globals.getPaths().hasOwnProperty(viewPath) && !paths[p.robot].hasOwnProperty(p.name)) {
            window.globals.getPaths()[viewPath].remove();
        }
    }
    // refresh view
    paper.project._needsUpdate = true;
    paper.project.view.update();
}
function updatePath(name) {
    var p = decomposeViewPath(name);
    var opposedTeam = p.team === 'green' ? 'orange' : 'green';
    // true if a change in current config should change config i
    function isLinked(i) {
        var iLink = paths[p.robot][p.name][p.team][i].configLink;
        var currentLink = paths[p.robot][p.name][p.team][tableConfig].configLink;
        return  iLink == tableConfig || (iLink != -1 && iLink == currentLink) || i == currentLink;
    }
    function mirrorPoints(points) {
        var result = [];
        for (var i in points)
            result.push({x: 3000 - points[i].x, y: points[i].y, angle: (360-points[i].angle) % 360, strategy: points[i].strategy});
        return result;
    }
    var points = window.globals.getPaths()[name].getPoints();
    var angle = 0;
    var opposedPoints = mirrorPoints(points);

    paths[p.robot][p.name][p.team][tableConfig].points = points;
    if(paths[p.robot][p.name].teamMirror) {
        paths[p.robot][p.name][opposedTeam][tableConfig].points = opposedPoints;
        window.globals.setPath(p.robot+'.'+p.name+'.'+opposedTeam, opposedPoints);
        // refresh view
        paper.project._needsUpdate = true;
        paper.project.view.update();
    }
    for (var i = 0; i < 1; i++) {
        if(i != tableConfig && isLinked(i)) {
            paths[p.robot][p.name][p.team][i].points = points.slice(0);
            if(paths[p.robot][p.name].teamMirror) {
                paths[p.robot][p.name][opposedTeam][i].points = opposedPoints.slice(0);
            }
        }
    }
    updateSidebar();
    updateServer();
}

function onPathSelect(name) {
    var path = decomposeViewPath(name);
    activeList = path.robot;
    selectedPath[activeList] = path.name;
    selectedTeam = path.team;
    updateSidebar();
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
        serverUpdateNeeded = false;
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

function selectPath(robot, name) {
    globals.selectPath(robot, name);
    paper.project._needsUpdate = true;
    paper.project.view.update();
}
function renamePath(robot, oldname, newname) {
    if (oldname !== newname) {
        if(!paths[robot].hasOwnProperty(oldname))
            return;
        Object.defineProperty(paths[robot], newname, Object.getOwnPropertyDescriptor(paths[robot], oldname));
        delete paths[robot][oldname];
        visibilities[robot][newname] = visibilities[robot][oldname];
        delete visibilities[robot][oldname];
        paths[robot][newname].name = newname;
        updateView();
        selectPath(robot, newname);
        updateServer();
    }
}
function deletePath(robot, name) {
    delete paths[robot][name];
    delete visibilities[robot][name];
    updateView();
    updateServer();
}
function createPath(robot) {
    var name = "chemin "+paths["nameIndex"+robot];
    paths["nameIndex"+robot]++;
    paths[robot][name] = {
        name: name,
        cruiseSpeed: 0.3,
        endSpeed: 0,
        teamMirror: true,
        green: [{points:[], configLink:-1}],
        orange: [{points:[], configLink:-1}]
    };
    visibilities[robot][name] = true;
    updateView();
    updateServer();
    return name;
}

function saveVisibilities() {
    Cookies.set('visibilities', visibilities, { expires: 14 });
}
