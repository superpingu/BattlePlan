var activeList = 'big';
var editingPathname = '';
var selectedPath = '';

function initList() {
    $('.pathName').dblclick(function () {
        var id = $(this).parent().attr("id");
        editingPathname = id;
        updateSidebar();
    });
    $('.list-element').click(function () {
        var id = $(this).prop("id");
        selectedPath = id;
        console.log(id);
        updateSidebar();
    });
    $('.pathVisibility').change(function () {
        var id = $(this).parent().attr("id");
        visibilities[activeList][id] = $(this).is(':checked');
        updateView();
    });
    $('.add-element').click(function () {
        var name = createPath(activeList);
        selectedPath = name;
        console.dir(paths.big);
        updateSidebar();
    });
}
$(function () {
    // change table config
    $(".select").mouseup(function() {
        tableConfig = $(this).attr('id').substring(6);
        $('.selector').css('background-image', 'url(images/select'+tableConfig+'.svg)');
        $('.table-layout').attr('src', 'images/table'+tableConfig+'.svg');
    });

    $('.smalltab').click(function () {
        if(activeList === 'big') {
            activeList = 'small';
            $('#biglist').hide();
            $('#smalllist').show();
            $('.smalltab').addClass('selected-tab');
            $('.bigtab').removeClass('selected-tab');
        }
    });
    $('.bigtab').click(function () {
        if(activeList === 'small') {
            activeList = 'big';
            $('#smalllist').hide();
            $('#biglist').show();
            $('.bigtab').addClass('selected-tab');
            $('.smalltab').removeClass('selected-tab');
        }
    });
    $('#smalllist').hide();
});

function updateSidebar() {
    jade.render(document.getElementById('biglist'), 'path-list', {
        paths: paths.big,
        visibilities: visibilities.big,
        selected: selectedPath,
        editingPathname: editingPathname,
        currentConfig: tableConfig
    });
    jade.render(document.getElementById('smalllist'), 'path-list', {
        paths: paths.small,
        visibilities: visibilities.small,
        selected: selectedPath,
        editingPathname: editingPathname,
        currentConfig: tableConfig
    });
    initList();
}

updateSidebar();
