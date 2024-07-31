$(document).ready(function () {
    $('.card-block').click(function () {
        var partner = $(this).find('.friend-name').text();
        $('#partner-name').text(partner);
        $('#examplePositionSidebar').modal('hide');
        $('#shareTranModal').modal('show');
    });
})