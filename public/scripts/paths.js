var selectedPath = "";
var paths = {};
var ignore = false;

// utilities
function mm2width(value) { return value*view.size.width/3000; }
function mm2height(value) { return value*view.size.height/2000; }
function width2mm(value) { return value*3000/view.size.width; }
function height2mm(value) { return value*2000/view.size.height; }
function vec2angle(vec) {
    var rad = Math.atan2(vec.x, vec.y);
    return (rad*180/Math.PI + 180) % 360;
}

function RobotPath(name, pointsToAdd) {
    var path = new Path();
    var points = [];
    var skirts = [];
    var robots = [];
    var robotWheels = 0;
    var isBigRobot = true;
    var selected = false;
    var visible = true;
    path.strokeWidth = 2;
    path.strokeColor = "black";
    function select() {
        if(typeof paths[selectedPath] !== "undefined" && paths[selectedPath] !== null)
            paths[selectedPath].deselect();
        selected = true;
        selectedPath = name;
        path.strokeColor = "rgb(10, 43, 66)";
        updateVisibility();
    }
    function deselect() {
        path.strokeColor = "black";
        selected = false;
        selectedPath = "";
        updateVisibility();
    }
    function updateVisibility() {
        path.visible = visible;
        for (var i = 0; i < points.length; i++) {
            points[i].visible = visible&&selected;
            skirts[i].visible = visible&&selected;
            robots[i].visible = visible&&selected;
        }
    }
    function getPointIndex(x, y) {
        for (var i = 0; i < points.length; i++)
            if(Math.abs(points[i].position.x-x) < 0.01 && Math.abs(points[i].position.y-y) < 0.01)
                return i;
        return -1;
    }

    function addPoint(x, y, angle, strategy, nearestPoint) {
        var skirt = new Path.Circle(new Point(x, y), mm2width(60));
        var point = new Path.Circle(new Point(x, y), mm2width(10));
        var robot = createRobot(isBigRobot);
        robot.position = new Point(x, y-robotWheels);
        robot.pivot = new Point(x,y);
        robot.rotate(-angle);

        point.angle = angle;
        point.strategy = strategy;
        point.fillColor = "black";
        point.strokeColor = "black";
        skirt.fillColor = "black";
        skirt.opacity = 0;

        point.onMouseEnter = function (event) {
            document.body.style.cursor = "crosshair";
            this.fillColor = selected ? "red" : "black";
        };
        point.onMouseLeave = function (event) {
            document.body.style.cursor = "default";
            this.fillColor = "black";
        };
        skirt.onMouseDown = function() {
            ignore = true;
        };
        skirt.onMouseDrag = function (event) {
            var index = getPointIndex(x, y);
            if(index > -1) {
                var angle = Math.round(vec2angle(event.point-new Point(x,y)));
                robot.rotate(points[index].angle-angle);
                points[index].angle = angle;
                globals.updatePath(name);
            }
        };

        point.onMouseDrag = function (event) {
            if(selected) {
                var index = getPointIndex(x, y);
                if(index > -1) {
                    point.position = event.point;
                    skirt.position = event.point;
                    path.segments[index].point = event.point;
                    x = event.point.x;
                    y = event.point.y;
                    robot.position = new Point(x, y-robotWheels);
                    robot.pivot = new Point(x,y);
                    globals.updatePath(name);
                }
            }
            event.stop();
        };
        point.onMouseDown = function (event) {
            if(Key.isDown('x') && selected) {
                removePoint(x, y);
                globals.updatePath(name);
            }
            ignore = true;
        };

        if(typeof nearestPoint === "undefined") {
            path.add(new Point(x, y));
            points.push(point);
            skirts.push(skirt);
            robots.push(robot);
        } else {
            var index = path.getNearestLocation(nearestPoint).index+1;
            path.insert(index, new Point(x, y));
            points.splice(index, 0, point);
            skirts.splice(index, 0, skirt);
            robots.splice(index, 0, robot);
        }
        updateVisibility();
    }
    function removePoint(x, y) {
        var index = (typeof y === "undefined") ? x : getPointIndex(x, y);
        if(index > -1) {
            points[index].remove();
            skirts[index].remove();
            robots[index].remove();
            path.removeSegment(index);
            points.splice(index, 1);
            skirts.splice(index, 1);
            robots.splice(index, 1);
        }
    }
    function clear() {
        path.remove();
        while(points.length > 0)
            removePoint(points.length-1);
        path = new Path();
        path.strokeWidth = 2;
        path.strokeColor = "black";
    }
    function getPoints() {
        function convertPoint(point) {
            return {
                y: Math.round(2000 - height2mm(point.position.y)),
                x: Math.round(width2mm(point.position.x)),
                angle: point.angle,
                strategy: point.strategy
            };
        }
        var result = [];
        for(var i in points)
            result.push(convertPoint(points[i]));
        return result;
    }
    function createRobot(big) {
        var bot, size, segments;
        if(big) {
            size = new Size(mm2width(308), mm2height(293));
            segments = [
                new Point(0, 0), new Point(mm2width(290), 0), new Point(mm2width(290), mm2height(270)),
                new Point(mm2width(160), mm2height(270)), new Point(mm2width(145), mm2height(240)),
                new Point(mm2width(130), mm2height(270)), new Point(mm2width(0), mm2height(270)),
                new Point(mm2width(0), mm2height(0))
            ];
            robotWheels = 0; //-0.5*size.height;
        } else {
            size = new Size(mm2width(208), mm2height(153));
            segments = [
                new Point(mm2width(24), mm2height(0)), new Point(mm2width(71), mm2height(0)), new Point(mm2width(71), mm2height(20)),
                new Point(mm2width(137), mm2height(20)), new Point(mm2width(137), mm2height(0)), new Point(mm2width(184), mm2height(0)),
                new Point(mm2width(208), mm2height(78)), new Point(mm2width(208), mm2height(153)), new Point(mm2width(0), mm2height(153)),
                new Point(mm2width(0), mm2height(78))
            ];
            robotWheels = 0.253*size.height;
        }
        function makeRobotPath() {
            bot = new Path(segments);
            bot.visible = false;
            bot.strokeWidth = 1;
            bot.strokeColor = "black";
            bot.closed = true;

            return bot;
        }
        return makeRobotPath();
    }
    function setPoints(pointsToSet) {
        clear();
        for(var i in pointsToSet)
            addPoint(mm2width(pointsToSet[i].x), mm2height(2000-pointsToSet[i].y), pointsToSet[i].angle, pointsToSet[i].strategy);
    }
    function remove() {
        clear();
        path.remove();
        delete paths[name];
    }
    setPoints(pointsToAdd);

    return {
        name : function (newName) {
            name = newName || name;
            return name;
        },
        setInitAngle : function(angle) {},
        getInitAngle : function() { return 0; },
        addPoint: addPoint,
        removePoint: removePoint,
        setPoints: setPoints,
        getPoints: getPoints,
        select : select,
        deselect : deselect,
        selected: function () { return selected; },
        distance: function(point) {
            if(points.length > 1)
                return width2mm(Math.abs((path.getNearestLocation(point).point - point).length));
            else
                return 4000;
        },
        setRobot: function (big) { isBigRobot = big=='big'; },
        remove: remove,
        visible: function (vis) {
            visible = vis;
            updateVisibility();
        },
        isVisible: function() { return visible; }
    };
}

function setPath(name,pointsToAdd) {
    if(paths.hasOwnProperty(name)) {
        paths[name].setPoints(pointsToAdd);
    } else {
        paths[name] = RobotPath(name, pointsToAdd);
    }
}
function selectPath(robot, name) {
    var team = selectedPath === "" ? "green" : selectedPath.split('.')[2];
    if(paths.hasOwnProperty(robot+'.'+name+'.'+team))
        paths[robot+'.'+name+'.'+team].select();
    else
        console.error('path '+robot+'.'+name+'.'+team+' not found');
}
function onMouseDown(event) {
    // event has already been processed
    if(ignore || Key.isDown('x')) {
        ignore = false;
        return;
    }
    // select a deselected path if user clicks on it
    for (var path in paths) {
        if(paths.hasOwnProperty(path) && path !== selectedPath && paths[path].distance(event.point) < 10 && paths[path].isVisible()) {
            paths[path].select();
            globals.onPathSelect(path);
            return;
        }
    }
    // if a path is selected
    if(selectedPath !== "") {
        var option = event.modifiers.option || event.modifiers.alt || Key.isDown('a');
        // alt + click on path => split a segment
        if(option && paths[selectedPath].distance(event.point))
            paths[selectedPath].addPoint(event.point.x, event.point.y, 0, "MOVE_TURN", event.point);
        else
            paths[selectedPath].addPoint(event.point.x, event.point.y, 0, "MOVE_TURN");
        globals.updatePath(selectedPath);
    }
}

globals.setPath = setPath;
globals.getPaths = function () { return paths; };
globals.selectPath = selectPath;

var simRobot = null;
globals.drawRobot = function(x, y, heading) {
    if(simRobot != null)
        simRobot.remove();
    var segments = [
        new Point(0, 0), new Point(mm2width(290), 0), new Point(mm2width(290), mm2height(270)),
        new Point(mm2width(160), mm2height(270)), new Point(mm2width(145), mm2height(240)),
        new Point(mm2width(130), mm2height(270)), new Point(mm2width(0), mm2height(270)),
        new Point(mm2width(0), mm2height(0))
    ];
    simRobot = new Path(segments);
    simRobot.visible = true;
    simRobot.strokeWidth = 1;
    simRobot.fillColor = "black";
    simRobot.closed = true;
    simRobot.position = new Point(mm2width(x), mm2height(2000-y));
    simRobot.pivot = new Point(mm2width(x), mm2height(2000-y));
    simRobot.rotate(-heading);
    _needsUpdate = true;
    view.update();
};
globals.removeRobot = function() {
    simRobot.remove();
    _needsUpdate = true;
    view.update();
};
