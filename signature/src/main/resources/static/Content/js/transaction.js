(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define('/forms/advanced', ['jquery', 'Site'], factory);
    } else if (typeof exports !== "undefined") {
        factory(require('jquery'), require('Site'));
    } else {
        var mod = {
            exports: {}
        };
        factory(global.jQuery, global.Site);
        global.formsAdvanced = mod.exports;
    }
})(this, function (_jquery, _Site) {
    'use strict';

    var _jquery2 = babelHelpers.interopRequireDefault(_jquery);

    (0, _jquery2.default)(document).ready(function ($$$1) {
        (0, _Site.run)();
    });

    // Example Tokenfield Events
    // -------------------------
    (function () {
        (0, _jquery2.default)('#inputTokenfieldEvents').on('tokenfield:createtoken', function (e) {
            var data = e.attrs.value.split('|');
            e.attrs.value = data[1] || data[0];
            e.attrs.label = data[1] ? data[0] + ' (' + data[1] + ')' : data[0];
        }).on('tokenfield:createdtoken', function (e) {
            $('#email-invalid').text("");
            $('#email-invalid').hide();
            // Über-simplistic e-mail validation
            var re = /\S+@\S+\.\S+/;
            var valid = re.test(e.attrs.value);
            if (!valid) {
                $('#email-invalid').text("Có địa chỉ email không hợp lệ.");
                $('#email-invalid').show();
                (0, _jquery2.default)(e.relatedTarget).addClass('invalid');
            }
        }).on('tokenfield:edittoken', function (e) {
            if (e.attrs.label !== e.attrs.value) {
                var label = e.attrs.label.split(' (');
                e.attrs.value = label[0] + '|' + e.attrs.value;
            }
        }).on('tokenfield:removedtoken', function (e) {
            if (e.attrs.length > 1) {
                var values = _jquery2.default.map(e.attrs, function (attrs) {
                    return attrs.value;
                });
            } else {
                $('#send-tran-form-submit').attr('disabled', 'disabled');
                $('#email-invalid').text("Email đối tác là trường bắt buộc");
                $('#email-invalid').show();
            }
        }).tokenfield();
    })();


    $('#send-tran-form').formValidation({
        framework: "bootstrap4",
        button: {
            selector: '#send-tran-form-submit',
            disabled: 'disabled'
        },
        locale: 'vi_VN',
        icon: null,
        fields: {
            Email: {
                validators: {
                    notEmpty: {
                        message: 'Email đối tác là trường bắt buộc'
                    }
                }
            },
            Message: {
                validators: {
                    notEmpty: {
                        message: 'Lời nhắn là trường bắt buộc'
                    },
                    stringLength: {
                        max: 250,
                        message: 'Lời nhắn quá dài. Vui lòng sử dụng một địa chỉ ngắn hơn (<= 250 ký tự)'
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
            var fields = $("form#send-tran-form :input:not(:hidden)");
            console.log(required(fields));

            $('#send-tran-form-submit').removeAttr('disabled');
    });

});



$(document).ready(function () {
    // Tim kiem doi tac
    $('#search-partner').click(function () {
        searchPartner();
    });
    $('#keyword').keypress(function (e) {
        if (e.which === 13) {
            searchPartner();
        }
    });

    $('.share-tran').click(function () {
        var tranId = $(this).attr('id');
        $('#tran-id').val(tranId);
    });

    $('.send-tran').click(function () {
        var tranId = $(this).attr('id');
        $('#send-tran-id').val(tranId);
    });

    $('.cancel-share-tran').click(function () {
        var tranId = $(this).attr('id');
        $('#confirm-modal-submit').attr('href', '/Transactions/CancelShareTran?tran=' + tranId);
        $('.confirm-modal-mesg').text('Bạn chắc chắn muốn hủy chuyển giao dịch này?');
    });

    if (!String.prototype.endsWith) {
        String.prototype.endsWith = function (suffix) {
            return this.indexOf(suffix, this.length - suffix.length) !== -1;
        };
    }

    verifyTranReview();
});

function verifyTranReview() {
    $('.verify-tran').each(function () {
        $(this).on('click', function () {
            var id = $(this).attr('id');
            $.ajax({
                url: "/Transactions/GetVerifyHistory?tranId=" + id,
                success: function (response) {
                    $('#verify-result-content').html(response);
                    //$('#verifyResult').modal('show');
                    //$('#show-response').show();
                }
            })
        });
    });
}

function searchPartner() {
    $('#partner-list').empty();
    $('.example-loading').show();
    $.ajax({
        url: "/Home/SearchForPartner?keyword=" + $('#keyword').val(),
        data: {
            keyword: $('#keyword').val()
        },
        success: function (result) {
            $('.example-loading').hide();
            $('#partner-list').html(result);
            $('.friend-info').click(function () {
                var partnerName = $(this).find('.friend-name').text();
                var partnerEmail = $(this).find('.friend-title').text();
                $('#partner-name').text(partnerName);
                $('#partner-email').val(partnerEmail);
                $('#examplePositionSidebar').modal('hide');
                $('#shareTranModal').modal('show');
            });
            $('.test').resize();
        },
        error: function () {
            $('.example-loading').hide();
        }
    });
}


$('#share-tran-form').formValidation({
    framework: "bootstrap4",
    button: {
        selector: '#share-tran-form-submit',
        disabled: 'disabled'
    },
    locale: 'vi_VN',
    icon: null,
    fields: {
        message: {
            validators: {
                notEmpty: {
                    message: 'Lời nhắn là trường bắt buộc'
                },
                stringLength: {
                    max: 250,
                    message: 'Lời nhắn quá dài. Vui lòng sử dụng một địa chỉ ngắn hơn (<= 250 ký tự)'
                }
            }
        },
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
    var fields = $("form#share-tran-form :input:not(:hidden)");
    if (!required(fields)) {
        { $('#share-tran-form-submit').attr('disabled', 'disabled'); }
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