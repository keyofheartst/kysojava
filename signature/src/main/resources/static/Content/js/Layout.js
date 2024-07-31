$(document).ready(function () {
    loadWaitingTransactions();

    //setInterval(loadWaitingTransactions, 30000);
});

function loadWaitingTransactions() {
    $.ajax({
        url: '/Account/LoadWaitingTransactions',
        type: 'POST',
        dataType: 'json',
        success: function (result) {
            if (result.success === 1 && result.TotalItem && result.TotalItem > 0) {
                numOfWaitingTran = result.TotalItem;
                $('#des_notif').html('New ' + result.TotalItem);
                $('#number_notif').html(`${result.TotalItem}`);
                $('#number_notif').css('display', 'initial');
                $('#notifications-html').html(Handlebars.compile($('#notification-template').html())(result));
            }
        }
    });
}