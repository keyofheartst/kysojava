$(document).ready(function () {
    $('.loader-container').hide();
});

$('#none-submit').click(function () {
    $.ajax({
        url: '/accountconfig/update2fatype',
        async: true,
        type: "POST",
        data: {
            type: 'none',
            value: $('#none-password').val()
        },
        beforeSend: function () {
            $('#none-loader').show();
        }
    }).done(function (response) {
        if (response.ResponseCode === 0) {
            window.location.href = "/accountconfig?message=Cấu hình xác nhận giao dịch thành công&messageType=info";
        } else {
            $('#none-loader').hide();
            showMessage("Cấu hình thất bại. " + response.Message, "error");
        }
    }).fail(function () {
        $('#none-loader').hide();
        showMessage("Cấu hình thất bại.", "error");
    });
});

var checkPass = false;
function validateSMS() {
    return checkPass;
}

function resetOTP() {
    $.ajax({
        method: "POST",
        url: "/accountconfig/loadcode",
        data: {
            type: 'smsresent'
        },
        async: true,
        beforeSend: function () {
            $('#smsotp-qr-loader').show();
        }
    }).done(function (response) {
        $('#smsotp-qr-loader').hide();
        if (response.ResponseCode === 0) {
            showMessage('Gửi mã xác nhận thành công', 'info');
        } else {
            showMessage('Gửi mã xác nhận thất bại. ' + response.Message, 'error');
        }
    });
}


var titles = [
    'Xác thực tài khoản',
    'Mã xác nhận'
];

// Example Wizard Progressbar
// --------------------------
(function () {
    var wizard = $("#smsotp-wizard").wizard({
        step: '.steps .step, .pearls .pearl, .wizard-pane',
        onInit: function onInit() {
            this.$progressbar = this.$element.find('.progress-bar').addClass('progress-bar-striped');
        },
        onFinish: function onFinish() {
            const pin = $('#smsotp-password').val();
            if (pin === '') {
                $('#sms-code-error').text('(*) Nhập mã xác nhận từ tin nhắn SMS để tiếp tục.');
                return;
            }
            this.$progressbar.removeClass('progress-bar-striped').addClass('progress-bar-success');
            $.ajax({
                method: "POST",
                url: "/accountconfig/update2fatype",
                data: {
                    type: 'smsotp',
                    value: pin
                },
                async: true,
                beforeSend: function () {
                    $('#smsotp-loader').show();
                }
            }).done(function (response) {
                if (response.ResponseCode === 0) {
                    window.location.href = "/accountconfig?message=Cấu hình xác nhận giao dịch thành công&messageType=info";
                } else {
                    $('#smsotp-loader').hide();
                    showMessage("Cấu hình thất bại." + response.Message, "error");
                }
            });
        },
        onStateChange: function (step, enter, state) {
            var s = step;
            if (state === 'error') {
                $.ajax({
                    method: "POST",
                    url: "/accountconfig/loadcode",
                    data: {
                        type: 'smsotp',
                        value: $('#sms-password').val()
                    },
                    async: true,
                    beforeSend: function () {
                        $('#smsotp-qr-loader').show();
                    }
                }).done(function (response) {
                    $('#smsotp-qr-loader').hide();
                    if (response.ResponseCode === 0) {
                        checkPass = true;
                        $('.wizard-pane').removeClass('error');
                        $('#sms-otp-error').text('');
                        var html1 = '<input class="form-control" type="password" id="smsotp-password" style="font-size:1.5rem; margin:35px auto; margin-bottom:5px; width:200px; text-align:center;" /><br /><a id="sms-resent" href="/accountconfig/loadcode">Gửi lại mã</a>';
                        $('#sms-config').html(html1);
                        step.wizard.next();
                        $('#sms-resent').click(function () {
                            resetOTP();
                        });
                    } else if (response.ResponseCode === 2) {
                        checkPass = true;
                        var html = '<span class="error">Chưa thiết lập mật khẩu giao dịch</span><br />' +
                            '<a class="action-btn" id="test1" href="javascript:void(0)">Cập nhật mật khẩu giao dịch</a><br />';
                        $('#sms-config').html(html);
                        $('#test1').click(function () {
                            var tab = "update-tran-pass";
                            $("a[href='#" + tab + "']").click();
                        });
                        step.wizard.next();
                    } else {
                        checkPass = false;
                        $('#sms-otp-error').text('Mật khẩu không chính xác');
                    }
                });
            }
        },
        onAfterChange: function onAfterChange(prev, step) {
            checkPass = false;
            var total = this.length();
            var current = step.index + 1;
            var percent = current / total * 100;
            this.$progressbar.css({
                width: percent + '%'
            }).find('.sr-only').text(current + '/' + total);
            $('#sms-step-title').text(titles[current - 1]);
        },
        buttonLabels: {
            next: 'KIỂM TRA',
            back: 'QUAY LẠI',
            finish: 'KIỂM TRA'
        },
        buttonsAppendTo: '.panel-body',
        templates: {
            buttons: function buttons() {
                var options = this.options;
                return '<div class="wizard-buttons"><a class="btn btn-default" href="#' + this.id + '" data-wizard="back" role="button">' + options.buttonLabels.back + '</a><a class="btn btn-primary btn-outline float-right" href="#' + this.id + '" data-wizard="next" role="button">' + options.buttonLabels.next + '</a><a class="btn btn-success btn-outline float-right" href="#' + this.id + '" data-wizard="finish" role="button">' + options.buttonLabels.finish + '</a></div>';
            }
        },
        classes: {
            step: {
                active: 'active'
            },
            button: {
                hide: 'hidden-xs-up',
                disabled: 'disabled'
            }
        }
    });
    wizard.next();
})();

var qrtitles = [
    'Cài đặt ứng dụng',
    'Định danh thiết bị'
];

(function () {
    var wizard = $("#qrcode-wizard").wizard({
        step: '.steps .step, .pearls .pearl, .wizard-pane',
        onInit: function onInit() {
            this.$progressbar = this.$element.find('.progress-bar').addClass('progress-bar-striped');
        },
        onFinish: function onFinish() {
            const pin = $('#qrcode-deviceid').val();
            if (pin === '') {
                $('#qrcode-error').text('(*) Nhập định danh thiết bị để tiếp tục.');
                return;
            }
            this.$progressbar.removeClass('progress-bar-striped').addClass('progress-bar-success');
            $.ajax({
                method: "POST",
                url: "/accountconfig/update2fatype",
                data: {
                    type: 'qrcode',
                    value: pin
                },
                async: true,
                beforeSend: function () {
                    $('#qrcode-loader').show();
                }
            }).done(function (response) {
                if (response.ResponseCode === 0) {
                    window.location.href = "/accountconfig?message=Cấu hình xác nhận giao dịch thành công&messageType=info";
                } else {
                    $('#qrcode-loader').hide();
                    $('#qrcode-error').text(response.Message);
                }
            });
        },
        onAfterChange: function onAfterChange(prev, step) {
            checkPass = false;
            var total = this.length();
            var current = step.index + 1;
            var percent = current / total * 100;
            this.$progressbar.css({
                width: percent + '%'
            }).find('.sr-only').text(current + '/' + total);
            $('#qrcode-step-title').text(qrtitles[current - 1]);
        },
        buttonLabels: {
            next: 'TIẾP THEO',
            back: 'QUAY LẠI',
            finish: 'KIỂM TRA'
        },
        buttonsAppendTo: '.panel-body',
        templates: {
            buttons: function buttons() {
                var options = this.options;
                return '<div class="wizard-buttons"><a class="btn btn-default" href="#' + this.id + '" data-wizard="back" role="button">' + options.buttonLabels.back + '</a><a class="btn btn-primary btn-outline float-right" href="#' + this.id + '" data-wizard="next" role="button">' + options.buttonLabels.next + '</a><a class="btn btn-success btn-outline float-right" href="#' + this.id + '" data-wizard="finish" role="button">' + options.buttonLabels.finish + '</a></div>';
            }
        },
        classes: {
            step: {
                active: 'active'
            },
            button: {
                hide: 'hidden-xs-up',
                disabled: 'disabled'
            }
        }
    });
    wizard.next();
})();