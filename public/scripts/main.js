var tableConfig = 1;
window.globals = {onNewPath: onNewPath};

var socket = io.connect("http://abonetti.fr:3004/client");
socket.on('pathUpdate', function(data) {
    paths = data;
    viewUpdate();
});

function dumpPoints(points) {
    var result = "struct robotPoint path[] = {<br>";
    for(var i in points) {
        result += "&nbsp;&nbsp;&nbsp;&nbsp;{"+points[i].x+","+points[i].y+"}";
        if(i == (points.length - 1))
            result += "<br>";
        else
            result += ",<br>";
    }
    return result + "}";
}
function onNewPath() {
    var path = window.globals.getSelected();
    path.onChange(function () {
        $('.points').html(dumpPoints(path.getPoints()));
    });
}

$(function () {
    $(".select").mouseup(function () {
        tableConfig = $(this).attr('id').substring(6);
        $('.selector').css('background-image', 'url(images/select'+tableConfig+'.svg)');
        $('.table-layout').attr('src', 'images/table'+tableConfig+'.svg');
    });
});
