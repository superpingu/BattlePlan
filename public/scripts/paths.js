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
    return 180-rad*180/Math.PI;
}

function RobotPath(name, pointsToAdd, initAngle) {
    var path = new Path();
    var points = [];
    var skirts = [];
    var robotWheels = 0;
    var robotAngle = 0;
    var isBigRobot = false;
    var robot = null;
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
        }
        if(robot !== null && (!visible || !selected))
            robot.visible = false;
    }
    function getPointIndex(x, y) {
        for (var i = 0; i < points.length; i++)
            if(Math.abs(points[i].position.x-x) < 0.01 && Math.abs(points[i].position.y-y) < 0.01)
                return i;
        return -1;
    }
    function addPoint(x, y, nearestPoint) {
        var skirt = new Path.Circle(new Point(x, y), mm2width(60));
        var point = new Path.Circle(new Point(x, y), mm2width(10));
        point.fillColor = "black";
        point.strokeColor = "black";
        skirt.fillColor = "black";
        skirt.opacity = 0;

        point.onMouseEnter = function (event) {
            robot.visible = true;
            document.body.style.cursor = "crosshair";
            this.fillColor = selected ? "red" : "black";
        };
        point.onMouseLeave = function (event) {
            document.body.style.cursor = "default";
            this.fillColor = "black";
        };
        skirt.onMouseEnter = function (event) {
            createRobot(isBigRobot);
            robot.position = new Point(x, y-robotWheels);
            robot.pivot = new Point(x,y);
            robot.visible = true;
        };
        skirt.onMouseMove = function (event) {
            var angle = vec2angle(event.point-new Point(x,y));
            robot.rotate(angle-robotAngle);
            robotAngle = angle;
        };
        skirt.onMouseLeave = function (event) {
            robot.visible = false;
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
                    skirt.onMouseEnter();
                    globals.updatePath(name);
                }
            }
            event.stop();
        };
        point.onMouseDown = function (event) {
            if(Key.isDown('x') && selected) {
                if(robot !== null)
                    robot.visible = false;
                removePoint(x, y);
                globals.updatePath(name);
            }
            ignore = true;
        };

        skirt.onMouseEnter();
        if(typeof nearestPoint === "undefined") {
            path.add(new Point(x, y));
            points.push(point);
            skirts.push(skirt);

        } else{
            var index = path.getNearestLocation(nearestPoint).index+1;
            path.insert(index, new Point(x, y));
            points.splice(index, 0, point);
            skirts.splice(index, 0, skirt);
        }
        updateVisibility();
    }
    function removePoint(x, y) {
        var index = (typeof y === "undefined") ? x : getPointIndex(x, y);
        if(index > -1) {
            points[index].remove();
            skirts[index].remove();
            path.removeSegment(index);
            points.splice(index, 1);
            skirts.splice(index, 1);
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
                x: Math.round(3000 - width2mm(point.position.x))
            };
        }
        var result = [];
        for(var i in points)
            result.push(convertPoint(points[i]));
        return result;
    }
    function createRobot(big) {
        var bot, size;
        if(robot !== null)
            robot.remove();
        if(big) {
            size = new Size(mm2width(290), mm2height(270));
            robotWheels = 0;
        } else {
            size = new Size(mm2width(208), mm2height(153));
            robotWheels = 0.253*size.height;
        }
        bot = new Path.Rectangle(new Point(0,0), size);

        bot.visible = false;
        bot.strokeWidth = 1;
        bot.strokeColor = "black";
        robotAngle = 0;
        robot = bot;
        updateVisibility();
    }
    function setPoints(pointsToSet) {
        clear();
        for(var i in pointsToSet)
            addPoint(mm2width(3000-pointsToSet[i].x), mm2height(2000-pointsToSet[i].y));
    }
    function remove() {
        clear();
        robot.remove();
        path.remove();
        delete paths[name];
    }
    setPoints(pointsToAdd);

    return {
        name : function (newName) {
            name = newName || name;
            return name;
        },
        setInitAngle : function(angle) { initAngle = angle; },
        getInitAngle : function() { return initAngle; },
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
        setRobot: function (big) { isBigRobot = big=='big'; createRobot(); },
        remove: remove,
        visible: function (vis) {
            visible = vis;
            updateVisibility();
        }
    };
}

function setPath(name,pointsToAdd, initAngle) {
    if(paths.hasOwnProperty(name)) {
        paths[name].setPoints(pointsToAdd);
        paths[name].setInitAngle(initAngle);
    } else {
        paths[name] = RobotPath(name, pointsToAdd, initAngle);
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
        if(paths.hasOwnProperty(path) && path !== selectedPath && paths[path].distance(event.point) < 10) {
            paths[path].select();
            globals.onPathSelect(path);
            return;
        }
    }
    // if a path is selected
    if(selectedPath !== "") {
        var option = event.modifiers.option || event.modifiers.alt;
        // alt + click on path => split a segment
        if(option && paths[selectedPath].distance(event.point) < 10)
            paths[selectedPath].addPoint(event.point.x, event.point.y, event.point);
        else
            paths[selectedPath].addPoint(event.point.x, event.point.y);
        globals.updatePath(selectedPath);
    }
}

globals.setPath = setPath;
globals.getPaths = function () { return paths; };
globals.selectPath = selectPath;
