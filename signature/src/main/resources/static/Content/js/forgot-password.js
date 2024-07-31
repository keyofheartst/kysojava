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

    // Login form --------------------------------------
    (function () {
        (0, _jquery2.default)('#forgot-pass-form').formValidation({
            framework: "bootstrap4",
            locale: 'vi_VN',
            icon: null,
            fields: {
                Email: {
                    validators: {
                        notEmpty: {
                            message: 'Email là trường bắt buộc'
                        },
                        stringLength: {
                            max: 50,
                            message: 'Email quá dài. Vui lòng sử dụng một địa chỉ ngắn hơn (<= 50 ký tự)'
                        },
                        regexp: {
                            regexp: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i,
                            message: 'Địa chỉ Email không hợp lệ'
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
                var fields = $("form#forgot-pass-form:input:not(:hidden)");
                if (!required(fields)) {
                    { $('#forgot-pass-submit').attr('disabled', 'disabled'); }
                }
            });;
    })();
    // -------------------------------------------------



    // Login form --------------------------------------
    (function () {
        (0, _jquery2.default)('#reset-pass-form').formValidation({
            framework: "bootstrap4",
            locale: 'vi_VN',
            button: {
                selector: '#reset-pass-submit',
                disabled: 'disabled'
            },
            icon: null,
            fields: {
                Email: {
                    validators: {
                        notEmpty: {
                            message: 'Email là trường bắt buộc'
                        },
                        stringLength: {
                            max: 50,
                            message: 'Email quá dài. Vui lòng sử dụng một địa chỉ ngắn hơn (<= 50 ký tự)'
                        },
                        regexp: {
                            regexp: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i,
                            message: 'Địa chỉ Email không hợp lệ'
                        }
                    }
                },
                Password: {
                    validators: {
                        notEmpty: {
                            message: 'Mật khẩu là trường bắt buộc'
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
        })
            .on('success.field.fv', function (e, data) {
                var fields = $("form#reset-pass-form:input:not(:hidden)");
                if (!required(fields)) {
                    { $('#reset-pass-submit').attr('disabled', 'disabled'); }
                }
            });;
    })();
    // -------------------------------------------------

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
