'use strict';

$(document).ready(function () {
    $('#gallery img').addClass('img-responsive');
    $('#filmTable').DataTable({
        paging: false,
        searching: false,
        info: false,
        ordering: false
    });
    // $('#theatreTable').DataTable({
    //     paging: false,
    //     searching: false,
    //     info: false,
    //     ordering: false,
    //     responsive: true
    // });
});