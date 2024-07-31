$(document).ready(function () {
    $('.nav-account').removeClass('active');
    $('.nav-group').addClass('active');

    $('.remove-member-btn').click(function () {
        var memId = $(this).attr('id');
        $('#member-id').val(memId);
    });

    $('.remove-invite-btn').click(function () {
        var inviteId = $(this).attr('id');
        $('#invite-id').val(inviteId);
    });
});
var myvar = '<div class="example">' +
    '                                                <input type="file" id="input-file-max-fs" data-max-file-size="25M" name="logo" />' +
    '                                                <div id="sign-loading" class="example-loading example-well vertical-align text-center loader-content-custom">' +
    '                                                    <div class="loader vertical-align-middle loader-bounce"></div>' +
    '                                                </div>' +
    '                                            </div>';
function showChangeLogo() {
    $.ajax({
        url: "/Home/SearchForPartner?keyword=" + $('#keyword').val(),
        success: function (result) {
            $('#partner-list').html(myvar);
            $('.test').resize();
            $('#input-file-max-fs').dropify({
                CallBack: selectFileCallback,
                messages: {
                    'default': 'Kéo App logo vào khung này hoặc click để chọn',
                    'replace': 'Kéo App logo vào khung này hoặc click để thay thế',
                    'remove': 'Hủy chọn tệp',
                    'error': 'Đã có lỗi xảy ra'
                }
            });
        },
        error: function () {
            $('.example-loading').hide();
        }
    });

}

$('#add-account-form').formValidation({
    framework: "bootstrap4",
    button: {
        selector: '#submit-upgrade-account',
        disabled: 'disabled'
    },
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
    var fields = $("form#add-account-form :input:not(:hidden)");
    if (!required(fields)) {
        { $('#submit-upgrade-account').attr('disabled', 'disabled'); }
    }
    });


$('#add-member-form').formValidation({
    framework: "bootstrap4",
    button: {
        selector: '#add-member-form-submit',
        disabled: 'disabled'
    },
    locale: 'vi_VN',
    icon: null,
    fields: {
        message: {
            validators: {
                notEmpty: {
                    message: 'Lời mời là trường bắt buộc'
                },
                stringLength: {
                    max: 250,
                    message: 'Lời mời quá dài. Vui lòng sử dụng một địa chỉ ngắn hơn (<= 250 ký tự)'
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
    var fields = $("form#add-member-form :input:not(:hidden)");
    if (!required(fields)) {
        { $('#add-member-form-submit').attr('disabled', 'disabled'); }
    }
    });

$('.uri-remove').each(function (index) {
    $(this).on("click", function () {
        var tr = $(this).closest('tr');
        var val = $(this).closest('tr').find('.uri-val').text();
        tr.remove();
        var currentUris = $('#CallbackUri').val();
        if (!currentUris.endsWith(val)) {
            val += ",";
        } else {
            val = "," + val;
        }
        currentUris = currentUris.replace(val, "");
        $('#CallbackUri').val(currentUris);
        $('#uri-error').text('Nhấn cập nhật thông tin để lưu thay đổi');
        $('#uri-error').show();
        console.log($('#CallbackUri').val());
    })
});

$('#add-uri-btn').click(function () {
    var uri = $('#UriMore').val();
    if (uri !== "") {
        var tr = '<tr>' +
            '	<td class="uri-val">' + uri + '</td>' +
            '	<td class="cell-130"><button type="button" class="btn btn-xs btn-danger uri-remove"><i class="fa fa-trash-o"></i></button></td>' +
            '</tr>';
        $('#callback-list').append(tr);
        var currentUris = $('#CallbackUri').val();
        currentUris += "," + uri;
        $('#CallbackUri').val(currentUris);
        $('#UriMore').val('');
        $('#uri-error').text('Nhấn cập nhật thông tin để lưu thay đổi');
        $('#uri-error').show();
        console.log(currentUris);
    }
});