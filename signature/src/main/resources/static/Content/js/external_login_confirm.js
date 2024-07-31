(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define('/forms/validation', ['jquery', 'Site'], factory);
    } else if (typeof exports !== "undefined") {
        factory(require('jquery'), require('Site'));
    } else {
        var mod = {
            exports: {}
        };
        factory(global.jQuery, global.Site);
        global.formsValidation = mod.exports;
    }
})(this, function (_jquery, _Site) {
    'use strict';

    var _jquery2 = babelHelpers.interopRequireDefault(_jquery);

    (0, _jquery2.default)(document).ready(function ($$$1) {
        (0, _Site.run)();
    });

    // Example Validataion Full
    // ------------------------
    (function () {
        (0, _jquery2.default)('#confirm-external-login').formValidation({
            framework: "bootstrap4",
            locale: 'vi_VN',
            icon: null,
            fields: {
                Email: {
                    validators: {
                        notEmpty: {
                            message: 'Email là trường bắt buộc'
                        },
                        emailAddress: {
                            message: 'Địa chỉ email không hợp lệ'
                        }
                    }
                },
                FullName: {
                    validators: {
                        notEmpty: {
                            message: 'Email là trường bắt buộc'
                        },
                        stringLength: {
                            max: 50,
                            message: 'Tên bạn quá dài. Vui lòng sử dụng từ viết tắt'
                        }
                    }
                },
                PhoneNumber: {
                    validators: {
                        notEmpty: {
                            message: 'Số điện thoại di động là thông tin bắt buộc'
                        },
                        stringLength: {
                            max: 12,
                            message: 'Số điện thoại quá dài. Vui lòng kiểm tra lại (<= 12 số)'
                        }
                    }
                },
                Password: {
                    validators: {
                        notEmpty: {
                            message: 'Mật khẩu hiện tại là trường bắt buộc'
                        },
                        stringLength: {
                            min: 6,
                            max: 30,
                            message: 'Mật khẩu yêu cầu độ dài từ 6 đến 30 ký tự'
                        },
                        regexp: {
                            /* Regex không cho phép ký tự unicode */
                            regexp: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[()*_\-!#$%^&\\\~@*,."\'\]])(?=.{6,})(^[a-zA-Z0-9()*_\-!#$%^&\\\~@*,."\'\][]+$)/,
                            message: "Mật khẩu chỉ chứa ký tự Latin gồm ít nhất 1 chữ cái in hoa, 1 chữ cái in thường, 1 số và 1 ký tự đặc biệt."
                        }
                    }
                },
                ConfirmPassword: {
                    validators: {
                        notEmpty: {
                            message: 'Xác nhận mật khẩu là trường bắt buộc'
                        },
                        identical: {
                            field: 'Password',
                            message: 'Xác nhận mật khẩu không khớp'
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
        })
        .on('success.field.fv', function (e, data) {
            //Bắt sự kiện, chỉ enabled submit button khi tất cả required field đều valid.
            var fields = $("form :input:not(:hidden)");
            if (!required(fields)) {
                { $('#external-login-confirm-submit').attr('disabled', 'disabled'); }
            }
        });;;
    })();
        //End function
});

/*
* Hàm kiểm tra tất cả required field đã có dữ liệu.
*/
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
