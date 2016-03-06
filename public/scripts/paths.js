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
    var selected = false;

    path.strokeWidth = 2;

    function select() {
        selected = true;
        selectedPath = name;
        path.strokeColor = "rgb(10, 43, 66)";
        for (var i = 0; i < points.length; i++) {
            points[i].visible = true;
        }
    }
    function deselect() {
        path.strokeColor = "black";
        selected = false;
        for (var i = 0; i < points.length; i++) {
            points[i].visible = false;
        }
    }

    function getPointIndex(x, y) {
        for (var i = 0; i < points.length; i++)
            if(Math.abs(points[i].position.x-x) < 0.01 && Math.abs(points[i].position.y-y) < 0.01)
                return i;
        return -1;
    }
    function addPoint(x, y, index) {
        var point = new Path.Circle(new Point(x, y), 3);
        point.fillColor = "black";
        point.strokeColor = "black";

        point.onMouseEnter = function (event) {
            document.body.style.cursor = "crosshair";
            this.fillColor = selected ? "red" : "black";
        };
        point.onMouseLeave = function (event) {
            document.body.style.cursor = "default";
            this.fillColor = "black";
        };
        point.onMouseDrag = function (event) {
            if(selected) {
                var index = getPointIndex(x, y);
                if(index > -1) {
                    point.position = event.point;
                    path.segments[index].point = event.point;
                    x = event.point.x;
                    y = event.point.y;
                }
            }
            event.stop();
        };
        point.onMouseDown = function (event) {
            if(Key.isDown('x') && selected)
                removePoint(x, y);
            ignore = true;
        };
        if(typeof index === "undefined") {
            path.add(new Point(x, y));
            points.push(point);
        } else{
            path.insert(index, new Point(x, y));
            points.splice(index, 0, point);
        }
    }
    function removePoint(x, y) {
        var index = (typeof y == "undefined") ? x : getPointIndex(x, y);
        if(index > -1) {
            points[index].remove();
            path.removeSegment(index);
            points.splice(index, 1);
        }
    }
    function clear() {
        while(points.length > 0)
            removePoint(0);
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
        getPoints: function () { return points; },
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
        }
    };
}

function createPath() {
    var path = RobotPath();
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
