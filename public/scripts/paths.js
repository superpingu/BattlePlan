var nameCounter = 0;
var selectedPath = "";
var paths = {};
var ignore = false;

function RobotPath(pointsToAdd) {
    function generateName() {
        nameCounter++;
        return "path"+nameCounter;
    }
    var name = generateName();
    var path = new Path();
    var points = [];
    var skirts = [];
    var robotWheels = 0;
    var robotAngle = 0;
    var isBigRobot = false;
    var robot = createRobot(false);
    var selected = false;
    var changeCallback = function () {};
    path.strokeWidth = 2;

    function select() {
        selected = true;
        selectedPath = name;
        path.strokeColor = "rgb(10, 43, 66)";
        for (var i = 0; i < points.length; i++) {
            points[i].visible = true;
            skirts[i].visible = true;
        }
    }
    function deselect() {
        path.strokeColor = "black";
        selected = false;
        for (var i = 0; i < points.length; i++) {
            points[i].visible = false;
            skirts[i].visible = false;
        }
        robot.visible = false;
    }

    function getPointIndex(x, y) {
        for (var i = 0; i < points.length; i++)
            if(Math.abs(points[i].position.x-x) < 0.01 && Math.abs(points[i].position.y-y) < 0.01)
                return i;
        return -1;
    }
    function vec2angle(vec) {
        var rad = Math.atan2(vec.x, vec.y);
        return 180-rad*180/Math.PI;
    }
    function addPoint(x, y, index) {
        var skirt = new Path.Circle(new Point(x, y), 20);
        var point = new Path.Circle(new Point(x, y), 3);
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
            robot = createRobot(isBigRobot);
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
                }
            }
            changeCallback();
            event.stop();
        };
        point.onMouseDown = function (event) {
            if(Key.isDown('x') && selected)
                removePoint(x, y);
            ignore = true;
        };

        skirt.onMouseEnter();
        if(typeof index === "undefined") {
            path.add(new Point(x, y));
            points.push(point);
            skirts.push(skirt);
        } else{
            path.insert(index, new Point(x, y));
            points.splice(index, 0, point);
            skirts.splice(index, 0, skirt);
        }
        changeCallback();
    }
    function removePoint(x, y) {
        var index = (typeof y == "undefined") ? x : getPointIndex(x, y);
        if(index > -1) {
            points[index].remove();
            path.removeSegment(index);
            points.splice(index, 1);
            skirts.splice(index, 1);
            changeCallback();
        }
    }
    function clear() {
        while(points.length > 0)
            removePoint(0);
    }
    function getPoints() {
        function convertPoint(point) {
            return {
                y: 2000 - Math.round(point.position.x*2000/view.size.width),
                x: Math.round(point.position.y*3000/view.size.height)
            };
        }
        var result = [];
        for(var i in points)
            result.push(convertPoint(points[i]));
        return result;
    }
    function createRobot(big) {
        var bot, size;
        if(typeof robot !== "undefined")
            robot.remove();
        if(big) {
            size = new Size(view.size.width*290/2000, view.size.height*270/3000);
            robotWheels = 0;
        } else {
            size = new Size(view.size.width*208/2000, view.size.height*153/3000);
            robotWheels = 0.253*view.size.height*153/3000;
        }
        bot = new Path.Rectangle(new Point(0,0), size);

        bot.visible = false;
        bot.strokeWidth = 1;
        bot.strokeColor = "black";
        robotAngle = 0;
        return bot;
    }

    for(var i in pointsToAdd) {
        addPoint(pointsToAdd[i].x, pointsToAdd[i].y);
    }
    select();

    return {
        name : function (newName) {
            name = newName || name;
            return name;
        },
        addPoint: addPoint,
        removePoint: removePoint,
        clear: clear,
        getPoints: getPoints,
        select: select,
        deselect: deselect,
        selected: function (isSelected) {
            if(typeof isSelected !== "undefined" && isSelected !== null) {
                if(isSelected)
                    select();
                else
                    deselect();
            }
            return selected;
        },
        distance: function(point) {
            return path.getNearestLocation(point);
        },
        onChange: function (callback) { changeCallback = callback; },
        setRobot: function (big) { isBigRobot = big=='big'; }
    };
}

function createPath(pointsToAdd, name) {
    var path = RobotPath(pointsToAdd, name);
    paths[path.name()] = path;
}
function getSelected() {
    if(selectedPath !== "")
        return paths[selectedPath];
}
function onMouseDown(event) {
    if(ignore || Key.isDown('x')) {
        ignore = false;
        return;
    }
    if(selectedPath === "") {
        createPath();
        globals.onNewPath();
    } else if((event.modifiers.option || event.modifiers.alt) && getSelected().distance(event.point)){
        var distance = Math.abs((getSelected().distance(event.point).point - event.point).length);
        if(distance < 3) {
            getSelected().addPoint(event.point.x, event.point.y, getSelected().distance(event.point).index+1);
            return;
        }
    }
    console.dir();
    getSelected().addPoint(event.point.x, event.point.y);
}

globals.getSelected = getSelected;
