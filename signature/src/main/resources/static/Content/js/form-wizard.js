(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define('/forms/wizard', ['jquery', 'Site'], factory);
    } else if (typeof exports !== "undefined") {
        factory(require('jquery'), require('Site'));
    } else {
        var mod = {
            exports: {}
        };
        factory(global.jQuery, global.Site);
        global.formsWizard = mod.exports;
    }
})(this, function (_jquery, _Site) {
    'use strict';

    var _jquery2 = babelHelpers.interopRequireDefault(_jquery);

    (0, _jquery2.default)(document).ready(function ($$$1) {
        (0, _Site.run)();
    });

    var titles = [
        'Cài đặt ứng dụng',
        'Quét mã xác nhận',
        'Xác nhận',
        'Step 4'
    ];

    // Example Wizard Progressbar
    // --------------------------
    (function () {
        var defaults = Plugin.getDefaults("wizard");
        $('#test').click(function () {
            window.location.href = "/accountconfig?tab=update-tran-pass";
        });

        var options = _jquery2.default.extend(true, {}, defaults, {
            step: '.wizard-pane',
            onInit: function onInit() {
                this.$progressbar = this.$element.find('.progress-bar').addClass('progress-bar-striped');
            },
            onFinish: function onFinish() {
                var pin = $('#smartotp-pin').val();
                if (pin === '') {
                    $('#smart-otp-error').text('(*) Nhập mã xác nhận từ ứng dụng VNPT-Kyso để tiếp tục.');
                    return;
                }
                this.$progressbar.removeClass('progress-bar-striped').addClass('progress-bar-success');
                $.ajax({
                    method: "POST",
                    url: "/accountconfig/update2fatype",
                    data: {
                        type: 'smartotp',
                        value: pin
                    },
                    async: true,
                    beforeSend: function () {
                        $('#smartotp-loader').show();
                    }
                }).done(function (response) {
                    if (response.ResponseCode === 0) {
                        window.location.href = "/accountconfig?message=Cấu hình xác nhận giao dịch thành công&messageType=info";
                    } else {
                        $('#smartotp-loader').hide();
                        showMessage("Cấu hình thất bại." + response.Message, "error");
                    }
                });
            },
            validator: function (step) {
                if (step === 3) {
                    return false;
                }
                return true;
            },
            onAfterChange: function onAfterChange(prev, step) {
                var total = this.length();
                var current = step.index + 1;
                var percent = current / total * 100;
                if (current === 2) {
                    $.ajax({
                        method: "POST",
                        url: "/accountconfig/loadcode",
                        data: {
                            type: 'smartotp'
                        },
                        async: true,
                        beforeSend: function () {
                            //$('#smartopt-config').html('');
                            //$('#smartotp-qr-loader').hide();
                        }
                    }).done(function (response) {
                        $('#smartotp-qr-loader').hide();
                        if (response.ResponseCode === 0) {
                            var html = '<img src="' + response.Message.replace('base64', 'charset=utf-8;base64') + '" width="220" />' +
                                '<br />' +
                                '<div class="divider">' +
                                '    <span>Hoặc</span>' +
                                '</div>' +
                                '<a class="action-btn" id="test" href="javascript:void(0)">Cập nhật mật khẩu giao dịch</a><br />';
                            $('#smartopt-config').html(html);
                            $('#smartopt-config img').on('click', function () {
                                $('#overlay')
                                    .css({ backgroundImage: `url(${this.src})` })
                                    .addClass('open')
                                    .one('click', function () { $(this).removeClass('open'); });
                            });
                        } else {
                            var html1 = '<span class="error">Chưa thiết lập mật khẩu giao dịch</span><br />' +
                                '<a class="action-btn" id="test" href="javascript:void(0)">Cập nhật mật khẩu giao dịch</a><br />';
                            $('#smartopt-config').html(html1);
                        }
                        $('#test').click(function () {
                            window.location.href = "/accountconfig?tab=update-tran-pass";
                        });
                    });
                }

                this.$progressbar.css({
                    width: percent + '%'
                }).find('.sr-only').text(current + '/' + total);
                $('#qr-step-title').text(titles[current - 1]);
            },
            buttonLabels: {
                next: 'TIẾP THEO',
                back: 'QUAY LẠI',
                finish: 'KIỂM TRA'
            },
            buttonsAppendTo: '.panel-body'
        });

        (0, _jquery2.default)("#exampleWizardProgressbar").wizard(options);
    })();

});
