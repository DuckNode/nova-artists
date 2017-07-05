'use strict';

$(document).ready(function () {
    $('img').addClass('img-responsive');
    $('#filmTable').DataTable({
        paging: false,
        searching: false,
        info: false,
        ordering: false,
        responsive: true
    });
    $('#theatreTable').DataTable({
        paging: false,
        searching: false,
        info: false,
        ordering: false,
        responsive: true
    });
});