$(document).ready(function () {
    $('.nav-cert').addClass('active');
});

$('#request-cert-form').formValidation({
    framework: "bootstrap4",
    button: {
        selector: '#request-cert-submit',
        disabled: 'disabled'
    },
    locale: 'vi_VN',
    icon: null,
    fields: {
        Subject: {
            validators: {
                notEmpty: {
                    message: 'Tiêu đề là trường bắt buộc'
                },
                stringLength: {
                    max: 100,
                    message: 'Tiêu đề quá dài (<= 100 ký tự)'
                }
            }
        },
        Message: {
            validators: {
                notEmpty: {
                    message: 'Thông điệp là trường bắt buộc'
                },
                stringLength: {
                    max: 250,
                    message: 'Thông điệp quá dài. Vui lòng thay thế bằng từ viết tắt (<= 250 ký tự)'
                }
            }
        }
    },
    err: {
        clazz: 'invalid-feedback'
    },
    control: {
        // The CSS class for valid control
        valid: 'is-valid',

        // The CSS class for invalid control
        invalid: 'is-invalid'
    },
    row: {
        invalid: 'has-danger'
    }
}).on('err.field.fv', function (e, data) {
    data.fv.disableSubmitButtons(true);
}).on('success.field.fv', function (e, data) {
    var fields = $("form#request-cert-form :input:not(:hidden)");
    if (!required(fields)) {
        { $('#request-cert-submit').attr('disabled', 'disabled'); }
    }
});


var required = function (fields) {
    var valid = true;
    fields.each(function () { // iterate all
        var $this = $(this);
        if (($this.is(':checkbox') && !$this.is(":checked")) || // checkbox
            (($this.is(':text') || $this.is('textarea')) && !$this.val()) || // text and textarea
            ($this.is(':radio') && !$('input[name=' + $this.attr("name") + ']:checked').length) ||
            ($this.is(':password') && !$this.val())) {
            valid = false;
        }
    });

    return valid;
}