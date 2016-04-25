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
        console.log(id);
        visibilities[activeList][id] = $(this).is(':checked');
        saveVisibilities();
        updateView();
        //return false;
    }).click(function () {
        $(this).attr('checked', !$(this).is(':checked'));
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
    $('.initAngle').change(function () {
        var value = parseInt($(this).val());
        if(!isNaN(value)) {
            paths[activeList][selectedPath[activeList]][selectedTeam][tableConfig].initAngle = value;
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
        var value = parseInt($(this).val());
        if(!isNaN(value)) {
            paths[activeList][selectedPath[activeList]].cruiseSpeed = value;
            updateServer();
        }
    });
    $(".endSpeed").change(function () {
        var value = parseInt($(this).val());
        if(!isNaN(value)) {
            paths[activeList][selectedPath[activeList]].endSpeed = value;
            updateServer();
        }
    });
    $(".configLinkEnable").change(function () {
        var configLink = $(this).parent().find(".configLink").val();
        paths[activeList][selectedPath[activeList]].green[tableConfig].configLink = $(this).is(':checked') ? configLink : -1;
        paths[activeList][selectedPath[activeList]].purple[tableConfig].configLink = $(this).is(':checked') ? configLink : -1;
        if($(this).is(':checked')) {
            var tmp = tableConfig;
            tableConfig = configLink;
            updateView();
            updatePath(activeList+'.'+selectedPath[activeList]+'.'+selectedTeam);
            tableConfig = tmp;
            updateView();
        }
        updateServer();
        updateSidebar();
    });
    $(".configLink").change(function () {
        var configLink = $(this).val();
        paths[activeList][selectedPath[activeList]].green[tableConfig].configLink = configLink;
        paths[activeList][selectedPath[activeList]].purple[tableConfig].configLink = configLink;
        // import path
        var tmp = tableConfig;
        tableConfig = configLink;
        updateView();
        updatePath(activeList+'.'+selectedPath[activeList]+'.'+selectedTeam);
        tableConfig = tmp;
        updateView();
        updateSidebar();
        updateServer();
    });
}

function updateTabs() {
    if(activeList === 'small') {
        $('#biglist').hide();
        $('#smalllist').show();
        $('.smalltab').addClass('selected-tab');
        $('.bigtab').removeClass('selected-tab');
    } else {
        $('#smalllist').hide();
        $('#biglist').show();
        $('.bigtab').addClass('selected-tab');
        $('.smalltab').removeClass('selected-tab');
    }
}

$(function () {
    // change table config
    $(".select").mouseup(function() {
        var val = $(this).attr('id').substring(6);
        tableConfig = parseInt(val)-1;
        $('.selector').css('background-image', 'url(images/select'+val+'.svg)');
        $('.table-layout').attr('src', 'images/table'+val+'.svg');
        updateView();
        updateSidebar();
    });
    // tabs
    $('.smalltab').click(function () {
        activeList = 'small';
        updateTabs();
        selectPath(activeList, selectedPath[activeList]);
    });
    $('.bigtab').click(function () {
        activeList = 'big';
        updateTabs();
        selectPath(activeList, selectedPath[activeList]);
    });

    updateTabs();
});


function updateSidebar() {
    jade.render(document.getElementById('biglist'), 'path-list', {
        paths: paths.big,
        visibilities: visibilities.big,
        selected: selectedPath.big,
        editingPathname: editingPathname,
        tableConfig: tableConfig,
    });
    jade.render(document.getElementById('smalllist'), 'path-list', {
        paths: paths.small,
        visibilities: visibilities.small,
        selected: selectedPath.small,
        editingPathname: editingPathname,
        tableConfig: tableConfig,
    });
    initList();
}

updateSidebar();
