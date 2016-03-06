var tableConfig = 1;

$(function () {
    $(".select").mouseup(function () {
        tableConfig = $(this).attr('id').substring(6);
        $('.selector').css('background-image', 'url(images/select'+tableConfig+'.svg)');
        $('.table-layout').attr('src', 'images/table'+tableConfig+'.svg');
    });
});
