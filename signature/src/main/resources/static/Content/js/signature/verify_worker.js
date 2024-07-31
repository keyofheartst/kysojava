/*!
 * =============================================================
 * signature-worker v1.0.0 - Signature helper.
 *
 * Copyright © 2019 VNPT IT
 * Author: TuanBS<tuanbs@vnpt.vn>
 * =============================================================
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        root.Verify = factory(root.jQuery);
    }
}(this, function ($) {
    var pluginName = "verify";

    function Verify(element, options) {
        var defaults = {
        };
        this.wrapper = element;
        this.settings = $.extend(true, defaults, options);
        this.wizard = null;
        this.signedFile = null;
        this.dropifyEvt = null;
        this.init();
    }

    Verify.prototype.init = function () {
        const self = this;
        this.dropifyEvt = $('#input-file-max-fs').dropify({
            CallBack: self.selectFileCallback.bind(self),
            messages: {
                'default': 'Kéo tệp cần kiểm tra vào khung này hoặc click để chọn',
                'replace': 'Kéo tệp cần kiểm tra vào khung này hoặc click để thay thế',
                'remove': 'Hủy chọn tệp',
                'error': 'Đã có lỗi xảy ra'
            },
            errorsPosition: 'outside',
            error: {
                'fileSize': 'Kích thước tệp quá lớn (tối đa {{ value }}).',
                'fileExtension': 'Định dạng chưa được hỗ trợ ({{ value }}).',
                'fileEmpty': 'Chưa chọn tệp cần kiểm tra'
            },
            allowedFileExtensions: ['pdf', 'xml', 'docx', 'xlsx', 'pptx', 'txt']

        });

        this.dropifyEvt.on('dropify.afterClear', function () {            
            $('#file-name').html('<i class="icon fa fa-file-o" aria-hidden="true"></i><div class="progress progress-sm"><div class="progress-bar progress-bar-indicating active" style="width: 100%;" role="progressbar"></div></div>');
            $('#file-size').html('<i class="icon fa fa-clone" aria-hidden="true"></i><div class="progress progress-sm"><div class="progress-bar progress-bar-indicating active" style="width: 100%;" role="progressbar"></div></div>');
            $('#file-content-type').html('<i class="icon fa fa-info-circle" aria-hidden="true"></i><div class="progress progress-sm"><div class="progress-bar progress-bar-indicating active" style="width: 100%;" role="progressbar"></div></div>');
            self.signedFile = null;

        });

        this.wizardPlugin = $("#signature-wizard").wizard(_wizardOptions);
        this.wizard = this.wizardPlugin.data('wizard');
        this.wizardPlugin.on('wizard::finish', this.finishWizard1.bind(this));
        this.wizardPlugin.on('wizard::back', this.backWizard.bind(this));
        //this.wizardPlugin.on('wizard::back', this.backWizard.bind(this));
        this.wizard.get('#step-1').setValidator(this.validateFiles.bind(this));
    };

    Verify.prototype.finishWizard = function () {
        const funcName = $('.capcha-content').find('a').attr('onclick');
        this.reloadCapcha();
    };

    /**
     * */
    Verify.prototype.reloadCapcha = function () {
        $.get('/Verify/CapchaView', function (data) {
            $('.capcha-content').html(data);
            $('.capcha-content').find('input[type=text]').addClass('form-control col-md-6 offset-md-3');
            $('.capcha-content').find('input[type=text]').css('margin-top', '5px');
            $('.capcha-content').find('input[type=text]').css('text-transform', 'uppercase');
            $('.capcha-content').find('input[type=text]').css('text-align', 'center');
            $('.capcha-content').find('input[type=text]').css('font-weight', '500');
            $('.capcha-content').find('input[type=text]').attr('maxlength','10');
        });
    };

    Verify.prototype.backWizard = function () {
        $('.nav-tabs-horizontal #signature-list, #signatures-nav').html('');
        //$('.list-group .doc-data').html('<div class="progress progress-sm"><div class="progress-bar progress-bar-indicating active" style="width: 100%;" role="progressbar"></div> </div>');
        $('#doc-status').html('');
    };


    Verify.prototype.finishWizard1 = function () {
        const self = this;
        $.ajax({
            method: "POST",
            url: "/Verify/Verify",
            data: $('#verify-form').serialize(),
            async: true,
            beforeSend: function () {
                $('.finish-signature-loader').css('display', 'flex');
                $('.finish-signature-loader').find('.loader-message').text('Đang kiểm tra chữ ký...');
            }
        }).done(function (response) {
            self.reloadCapcha();           
            $('.finish-signature-loader').css('display', 'none');
            if (response.ResponseCode === 1) {
                if (response.Content === null || response.Content.signatures === null) {
                    showMessage("Kiểm tra thành công. File không có chữ ký số", "info");
                    $('#signature-list').append("File không có chữ ký số.");
                    $('#signatures-nav').removeClass("nav-tabs");
                    return;
                }                
                if (response.Content.status) {                    
                    $('#doc-status').html('<span class="badge badge-success" style="padding: .5em 1.0em;">Dữ liệu hợp lệ</span>');
                } else {                    
                    $('#doc-status').html('<span class="badge badge-danger" style="margin-left:30px;padding: .5em 1.0em;">Dữ liệu đã bị thay đổi</span>');
                }
                const tabNav = '<li class="nav-item" role="presentation"><a class="nav-link" data-toggle="tab" href="#TAB_CONTENT_ID" aria-controls="TAB_CONTENT_ID" role="tab" aria-selected="false">TAB_NAV_ID</a></li>';
                $('#signatures-nav').empty();
                $('#signature-list').empty();

                $('#signatures-nav').addClass("nav-tabs");
                var sigs = response.Content.signatures.sort(function (a, b) { return a.signingTime > b.signingTime; });
                $.each(sigs, function (index, sig) {
                    $('#signatures-nav').append(tabNav.replace('TAB_CONTENT_ID', 'SIGN' + index).replace('TAB_NAV_ID', 'Sig ' + (index + 1)));
                    $('#signature-list').append(sigInfo.replace('TAB_CONTENT_ID', 'SIGN' + index)
                        .replace('ADDRESS', sig.address)
                        .replace('SUBJECT', sig.subject)
                        .replace('CERT_STATUS', sig.certStatus)
                        .replace('SIGNING_TIME', sig.signingTime)
                        .replace('ISSUER', sig.issuer)
                        .replace('SERIAL', sig.serial)
                        .replace('VALID_FROM', sig.validFrom)
                        .replace('VALID_TO', sig.validTo));
                    if (sig.serial == null) {
                        showMessage('Chữ ký số không đúng hoặc văn bản bị thay đổi nội dung', 'error');
                        $('#doc-status').html('<span class="badge badge-danger" style="margin-left:30px;padding: .5em 1.0em;">Dữ liệu đã bị thay đổi</span>');
                    }
                });
                $('#signatures-nav').find('.nav-item').first().addClass('active');
                $('#signatures-nav').find('.nav-item').first().find('a').addClass('active');
                $('.tab-pane').first().addClass('active');
                showMessage('Kiểm tra thành công. File có chữ ký số', 'info');
            }
            else if (response.ResponseCode === 53) {                
                return;
            } else {                
                showMessage("Kiểm tra thất bại. " + response.ResponseContent, "error");
            }
        });
    };

    /**
     * Validate input files
     * @returns {boolean} return true if input files seem good
     * */
    Verify.prototype.validateFiles = function () {
        if (this.signedFile === null) {
            $('[data-target="#step-1"]').addClass('error');
            $('.my-pearl').addClass('error');
            $('[data-wizard="next"]').addClass('disabled');
            $('.dropify-errors-container').find('ul').html('<li>' + fileEmptyError + '</li>');
        }

        return this.signedFile !== null;
    };

    /**
     * 
     * @param {any} file File object
     * @param {any} fileBase64 Data base64 encoded
     */
    Verify.prototype.selectFileCallback = function (file, fileBase64) {
        $('[data-target="#step-1"]').removeClass('error');
        $('[data-wizard="next"]').removeClass('disabled');
        $('.nav-tabs-horizontal #signature-list, #signatures-nav').html('');
        //$('.list-group .doc-data').html('<div class="progress progress-sm"><div class="progress-bar progress-bar-indicating active" style="width: 100%;" role="progressbar"></div> </div>');
        $('#doc-status').html('');
        if (file === null) {
            return;
        }

        var dataIndex = fileBase64.indexOf("base64,") + 7;
        var data = fileBase64.substr(dataIndex);

        $('#file-name .progress').replaceWith(file.name);
        $('#file-size .progress').replaceWith(filesize(file.size));
        $('#file-content-type .progress').replaceWith(file.type);
        this.signedFile = {
            fileName: file.name,
            fileContentType: file.type,
            fileSize: filesize(file.size),
            fileContent: data
        };
        const fileNameSplit = file.name.split(".");
        const fileType = fileNameSplit[fileNameSplit.length - 1].toLowerCase();
        $('#verify-form').find('input[name=data]').val(data);
        $('#verify-form').find('input[name=type]').val(fileType);
        $('#verify-form').find('input[name=name]').val(file.name);
        $('#verify-form').find('input[name=contentType]').val(file.type);
    };

    const fileEmptyError = 'Chưa chọn tệp cần ký';

    const sigInfo = '<div class="tab-pane" id="TAB_CONTENT_ID" role="tabpanel">'+
        '<div class="list-group">'+
                            '<a class="list-group-item" href="javascript:void(0)">'+
                                '<b>Chủ chứng thư: </b>'+
'SUBJECT'+
                            '</a>' +
//                             '<a class="list-group-item" href="javascript:void(0)">' +
//                                 '<b>Địa chỉ: </b>' +
// 'ADDRESS' +
//                             '</a>' +
                            '<a class="list-group-item" href="javascript:void(0)">'+
                                '<b>Số Serial: </b>'+
'SERIAL'+
                            '</a>'+
                            '<a class="list-group-item" href="javascript:void(0)">' +
                                '<b>Trạng thái thu hồi CTS: </b>' +
'CERT_STATUS' +
                            '</a>' +
                            '<a class="list-group-item" href="javascript:void(0)">' +
                                '<b>Thời gian ký: </b>' +
'SIGNING_TIME' +
                            '</a>' +
//                             '<a class="list-group-item" href="javascript:void(0)">'+
//                                 '<b>Nhà cung cấp: </b>'+
// 'ISSUER'+
//                             '</a>'+

                            '<a class="list-group-item" href="javascript:void(0)">'+
                                '<b>Ngày hiệu lực: </b>'+
'VALID_FROM'+
                            '</a>'+
                            '<a class="list-group-item" href="javascript:void(0)">'+
                                '<b>Ngày hết hạn: </b>'+
'VALID_TO'+
    '</a>' +
        '</div>' +
        '</div>';

    /**
     * */
    const _wizardOptions = {
        step: '.wizard-pane',
        onInit: function onInit() {
            this.$progressbar = this.$element.find('.progress-bar').addClass('progress-bar-striped');

        },
        onStateChange: function (step, enter, state) {
        },
        onFinish: function onFinish() {

        },
        onBeforeChange: function onAfterChange(prev, step) {
            var stepchange = 1;
            checkPass = false;
            var total = this.length();
            var current = step.index + 1;
            var percent = current / total * 100;
            this.$progressbar.css({
                width: percent + '%'
            }).find('.sr-only').text(current + '/' + total);

            if (step.index > prev.index) {
                $('[data-target="#step-' + (prev.index + 1) + '"]').addClass('done');
            } else {
                $('[data-target="#step-' + (prev.index + 1) + '"]').removeClass('done');
                $('[data-target="#step-' + (prev.index + 1) + '"]').removeClass('current');
                $('[data-target="#step-' + (prev.index + 1) + '"]').addClass('disabled');
            }

            $('[data-target="#step-' + (step.index + 1) + '"]').removeClass('done');
            $('[data-target="#step-' + (step.index + 1) + '"]').addClass('current');
            $('[data-target="#step-' + (step.index + 1) + '"]').removeClass('disabled');

            const icon = $('[data-target="#step-' + (step.index + 1) + '"]').find('i').clone();
            $('.capcha-content').find('input[type=text]').attr('maxlength','255');
            $('.my-pearl .pearl-icon').html(icon);
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
                return '<div class="wizard-buttons col-md-8 offset-md-2"><a class="btn btn-default" href="#' + this.id + '" data-wizard="back" role="button">' + options.buttonLabels.back + '</a><a class="btn btn-primary" href="#' + this.id + '" data-wizard="next" role="button">' + options.buttonLabels.next + '</a><a class="btn btn-success" href="#' + this.id + '" data-wizard="finish" role="button">' + options.buttonLabels.finish + '</a></div>';
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
    };

    $.fn[pluginName] = function (options) {
        var v;
        if (!$.data(this, pluginName)) {
            v = new Verify(this, options);
            $.data(this, pluginName, v);
        }
        return v;
    };
    return Verify;

}));