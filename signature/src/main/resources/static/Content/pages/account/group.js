$(document).ready(function () {

    $('#create-admin-form').formValidation({
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
                        max: 32,
                        message: 'Email quá dài. Vui lòng sử dụng một địa chỉ ngắn hơn (<= 32 ký tự)'
                    },
                    regexp: {
                        regexp: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i,
                        message: 'Email không đúng định dạng!'
                    }
                }
            },
            FullName: {
                validators: {
                    notEmpty: {
                        message: 'Họ và tên là trường bắt buộc'
                    },
                    stringLength: {
                        max: 255,
                        message: 'Họ và tên quá dài. Vui lòng thay thế bằng từ viết tắt (<= 255 ký tự)'
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
            AccountType: {
                validators: {
                    notEmpty: {
                        message: 'Vai trò là trường bắt buộc'
                    }
                }
            },
            Sex: {
                validators: {
                    notEmpty: {
                        message: 'Giới tính là trường bắt buộc'
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

});
