'use strict';

$(document).ready(function () {
    $('#gallery img').addClass('img-responsive');
    $('#stageTable').DataTable({
        paging: false,
        searching: false,
        info: false,
        ordering: false
    });
    $('#filmTable').DataTable({
        paging: false,
        searching: false,
        info: false,
        ordering: false
    });
    $('#tvTable').DataTable({
        paging: false,
        searching: false,
        info: false,
        ordering: false
    });
});