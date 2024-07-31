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
        (0, _jquery2.default)('#update-profile-form').formValidation({
            framework: "bootstrap4",
            locale: 'vi_VN',
            icon: null,
            fields: {
                FullName: {
                    validators: {
                        notEmpty: {
                            message: 'Họ tên là trường bắt buộc'
                        },
                        stringLength: {
                            max: 255,
                            message: 'Họ tên quá dài. Vui lòng thay thế bằng tên viết tắt (<= 255 ký tự)'
                        }
                    }
                },
                Email: {
                    validators: {
                        notEmpty: {
                            message: 'Email là trường bắt buộc'
                        },
                        stringLength: {
                            max: 32,
                            message: 'Email quá dài. Vui lòng sử dụng một địa chỉ ngắn hơn (<= 32 ký tự)'
                        },
                        regexp: {
                            regexp: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i,
                            message: 'Địa chỉ Email không hợp lệ'
                        }
                    }
                },
                PhoneNumber: {
                    validators: {
                        notEmpty: {
                            message: 'Số điện thoại là trường bắt buộc'
                        },
                        stringLength: {
                            max: 14,
                            message: 'Số điện thoại quá dài. Vui lòng thay thế bằng từ viết tắt (<= 14 ký tự)'
                        }
                    }
                },
                UserName: {
                    validators: {
                        stringLength: {
                            max: 255,
                            message: 'Mã nhân viên quá dài. Vui lòng thay thế bằng từ viết tắt (<= 255 ký tự)'
                        }
                    }
                },
                Title: {
                    validators: {
                        stringLength: {
                            max: 255,
                            message: 'Chức danh quá dài. Vui lòng thay thế bằng từ viết tắt (<= 255 ký tự)'
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
        });
    })();
    // End function

    //Function: 

    (function () {
        (0, _jquery2.default)('#change-pass-form').formValidation({
            framework: "bootstrap4",
            locale: 'vi_VN',
            icon: null,
            fields: {
                OldPassword: {
                    validators: {
                        notEmpty: {
                            message: 'Mật khẩu hiện tại là trường bắt buộc'
                        },
                        stringLength: {
                            min: 8,
                            max: 30,
                            message: 'Mật khẩu yêu cầu độ dài từ 8 đến 30 ký tự'
                        }
                    }
                },
                NewPassword: {
                    validators: {
                        notEmpty: {
                            message: 'Mật khẩu mới là trường bắt buộc'
                        },
                        regexp: {
                            /* Regex không cho phép ký tự unicode */
                            regexp: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[()*_\-!#$%^&\\\~@*,."\'\]])(?=.{8,})(^[a-zA-Z0-9()*_\-!#$%^&\\\~@*,."\'\][]+$)/,
                            message: "Mật khẩu chứa ít nhất 8 ký tự, bao gồm cả ký tự số, chữ hoa, chữ thường và ký tự đặc biệt."
                        }
                    }
                },
                ConfirmPassword: {
                    validators: {
                        notEmpty: {
                            message: 'Xác nhận mật khẩu mới là trường bắt buộc'
                        },
                        identical: {
                            field: 'NewPassword',
                            message: 'Xác nhận mật khẩu mới chưa chính xác'
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
        });
    })();
    //End function



    (function () {
        (0, _jquery2.default)('#update-pass-form').formValidation({
            framework: "bootstrap4",
            button: {
                selector: '#update-pass-submit',
                disabled: 'disabled'
            },
            locale: 'vi_VN',
            icon: null,
            fields: {
                NewPassword: {
                    validators: {
                        notEmpty: {
                            message: 'Mật khẩu mới là trường bắt buộc'
                        },
                        stringLength: {
                            min: 8,
                            max: 30,
                            message: 'Mật khẩu yêu cầu độ dài từ 8 đến 30 ký tự'
                        }
                    }
                },
                ConfirmPassword: {
                    validators: {
                        notEmpty: {
                            message: 'Xác nhận mật khẩu mới là trường bắt buộc'
                        },
                        identical: {
                            field: 'NewPassword',
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
        });
    })();

    // Upgrage Account form -----------------------------------
    (function () {
        (0, _jquery2.default)('#upgrage-account-form').formValidation({
            framework: "bootstrap4",
            locale: 'vi_VN',
            icon: null,
            button: {
                selector: '#submit-upgrade-account',
                disabled: 'disabled'
            },
            fields: {
                groupName: {
                    validators: {
                        notEmpty: {
                            message: 'Tên tổ chức/doanh nghiệp là trường bắt buộc'
                        },
                        stringLength: {
                            max: 50,
                            message: 'Tên quá dài. Vui lòng thay thế bằng tên viết tắt (<= 50 ký tự)'
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
            var fields = $("form#upgrage-account-form :input:not(:hidden)");
            if (!required(fields)) {
                $('#submit-upgrade-account').attr('disabled', 'disabled');
            }
        });
    })();


    // Example Validataion Full
    // ------------------------
    (function () {
        (0, _jquery2.default)('#update-appclient-form').formValidation({
            framework: "bootstrap4",
            button: {
                selector: '#update-app-submit'
            },
            locale: 'vi_VN',
            icon: null,
            fields: {
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
            $('#update-app-submit').removeAttr('disabled');
        });;
    })();
    // End function

});

/*
* Working not good
*/
String.prototype.toDate = function (format) {
    var normalized = this.replace(/[^a-zA-Z0-9]/g, '-');
    var normalizedFormat = format.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
    var formatItems = normalizedFormat.split('-');
    var dateItems = normalized.split('-');

    var monthIndex = formatItems.indexOf("mm");
    var dayIndex = formatItems.indexOf("dd");
    var yearIndex = formatItems.indexOf("yyyy");
    var hourIndex = formatItems.indexOf("hh");
    var minutesIndex = formatItems.indexOf("ii");
    var secondsIndex = formatItems.indexOf("ss");

    var today = new Date();

    var year = yearIndex > -1 ? dateItems[yearIndex] : today.getFullYear();
    if (!year) {
        year = today.getFullYear();
    }
    var month = monthIndex > -1 ? dateItems[monthIndex] - 1 : today.getMonth() - 1;
    if (!month) {
        month = today.getMonth() - 1;
    }
    var day = dayIndex > -1 ? dateItems[dayIndex] : today.getDate();
    if (!day) {
        day = today.getDate();
    }

    var hour = hourIndex > -1 ? dateItems[hourIndex] : today.getHours();
    var minute = minutesIndex > -1 ? dateItems[minutesIndex] : today.getMinutes();
    var second = secondsIndex > -1 ? dateItems[secondsIndex] : today.getSeconds();

    return new Date(year, month, day, hour, minute, second);
};

$('#inputDateOfBirth').on('dp.change dp.show', function (e) {
    $('#update-profile-form').formValidation('revalidateField', 'DateOfBirth');
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


    /*
    *
    */
    $(document).ready(function () {
        $('.nav-account').addClass('active');
        var picker = $('.datepicker').datepicker({
            format: 'dd/mm/yyyy',
            language: 'vi',
            autoclose: true
        })
        .on('changeDate', function (e) {
            $('#update-profile-form').formValidation('revalidateField', 'DateOfBirth');
        });

        var date = "";
        $("#inputDateOfBirth").bind("keyup", function () {
            date = this.value;
            //$('.datepicker').datepicker('update', new Date());
            $('#update-profile-form').formValidation('revalidateField', 'DateOfBirth');
        });
        $("#inputDateOfBirth").focusout(function () {
            if (date !== "") {
                var newDate = date.toDate("dd/mm/yyyy");
                picker.datepicker('update', newDate);
                $('#update-profile-form').formValidation('revalidateField', 'DateOfBirth');
                date = "";
            }
        });


        $('.reject-invite-btn').click(function () {
            var inviteId = $(this).attr('id');
            $('#invite-reject-id').val(inviteId);
        });


        var fileSelector = $('#groupImg').dropify({
            messages: {
                'default': 'Kéo hình ảnh vào khung này hoặc click để chọn',
                'replace': 'Kéo hình ảnh vào khung này hoặc click để thay thế',
                'remove': 'Hủy chọn hình ảnh',
                'error': 'Đã có lỗi xảy ra'
            }
        });

        var upgradeModalError = $('#upgrade-input-error').val();
        if ("INVALID" === upgradeModalError) {
            $('#updateAccountModel').modal('show');
        }

        // Tim kiem doi tac
        $('#search-partner').click(function () {
            searchPartner();
        });
        $('#keyword').keypress(function (e) {
            if (e.which === 13) {
                searchPartner();
            }
        });
    });

    var selectFileCallback = function (file, fileBase64) {
        var dataIndex = fileBase64.indexOf("base64,") + 7;
        var data = fileBase64.substr(dataIndex);
        $('#groupImgBase64').val(data);
        $('#groupImgName').val(file.name);
    }

    function searchPartner() {
        $('#partner-list').empty();
        $('.example-loading').show();
        $.ajax({
            url: "/Home/SearchForPartner?keyword=" + $('#keyword').val(),
            success: function (result) {
                $('.example-loading').hide();
                $('#partner-list').html(result);
                $('.friend-info').click(function () {
                    var partnerName = $(this).find('.friend-name').text();
                    var partnerEmail = $(this).find('.friend-title').text();
                    $('#partner-name').text(partnerName);
                    $('#partner-email').val(partnerEmail);
                    $('#addGroupMemberModal').modal('hide');
                    $('#confirmAddmemberModal').modal('show');
                });
                $('.test').resize();
            },
            error: function () {
                $('.example-loading').hide();
            }
        });
    }
