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
        root.Signature = factory(root.jQuery);
    }
}(this, function ($) {
    var pluginName = "signature";
    const fileEmptyError = 'Chưa chọn tệp cần ký';
    const VNPT_SIGNSERVER = 'VNPT SignServer';
    const VNPT_PLUGIN = 'VNPT Plugin';

    /**
     * 
     * @param {any} element Wrapper element
     * @param {any} options Plugin options
     * @param {any} callback Callback function
     */
    function Signature(element, options) {
        var defaults = {
        };
        this.wrapper = element;
        this.settings = $.extend(true, defaults, options);
        this.wizard = null;
        this.unsignedFiles = [];
        this.unsignedFile = null;
        this.dropifyEvt = null;
        this.pdfOptions = {};
        this.init();
        this.configCertID = '';
        this.certificate = null;
        this.certificates = [];
        this.servicegroup = null;
        this.configGroupID = '';
        this.groups = [];
        this.signPdfAdvanced = false;
    }

    /**
     * */
    Signature.prototype.init = function () {
        this.signTool = "VNPT SignServer";
        this.signToolDesc = 'Sử dụng Chữ ký số tập trung';
        
        $('#sign-tool-name').text(this.signToolDesc);

        const self = this;
        signatureSelf = this;
        this.resetCertView();
        //this.resetGroupView();

        if ($('#fileContent').val()) {
            $('#signature-title').text('Ký xác nhận');
            this.initData($('#fileName').val(), $('#fileType').val(), $('#fileSize').val(), $('#fileContent').val());
            let fileFullname = $('#fileName').val() + $('#fileType').val();
            $('#input-file-max-fs').attr('data-default-file', $('#fileName').val());
            $('#input-file-max-fs').attr('disabled', 'disabled');
        }
        
        this.dropifyEvt = $('#input-file-max-fs').dropify({
            CallBack: self.selectFileCallback.bind(self),
            messages: {
                'default': 'Kéo tệp cần ký vào khung này hoặc click để chọn',
                'replace': 'Kéo tệp cần ký vào khung này hoặc click để thay thế',
                'remove': 'Hủy chọn tệp',
                'error': 'Đã có lỗi xảy ra'
            },
            errorsPosition: 'outside',
            error: {
                'fileSize': 'Kích thước tệp quá lớn (tối đa {{ value }}).',
                'fileExtension': 'Định dạng chưa được hỗ trợ ({{ value }}).',
                'fileEmpty': 'Chưa chọn tệp cần ký'
            },
            allowedFileExtensions: ['pdf', 'xml', 'docx', 'xlsx', 'pptx', 'txt']
        });
        this.dropifyEvt.on('dropify.errors', function (event, element) {
            $('[data-target="#step-1"]').addClass('error');
            $('[data-wizard="next"]').addClass('disabled');
        });
        this.dropifyEvt.on('dropify.afterClear', function () {
            $('.pdf-option').hide();
            $('#pdf-options-check').prop('checked', false);
            $('#file-name').html('<i class="icon fa fa-file-o" aria-hidden="true"></i><div class= "progress progress-sm"></div>');
            $('#file-size').html('<i class="icon fa fa-clone" aria-hidden="true"></i><div class= "progress progress-sm"></div>');
            $('#file-content-type').html('<i class="icon fa fa-info-circle" aria-hidden="true"></i><div class= "progress progress-sm"></div>');
            self.signPdfAdvanced = false;
            self.unsignedFile = null;

        });



        this.wizardPlugin = $("#signature-wizard").wizard(_wizardOptions);
        this.wizard = this.wizardPlugin.data('wizard');
        this.wizardPlugin.on('wizard::afterChange', this.wizardAfterChange.bind(this));
        this.wizardPlugin.on('wizard::finish', this.finisWizard.bind(this));

        // Set validate input files handle
        this.wizard.get('#step-1').setValidator(this.validateFiles.bind(this));
        this.wizard.get('#step-2').setValidator(this.validateCertificate.bind(this));        


        $('#search-partner-btn').click(function () {
            self.searchPartner();
        });
        $('#search-partner-input').keypress(function (e) {
            if (e.which === 13) {
                self.searchPartner();
            }
        });

        $('#share-tran-submit').click(function () {
            self.shareTransaction();
        });
    };
    

    /**
     *
     * @param {any} file data file object
     * @param {any} fileBase64 base64 data file
     * */
    Signature.prototype.selectFileCallback = function (file, fileBase64) {
        $('[data-target="#step-1"]').removeClass('error');
        $('[data-wizard="next"]').removeClass('disabled');
        if (file === null) {
            return;
        }

        var dataIndex = fileBase64.indexOf("base64,") + 7;
        var data = fileBase64.substr(dataIndex);
        this.initData(file.name, file.type, filesize(file.size), data);
    };

    /**
     * 
     * @param {any} contentType file content type
     * @return {any} file type icon
     */
    Signature.prototype.getFileIcon = function (contentType) {
        let i = 'fa-file-code-o';

        switch (contentType) {
            case 'application/pdf':
                i = 'fa-file-pdf-o';
                break;
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                i = 'fa-file-excel-o';
                break;
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                i = 'fa-file-word-o';
                break;
            case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                i = 'fa-file-powerpoint-o';
                break;
        }

        return '<i class="icon fa ' + i + '" aria-hidden="true"></i>';
    };

    /**
     * 
     * @param {any} name file name
     * @param {any} contentType file content type
     * @param {any} size file size
     * @param {any} base64Data file content in base64 encode
     */
    Signature.prototype.initData = function (name, contentType, size, base64Data) {
        const fileNameIcon = this.getFileIcon(contentType);
        const fileSizeIcon = '<i class="icon fa fa-clone" aria-hidden="true"></i>';
        const fileContentIcon = '<i class="icon fa fa-info-circle" aria-hidden="true"></i>';
        $('#file-name').html(fileNameIcon + name);
        $('#file-size').html(fileSizeIcon + size);
        $('#file-content-type').html(fileContentIcon + contentType);
        const self = this;
        if ('application/pdf' === contentType) {
            $('.pdf-option').show();
            $(document).on('change', '#pdf-options-check', function () {
                console.log(self.signPdfAdvanced);
                self.signPdfAdvanced = this.checked;
            });
        } else {            
            $('#pdf-options-btn').hide();
            $('#pdf-options-btn').unbind('click');
        }
        const file = {
            fileName: name,
            fileContentType: contentType,
            fileSize: size,
            fileContent: base64Data
        };
        this.unsignedFiles.push(file);
        this.unsignedFile = file;
    };

    Signature.prototype.convertBase64ToFile = function (fileBase64, fileName, contentType) {
        const byteString = atob(fileBase64.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i += 1) {
            ia[i] = byteString.charCodeAt(i);
        }
        const newBlob = new Blob([ab], {
            type: contentType,
            name: fileName
        });
        return newBlob;
    };

    /**
     * 
     * @param {any} options Pdf advanced signature options
     */
    Signature.prototype.updatePdfOptions = function (options) {
        this.pdfOptions = options;
        this.signPdfAdvanced = true;
    };

    /**
     * Validate input files
     * @returns {boolean} return true if input files seem good
     * */
    Signature.prototype.validateFiles = function () {
        if (this.unsignedFile === null) {
            $('[data-target="#step-1"]').addClass('error');
            $('.my-pearl').addClass('error');
            $('[data-wizard="next"]').addClass('disabled');
            $('.dropify-errors-container').find('ul').html('<li>' + fileEmptyError + '</li>');
        }

        return this.unsignedFile !== null;
    };

    /**
     * Validate certificate information
     * @return {boolean} Validated info
     * */
    Signature.prototype.validateCertificate = function () {
        if (this.certificate === null) {
            return false;
        }
        if (this.unsignedFile === null) {
            self.wizard.goTo(0);
            return false;
        }
        $('#finish-file').html(filetypes[this.unsignedFile.fileContentType] + ' File name: <strong>' + this.unsignedFile.fileName + '</strong> (' + this.unsignedFile.fileSize + ')');
        $('#finish-certificate').html('<i class="icon fa fa-certificate" aria-hidden="true"></i> Certificate: <strong>' + this.certificate.Subject + '</strong> (' + this.certificate.SerialNumber + ')');
        if (this.signPdfAdvanced) {
            $('#finish-method').html('<i class="icon fa-tag"></i> Method: <strong>KÝ PDF NÂNG CAO</strong>');
        } else {
            $('#finish-method').html('<i class="icon fa-tag"></i> Method: <strong>KÝ DỮ LIỆU</strong>');
        }
        return true;
    };

    

    /**
     * Called after change wizard step
     * @param {any} e Wizard event
     */
    Signature.prototype.wizardAfterChange = function (e) {
        switch (this.wizard.current().index) {
            case 1:
                this.loadCertificate();                
                break;            
            default:
                break;
        }
    };        

    /**
     * Load certificate list from server
     * 
     * @param {any} e Event 
     */
    Signature.prototype.loadCertificate = function (e) {
        if (this.certificate !== null) {
            return;
        }
        console.log('loading certificate...');

        let self = this;
        $.ajax({
            method: "POST",
            url: "/Signature/LoadCertificate",            
            beforeSend: function () {
                $('#signature-cert-loader').css('display', 'flex');
                $('#signature-cert-loader').find('.loader-message').text('Đang tải thông tin chữ ký số...');
            }
        }).done(function (response) {
            $('#signature-cert-loader').css('display', 'none');
            if (response.ResponseCode === 0) {
                if (response.Content === null || response.Content.length < 1) {
                    $('#cert-list-tbl').find('tbody').empty();
                    $('#cert-list-tbl').find('tbody').html('<tr><td><h4 style="color:#ff4c52;">Chưa đăng ký sử dụng chữ ký số tập trung</h4></td></tr><tr><td></td></tr>');
                    $('[data-target="#step-2"]').addClass('error');
                    return;
                }
                var selectedCert = false;
                self.certificates = response.Content;
                
                response.Content[0].Selected = true;
                $.each(response.Content, function (index, cer) {
                    if (cer.Selected) {
                        // selectedCert = true;
                        self.certificate = {
                            CertID: cer.CertID,
                            Email : cer.Email,
                            SerialNumber: cer.SerialNumber,
                            Subject: cer.Subject,
                            Issuer: cer.Issuer,
                            ValidFrom: cer.ValidFrom,
                            ValidTo: cer.ValidTo
                        };
                        self.configCertID = cer.CertID;
                        self.resetCertView();
                    }
                });
                self.viewCertList(response.Content);
                if (selectedCert) {
                    self.wizard.next();
                } else if (response.Content.length === 1) {
                    let cer = response.Content[0];
                    self.certificate = {
                        CertID: cer.CertID,
                        Email: cer.Email,
                        SerialNumber: cer.SerialNumber,
                        Subject: cer.Subject,
                        Issuer: cer.Issuer,
                        ValidFrom: cer.ValidFrom,
                        ValidTo: cer.ValidTo
                    };
                    self.configCertID = cer.CertID;
                    self.resetCertView();
                    $('#set-default-cert').show();
                    // self.wizard.next();
                }
            } else {                
                $('#cert-list-tbl').find('tbody').empty();
                $('#cert-list-tbl').find('tbody').html('<tr><td><h4 style="color:#ff4c52;">Chưa đăng ký sử dụng chữ ký số tập trung hoặc chứng thư số đã hết hạn</h4></td></tr><tr><td></td></tr>');
                $('[data-target="#step-2"]').addClass('error');
            }
        });
    };    

    Signature.prototype.selectCertificate = function (certID) {
        console.log('Selected cert: ', certID);
        const self = this;
        $.each(self.certificates, function (i, cer) {
            if (cer.CertID === certID) {
                if (self.configCertID === certID) {
                    $('#set-default-cert').hide();
                } else {
                    $('#set-default-cert').show();
                }
                self.certificate = cer;
                self.resetCertView();
            }
        });
    };
    

    Signature.prototype.viewCertList = function (certs) {
        const self = this;
        const html = '<tr data-url="panel.tpl" data-toggle="slidePanel">' +
            '<td class="cell-60 tran-file-type responsive-hide" onclick="document.getElementById(\'viewCertList-{{value}}\').click()">' +
            '<img class="img-fluid" src="/Content/Images/CERT_off.png" alt="...">' +
            '</td>' +
                '<td onclick="document.getElementById(\'viewCertList-{{value}}\').click()">' +
            '<h5 class="mt-0 mb-5">Chứng thư số:&nbsp;<small>{{subject}}</small></h5>' +
            // '<h5 class="mt-0 mb-5">Được cấp bởi:&nbsp;<small>{{issuer}}</small></h5>' +
            '<h5 class="mt-0 mb-5">Hiệu lực:&nbsp;<small>{{validity}}</small></h5>' +
            '</td>' +
            '<td class="cell-60" onclick="document.getElementById(\'viewCertList-{{value}}\').click()">' +
            '<div class="radio-custom radio-primary">' +
            '<input type="radio" id="viewCertList-{{value}}" value="{{value}}" data-name="wizard-ignore" name="cert-radios" {{checked}} />' +
            '<label for=""></label>' +
            '</div>' +
            '</td>' +
            '</tr>';
        $('#cert-list-tbl').find('tbody').empty();
        $.each(certs, function (i, cer) {
            var checked = '';
            if (cer.Selected) {
                checked = 'checked';
            }
            $('#cert-list-tbl').find('tbody').append(html.replace('{{subject}}', cer.Subject)
                .replace('{{issuer}}', cer.Issuer)
                .replace('{{validity}}', cer.ValidFrom + ' - ' + cer.ValidTo)
                .replace('{{checked}}', checked)
                .split("{{value}}").join(cer.CertID)
            );
        });

        $('input[name=cert-radios]').change(function () {
            self.selectCertificate(this.value);
        });
    };

    Signature.prototype.resetCertView = function () {
        const subjectIcon = '<i class="icon fa fa-user-o" aria-hidden="true"></i>';
        const issuerIcon = '<i class="icon fa fa-home" aria-hidden="true"></i>';
        const validFromIcon = '<i class="icon fa fa-calendar-minus-o" aria-hidden="true"></i>';
        const validToIcon = '<i class="icon fa fa-calendar-plus-o" aria-hidden="true"></i>';
        const html = '<div class="progress progress-sm" >' +
            '</div >';

        const self = this;
        let cer = self.certificate;

        if (typeof cer !== 'undefined') {
            $('#cert-subject').html(subjectIcon + cer.Subject);
            $('#cert-issuer').html(issuerIcon + cer.Issuer);
            $('#cert-valid-from').html(validFromIcon + cer.ValidFrom);
            $('#cert-valid-to').html(validToIcon + cer.ValidTo);
            if (self.certificates !== null && self.certificates.length > 1) {
                $('#signature-cert-change').css('display', 'block');
                $('#signature-cert-change').click(function () {
                    self.wizard.goTo(1);
                });
            }
            return;
        }

        $('#cert-subject').html(subjectIcon + html);
        $('#cert-issuer').html(issuerIcon + html);
        $('#cert-valid-from').html(validFromIcon + html);
        $('#cert-valid-to').html(validToIcon + html);
    };
    

    Signature.prototype.finisWizard = function () {
        if (this.signPdfAdvanced) {                        
            let options = {
                Callback: this.sign.bind(this), // Hàm callback khi chọn ký dữ liệu
                comments: [],
                signatures: [
                ],
                visibleType: 2, // 1=text_only, 2=text_and_left_image, 3=image_only, 4=text_and_image_top, 5=text_and_background
                fontStyle: 0, // 0=normal, 1=bold, 2=italic, 3=bold-italic, 4=underline
                fontColor: '0000FF', // Màu chữ trên chữ ký, comment
                fontSize: 13, // Fontsize nội dung text trên chữ ký, comment
                fontName: 'Time',
                signatureImg: "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",
                visibleText: 'Ký bởi: ' + this.certificate.Subject + '\nNgày ký: ' + this.getCurrentDate(),                
            };
            self.vnptPdf = $('#pdf-advanced').vnptpdf(options);
            self.vnptPdf.initDataBase64(this.unsignedFile.fileContent);
            self.vnptPdf.start();            
        } else {            
            this.sign();            
        }
    };

    Signature.prototype.getCurrentDate = function () {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        var hh = today.getHours();
        var min = today.getMinutes();
        var ss = today.getSeconds();

        return dd + '/' + mm + '/' + yyyy + " - " + hh + ":" + min + ":" + ss;
    };

    Signature.prototype.sign = function (options) {
        console.log(options)
        console.log('Signing...');
        const self = this;
        let pdfOptionStr = '';
        if (typeof options !== 'undefined') {
            if (options.signatureText === undefined) {
                options.signatureText = "";
            }
            this.pdfOptions = options;
            var pdfOption = {
                Rectangle: options.rectangle,
                Page: options.page,
                FontName: options.fontName,
                FontColor: options.fontColor,
                FontStyle: options.fontStyle,
                Signatures: options.signatures,
                FontSize: options.fontSize,
                VisibleType: options.visibleType,
                SignatureText: options.signatureText,
                Image: options.imageSrc,
                Comment: options.comment,
                TextAlign: options.TextAlign
            };
            pdfOptionStr = JSON.stringify(pdfOption);
        }

        const fileNameSplit = self.unsignedFile.fileName.split(".");
        const fileType = fileNameSplit[fileNameSplit.length - 1].toLowerCase();
        var body = {
            data: self.unsignedFile.fileContent,
            certID: self.certificate.CertID,
            type: fileType,
            name: self.unsignedFile.fileName,
            contentType: self.unsignedFile.fileContentType,
            pdfOptions: pdfOptionStr
        }
        if ($('#prevTranId').val() != null) {
            body = {
                ...body,
                prevTranId: $('#prevTranId').val()
            }
        }
        $.ajax({
            method: "POST",
            url: "/Signature/Sign",
            data: body,
            async: true,
            beforeSend: function () {
                $('.finish-signature-loader').css('display', 'flex');
                $('.finish-signature-loader').find('.loader-message').text('Đang thực hiện giao dịch ký số...');
            }
        }).done(function (response) {
            $('.finish-signature-loader').css('display', 'none');
            console.log(response);
            if (response.ResponseCode === 1) {
                console.log('No 2fa required');
                $('#signature-page').empty();
                $('#signature-page').html(sign_complete);
            }
            else if (response.ResponseCode === 53) {
                console.log('2fa handling...');
                self.twoFactorHandle(response);
                return;
            } else {
                showMessage("Ký dữ liệu thất bại. " + response.ResponseContent, "error");
            }
        });
    };

    Signature.prototype.signPdfWithOptions = function (options) {
        console.log('Signing pdf with options...');
        this.pdfOptions = options;
        console.log(options);
        var pdfOption = {
            Rectangle: options.rectangle,
            Page: options.page,
            FontSize: options.fontSize,
            VisibleType: options.visibleType,
            Image: options.imageSrc,
            Comment: options.comment
        };
    };

    Signature.prototype.twoFactorHandle = function (response) {
        const self = this;
        switch (response.Content.AuthType) {
            case 'OTP_SMS':            
                $('#otpModal input[name="transID"]').val(response.Content.TranID);
                $('#otpModal').modal({ backdrop: "static"}).on('shown.bs.modal', function () {
                    $('#otp-val').focus();
                    document.getElementById("otp-val").onkeypress = function(event){
                        var keycode = (event.keyCode ? event.keyCode : event.which);
                        if (keycode === 13) {                            
                            self.otpConfirm();
                        }
                    }
                });
                $('#otp-submit').click(function () {
                    self.otpConfirm();
                });
                break;
            case 'APP_AUTHEN':                
                $('#number-otp').html(response.Content.AuthContent);
                $('#appAuthenModal').modal({ backdrop: "static" }).on('shown.bs.modal', function () { });
                self.appAuthenConfirm(response.Content.TranID);
                break;
            default:
                console.error('undefied 2fa.');
        }
    };

    Signature.prototype.checkTransactionStatus = function () {

    };
    Signature.prototype.appAuthenConfirm = function (transID) {
        $.ajax({
            method: "POST",
            url: "/Signature/TwoFactorConfirm",
            data: {
                key: 'app_authen',                
                transID: transID
            },
            async: true,            
        }).done(function (response) {
            toastr.clear();
            $('.finish-signature-loader').css('display', 'none');
            if (response.ResponseCode === 1) {
                console.log('Signing complete');
                $('#appAuthenModal').modal('hide');                
                $('#signature-page').empty();
                $('#signature-page').html(sign_complete);
            }
            else {
                $('#appAuthenModal').modal('hide');
                showMessage("Ký dữ liệu thất bại. " + response.ResponseContent, "error");
            }
        });
    }

    Signature.prototype.otpConfirm = function () {        
        $.ajax({
            method: "POST",
            url: "/Signature/TwoFactorConfirm",
            data: {
                key: 'otp',
                value: $('#otp-val').val(),
                transID: $('#transID-val').val()
            },
            async: true,
            beforeSend: function () {
                $('#otpModal').modal('hide');
                $('#otp-submit').unbind('click');
                $('.finish-signature-loader').css('display', 'flex');
                $('.finish-signature-loader').find('.loader-message').text('Đang hoàn tất giao dịch...');
            }
        }).done(function (response) {
            toastr.clear();
            $('.finish-signature-loader').css('display', 'none');
            if (response.ResponseCode === 1) {
                console.log('Signing complete');
                $('#signature-page').empty();
                $('#signature-page').html(sign_complete);
            }
            else {
                $('#otp-val').val("");                
                showMessage("Ký dữ liệu thất bại. " + response.ResponseContent, "error");
            }
        });
    };        
    
    

    

    const filetypes = {
        'application/pdf': '<i class="icon fa fa-file-pdf-o" aria-hidden="true"></i>',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '<i class="icon fa fa-file-word-o" aria-hidden="true"></i>',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': '<i class="icon fa fa-file-powerpoint-o" aria-hidden="true"></i>',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '<i class="icon fa fa-file-excel-o" aria-hidden="true"></i>',
        'text/plain': '<i class="icon fa fa-file-code-o" aria-hidden="true"></i>',
        'text/xml': '<i class="icon fa fa-file-code-o" aria-hidden="true"></i>'
    };

    const sign_complete = '<div class="row" data-plugin="matchHeight" data-by-row="true">' +
        '<div class="col-md-10 offset-md-1">' +
        '<div class="panel panel-bordered panel-primary" id="signature-wizard">' +
        '<div class="panel-body sign-complete">' +
        '<div class="my-pearl-icon pearl-icon"><i class="icon fa-check" aria-hidden="true"></i></div>' +
        '<div class="sign-complete-text">' +
        '<h3>KÝ SỐ HOÀN TẤT!</h3>' +
        '<span>Dữ liệu của Quý khách đã được ký số trên hệ thống UIC Ký số. Tra cứu lịch sử giao dịch tại <a href="/Transactions/Index"><strong>ĐÂY</strong></a></span>' +
        '<br /><br />' +
        '<div class="sign-complete-act col-md-6 offset-md-3">' +
        '<a class="btn btn-block btn-round btn-success" href="/transactions/download">Tải về tệp đã ký</a>' +
        '</div>' +
        '<div class="sign-complete-act col-md-6 offset-md-3">' +
        '<a href="/Signature/Index">Giao dịch mới</a>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
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
            $('.my-pearl .pearl-icon').html(icon);
        },
        buttonLabels: {
            next: 'TIẾP THEO',
            back: 'QUAY LẠI',
            finish: 'KÝ SỐ'
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
        var vnptSignature;
        if (!$.data(this, pluginName)) {
            vnptSignature = new Signature(this, options);
            $.data(this, pluginName, vnptSignature);
        }
        return vnptSignature;
    };
    return Signature;

}));
