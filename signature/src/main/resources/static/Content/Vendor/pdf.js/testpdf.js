
$(document).ready(function () {
    VnptPdf.initPlugin();

    $('#advancedSign').click(function () {
        VnptPdf.start();
    });
});

function sign() {
    console.log(VnptPdf.getPdfOptions());
}

$(document).on(
        'change',
        '#input-file :file',
        function (event) {
            var input = $(this), numFiles = input.get(0).files ? input
                    .get(0).files.length : 1, label = input.val().replace(
                    /\\/g, '/').replace(/.*\//, '');
            input.trigger('fileselect', [numFiles, label]);
            var file = event.target.files[0];
            VnptPdf.initData(file, sign);
        });

