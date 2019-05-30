var activeList = 'big';
var editingPathname = '';
var selectedPath = {big:'', small:''};
var selectedTeam = 'green';

function initList() {
    $('.pathName').dblclick(function () {
        var id = $(this).parent().parent().data("pathname");
        editingPathname = id;
        updateSidebar();
        $('.pathNameInput').focus();
    });

    $('.pathNameInput')
    .click(function () {
        $(this).focus();
        return false;
    })
    .change(function () {
        $(this).blur();
    })
    .blur(function() {
        var id = $(this).parent().parent().data("pathname");
        editingPathname = '';
        renamePath(activeList, id, $(this).val());
        selectedPath[activeList] = $(this).val();
        updateSidebar();
    });

    $('.list-element').click(function () {
        var id = $(this).parent().data("pathname");
        selectedPath[activeList] = id;
        updateSidebar();
        selectPath(activeList, id);
    });

    $('.pathVisibility').change(function () {
        var id = $(this).parent().parent().data("pathname");
        visibilities[activeList][id] = $(this).is(':checked');
        saveVisibilities();
        updateView();
	    updateSidebar();
    }).click(function () {
        $(this).change();
        return false;
    });
    $('.deletepath').click(function () {
        var id = $(this).parent().parent().data("pathname");
        if(confirm("Voulez-vous vraiment supprimer "+id+" ?")) {
            deletePath(activeList, id);
            updateSidebar();
            updateView();
        }
    });
    $('.add-element-btn').click(function () {
        var name = createPath(activeList);
        selectedPath[activeList] = name;
        selectPath(activeList, selectedPath[activeList]);
        updateSidebar();
    });
    $('.point-x').change(function () {
        var value = parseInt($(this).val());
        var index = parseInt($(this).data("index"));
        if(!isNaN(value) && !isNaN(index)) {
            console.dir(paths[activeList][selectedPath[activeList]][selectedTeam][tableConfig]);
            paths[activeList][selectedPath[activeList]][selectedTeam][tableConfig].points[index].x = value;
            updateView();
            updatePath(activeList+'.'+selectedPath[activeList]+'.'+selectedTeam);
            updateServer();
        }
    });
    $('.point-y').change(function () {
        var value = parseInt($(this).val());
        var index = parseInt($(this).data("index"));
        if(!isNaN(value) && !isNaN(index)) {
            paths[activeList][selectedPath[activeList]][selectedTeam][tableConfig].points[index].y = value;
            updateView();
            updatePath(activeList+'.'+selectedPath[activeList]+'.'+selectedTeam);
            updateServer();
        }
    });
    $('.point-angle').change(function () {
        var value = parseInt($(this).val());
        var index = parseInt($(this).data("index"));
        if(!isNaN(value) && !isNaN(index)) {
            paths[activeList][selectedPath[activeList]][selectedTeam][tableConfig].points[index].angle = value;
            updateView();
            updatePath(activeList+'.'+selectedPath[activeList]+'.'+selectedTeam);
            updateServer();
        }
    });
    $('.point-strategy').change(function () {
        var value = $(this).val();
        var index = parseInt($(this).data("index"));
        if(!isNaN(index)) {
            paths[activeList][selectedPath[activeList]][selectedTeam][tableConfig].points[index].strategy = value;
            updateView();
            updatePath(activeList+'.'+selectedPath[activeList]+'.'+selectedTeam);
            updateServer();
        }
    });

    $(".teamMirror").change(function () {
        paths[activeList][selectedPath[activeList]].teamMirror = $(this).is(':checked');
        updatePath(activeList+'.'+selectedPath[activeList]+'.'+selectedTeam);
        updateServer();
    });
    $(".cruiseSpeed").change(function () {
        var value = parseFloat($(this).val());
        if(!isNaN(value)) {
            paths[activeList][selectedPath[activeList]].cruiseSpeed = value;
            updateServer();
        }
    });
}

function updateSidebar() {
    jade.render(document.getElementById('biglist'), 'path-list', {
        paths: paths.big,
        visibilities: visibilities.big,
        selected: selectedPath.big,
        editingPathname: editingPathname,
        tableConfig: tableConfig,
    });
    initList();
}

updateSidebar();
