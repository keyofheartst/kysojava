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
    var _files;
    var _items = [];
    const _actionBtns = '<button class="btn btn-pure red-600 cancel-file pull-right" id=""><i class="icon wb-trash" aria-hidden="true" title="Hủy chọn file"></i></button>';
    const fileEmptyError = 'Chưa chọn tệp cần ký';

    const VNPT_SIGNSERVER = 'VNPT SignServer';
    const VNPT_PLUGIN = 'VNPT Plugin';
    const allowedFileExtensions = ['pdf', 'xml', 'docx', 'xlsx', 'pptx', 'txt'];
    const fileExtensionError = 'Định dạng chưa được hỗ trợ (' + allowedFileExtensions.join(', ') + ')';

    const MAX_FILE_SIZE = -1;
    const fileMaxSizeError = 'Vượt quá dung lượng file cho phép ký là ' + filesize(MAX_FILE_SIZE);

    const MAX_FILE_UPLOAD = -1;
    const fileMaxFileError = 'Vượt quá số lượng file cho phép ký là ' + MAX_FILE_UPLOAD + ' file';

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
        this.signTool = $('#sign-tool').val();
        this.signToolDesc = '';
        switch (this.signTool) {
            case 'VNPT SignServer':
                this.signToolDesc = 'Sử dụng Chữ ký số tập trung';
                break;
            case 'VNPT Plugin':
                this.signToolDesc = 'Sử dụng USB Token';
                break;
        }
        $('#sign-tool-name').text(this.signToolDesc);

        const self = this;
        signatureSelf = this;
        this.resetCertView();
        this.resetGroupView();

        if ($('#fileContent').val()) {
            $('#signature-title').text('Ký xác nhận');
            this.initData($('#fileName').val(), $('#fileType').val(), $('#fileSize').val(), $('#fileContent').val());
            $('#input-file-max-fs').attr('disabled', 'disabled');
        }

        this.dropifyEvt = $('#input-file-max-fs').dropify({
            CallBack: self.selectFileCallback.bind(self),
            tpl: {
                wrap: '<div class="dropify-wrapper-multiple dropify-wrapper"></div>',
                loader: '<div class="dropify-loader"></div>',
                message: '<div class="dropify-message"><span class="file-icon" /> <p>{{ default }}</p></div>',
                preview: '',
                filename: '<p class="dropify-filename"><span class="file-icon"></span> <span class="dropify-filename-inner"></span></p>',
                clearButton: '<button type="button" class="dropify-clear">{{ remove }}</button>',
                errorLine: '<p class="dropify-error">{{ error }}</p>',
                errorsContainer: '<div class="dropify-errors-container"><ul></ul></div>'
            },
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
            allowedFileExtensions: allowedFileExtensions
        });
        this.dropifyEvt.on('dropify.errors', function (event, element) {
            self.dropifyErrors();
        });
        //AnhHM bổ sung
        $('#input-file-max-fs').change(function () {
            $("#tblFiles").empty();
            $('#tblFiles').html('');
            _files = this.files;
            _items = [];
            for (var i = 0; i < _files.length; i++) {
                _items.push(_files[i]);
            }
            var myvar = '<tr>' +
                '<td class="text-center">STT</td>' +
                '<td>NAME</td>' +
                '<td class="text-right">SIZE</td>' +
                '<td class="action text-right" id="ACTION_ID">TYPE</td>' +
                '</tr>';
            for (i = 0; i < _items.length; i++) {
                var fileId = i + 1;
                var row = myvar.replace('STT', fileId);
                row = row.replace('NAME', _items[i].name);
                row = row.replace('SIZE', filesize(_items[i].size));
                row = row.replace('ACTION_ID', 'action_' + i);
                row = row.replace('TYPE', _actionBtns);
                $("#tblFiles").append(row);
            }
            $('.cancel-file').click(function () {
                var tr = $(this).closest('tr');
                var index = parseInt(tr.find('td:first').text()) - 1;
                var table = tr.parent();
                _items.splice(index, 1);
                tr.remove();
                //Ghi l
                table.find('tr td:first-child').each(function () {
                    $(this).html((parseInt(this.parentElement.rowIndex) + 1));
                });
                self.validateFiles();
            })
            document.getElementById('input-file-max-fs').value = null;
        });
        // End
        this.certLadda = Ladda.create(document.querySelector('#set-default-cert-btn'));

        $('#set-default-cert-btn').click(function () {
            self.setDefaultCertificate();
        });
        this.groupLadda = Ladda.create(document.querySelector('#set-default-group-btn'));
        $('#set-default-group-btn').click(function () {
            self.setDefaultGroup();
        });

        this.wizardPlugin = $("#signature-wizard").wizard(_wizardOptions);
        this.wizard = this.wizardPlugin.data('wizard');
        this.wizardPlugin.on('wizard::afterChange', this.wizardAfterChange.bind(this));
        this.wizardPlugin.on('wizard::finish', this.finisWizard.bind(this));

        // Set validate input files handle
        this.wizard.get('#step-1').setValidator(this.validateFiles.bind(this));
        this.wizard.get('#step-2').setValidator(this.validateCertificate.bind(this));
        this.wizard.get('#step-3').setValidator(this.validatePayment.bind(this));


        $('#search-partner-btn').click(function () {
            self.searchPartner();
        });
        $('#search-partner-input').keypress(function (e) {
            if (e.which === 13) {
                self.searchPartner();
            }
        });

        var confirmFile = {
            name: "test.pdf",
            type: "application/pdf",
            size: 2222
        };

        $('#share-tran-submit').click(function () {
            self.shareTransaction();
        });
    };
    //Bổ sung cho multiple files

    Signature.prototype.dropifyErrors = function () {
        $('[data-target="#step-1"]').addClass('error');
        $('[data-wizard="next"]').addClass('disabled');
    }
    //End

    Signature.prototype.shareTransaction = function () {
        $.ajax({
            url: "/signature/sharetran",
            method: 'POST',
            data: {
                partnerEmail: $('#partner-email').val(),
                message: $('#share-tran-mesg').val()
            },
            async: true,
            beforeSend: function () {
                $('#shareTranModal').modal('hide');
                $('.finish-signature-loader').css('display', 'flex');
                $('.finish-signature-loader').find('.loader-message').text('Đang chuyển tới đối tác...');
            },
            error: function () {
                $('.finish-signature-loader').css('display', 'none');
                showMessage('Đã có lỗi xảy ra', 'error');
            }
        }).done(function (response) {
            $('.finish-signature-loader').css('display', 'none');
            if (response.ResponseCode === 1) {
                showMessage('Đã chuyển tệp tới đối tác', 'info');
            } else {
                showMessage('Lỗi chuyển tệp tới đối tác. ' + response.ResponseContent, 'info');
            }
        });

    };

    Signature.prototype.searchPartner = function () {
        $('#cert-list').empty();
        $('.example-loading').show();
        $.ajax({
            url: "/home/searchforpartner",
            data: {
                keyword: $('#search-partner-input').val()
            },
            async: true,
            beforeSend: function () {
                $('#search-partner-loader').css('display', 'flex');
            },
            error: function () {
                $('#search-partner-loader').css('display', 'none');
            }
        }).done(function (result) {
            console.log(result);
            $('#search-partner-loader').css('display', 'none');
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

    Signature.prototype.initData = function (name, contentType, size, base64Data) {
        $('#file-name').text(name);
        $('#file-size').text(size);
        $('#file-content-type').text(contentType);
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
        this.unsignedFiles = _items;
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

    Signature.prototype.validateFilesShowError = function (textErrors) {
        if (textErrors !== null && textErrors.length > 0) {
            $(".dropify-wrapper-multiple.dropify-wrapper").addClass("has-error");
            $('[data-target="#step-1"]').addClass('error');
            $('.my-pearl').addClass('error');
            $('[data-wizard="next"]').addClass('disabled');
            if (textErrors[0] === undefined) {
                $('.dropify-errors-container').find('ul').html('<li>' + textError + '</li>');
            }
            else {
                if (textErrors.length > 0) {
                    var html = "";
                    for (var i = 0; i < textErrors.length; i++) {
                        html += '<li>' + textErrors[i] + '</li>';
                    }
                    $('.dropify-errors-container').find('ul').html(html);
                }
            }
        }
    }

    /**
     * Validate input files
     * @returns {boolean} return true if input files seem good
     * */
    Signature.prototype.validateFiles = function () {
        const self = this;
        var result = !(this.unsignedFiles === null || this.unsignedFiles.length === 0);
        var listErrors = [];
        var listRowErrors = [];

        $(".dropify-wrapper-multiple.dropify-wrapper").removeClass("has-error");
        $('[data-target="#step-1"]').removeClass('error');
        $('.my-pearl').removeClass('error');
        $('[data-wizard="next"]').removeClass('disabled');
        $('.dropify-errors-container').find('ul').html('');

        if (!result) {
            listErrors.push(fileEmptyError);
        } else {
            //Validate số lượng file upload
            if (MAX_FILE_UPLOAD != -1 && this.unsignedFiles.length > MAX_FILE_UPLOAD) {
                listErrors.push(fileMaxFileError);
                result = false;
            }

            for (var i = 0; i < this.unsignedFiles.length; i++) {
                var file = this.unsignedFiles[i];
                var extension = file.name.split(".").reverse()[0];
                var size = file.size;
                //Validate loại file upload
                if (allowedFileExtensions.indexOf(extension) === -1) {
                    if (listErrors.indexOf(fileExtensionError) === -1)
                        listErrors.push(fileExtensionError);
                    listRowErrors.push(i);
                    result = false;
                }
                if (MAX_FILE_SIZE !== -1 && size > MAX_FILE_SIZE) {
                    if (listErrors.indexOf(fileMaxSizeError) === -1)
                        listErrors.push(fileMaxSizeError);
                    listRowErrors.push(i);
                    result = false;
                }
            }

        }
        //Đánh dấu các row lỗi
        if (listRowErrors.length > 0) {
            var tbl = $("#tblFiles");
            tbl.find("tr").each(function (index, item) {
                if (listRowErrors.indexOf(index) !== -1) {
                    $(this).find("td").each(function () {
                        $(this).css("color", "red")
                    });
                }
            });
        }
        self.validateFilesShowError(listErrors);
        return result;
    };

    /**
     * Validate certificate information
     * @return {boolean} Validated info
     * */
    Signature.prototype.validateCertificate = function () {
        return this.certificate !== null;
    };

    /**
     * Validate payment information
     * @return {boolean} Validated info
     * */
    Signature.prototype.validatePayment = function () {
        if (this.servicegroup === null) {
            return false;
        }

        if (this.unsignedFile === null) {
            self.wizard.goTo(0);
            return false;
        }
        $('#finish-file').html(filetypes[this.unsignedFile.fileContentType] + ' File name: <strong>' + this.unsignedFile.fileName + '</strong> (' + this.unsignedFile.fileSize + ')');
        $('#finish-certificate').html('<i class="icon fa fa-certificate" aria-hidden="true"></i> Certificate: <strong>' + this.certificate.Subject + '</strong> (' + this.certificate.SerialNumber + ')');
        $('#finish-payment').html('<i class="icon fa fa-credit-card" aria-hidden="true"></i> Payment: <strong>' + this.servicegroup.PackName + '</strong> (thuộc ' + this.servicegroup.GroupName + ')');
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
                if (VNPT_SIGNSERVER === this.signTool) {
                    this.loadCertificate();
                } else {
                    this.selectCertFromToken(false);
                }
                break;
            case 2:
                this.loadPaymenInfo();
                break;
            default:
                break;
        }
    };

    /**
     * Select certificate from token
     * @param {any} reload First time or other
     */
    Signature.prototype.selectCertFromToken = function (reload) {
        console.log('Get certificate from token...');
        if (!reload && this.certificate !== null) {
            return;
        }

        const self = this;
        $('.finish-signature-loader').css('display', 'flex');
        $('.finish-signature-loader').find('.loader-message').text('Đang kiểm tra cài đặt VNPT Plugin...');

        // Kiểm tra cài đặt plugin
        vnpt_plugin.checkPlugin().then(function (data) {
            if (data === "1") {
                // Kiểm tra license theo domain
                vnpt_plugin.setLicenseKey(PLUGIN_LICENSE).then(function (data) {
                    if (data === null) {
                        $('.finish-signature-loader').css('display', 'none');
                        showMessage('VNPT Plugin không phản hồi. Vui lòng kiểm tra cài đặt hoặc bật Plugin để tiếp tục.', 'error');
                        return;
                    }
                    var dataJson = JSON.parse(data);
                    if (typeof dataJson === 'undefined') {
                        console.error('Plugin response', data);
                        $('.finish-signature-loader').css('display', 'none');
                        showMessage('VNPT Plugin không phản hồi. Vui lòng kiểm tra cài đặt hoặc bật Plugin để tiếp tục.', 'error');
                        return;
                    }
                    if (dataJson.code !== 1) {
                        $('.finish-signature-loader').css('display', 'none');
                        showMessage(dataJson.error, 'error');
                        return;
                    }

                    $('.finish-signature-loader').find('.loader-message').text('Chọn chứng thư để ký số...');
                    // Chọn chứng thư số
                    vnpt_plugin.getCertInfo().then(function (data) {
                        $('.finish-signature-loader').css('display', 'none');
                        if (data === '') {
                            self.wizard.goTo(0);
                            showMessage('Chưa chọn chữ ký số', 'error');
                            return;
                        }
                        console.log(data);
                        dataJson = JSON.parse(data);
                        if (typeof dataJson === 'undefined') {
                            console.error('Plugin get certificate response', data);
                            showMessage('Không lấy được thông tin chứng thư trong Token', 'error');
                            return;
                        }

                        self.certificate = {
                            SerialNumber: dataJson.serial,
                            Subject: dataJson.subjectCN,
                            Issuer: dataJson.issuerCN,
                            ValidFrom: dataJson.notBefore,
                            ValidTo: dataJson.notAfter
                        };
                        self.resetCertView();
                        self.viewCertificateFromToken();
                        self.wizard.next();
                    });
                });
            }
            else {
                $('.finish-signature-loader').css('display', 'none');
                showMessage("VNPT-CA Plugin chưa được cài đặt hoặc chưa được bật", 'error');
            }
        }).catch(function (e) {
            $('.finish-signature-loader').css('display', 'none');
            showMessage("VNPT-CA Plugin chưa được cài đặt hoặc chưa được bật", 'error');
        });
    };

    /**
     * View certificate selected from token
     * */
    Signature.prototype.viewCertificateFromToken = function () {
        const self = this;
        $('#cert-list-change').unbind('click');
        const html = '<tr data-url="panel.tpl" data-toggle="slidePanel">' +
            '<td class="cell-60 tran-file-type responsive-hide">' +
            '<img class="img-fluid" src="/Content/Images/CERT_off.png" alt="...">' +
            '</td>' +
            '<td>' +
            '<h5 class="mt-0 mb-5">Cấp cho:&nbsp;<small>{{subject}}</small></h5>' +
            '<h5 class="mt-0 mb-5">Được cấp bởi:&nbsp;<small>{{issuer}}</small></h5>' +
            '<h5 class="mt-0 mb-5">Hiệu lực:&nbsp;<small>{{validity}}</small></h5>' +
            '</td>' +
            '<td class="cell-60">' +
            '<button class="btn btn-primary" id="cert-list-change">Thay đổi</button>' +
            '</td>' +
            '</tr>';
        const cer = this.certificate;
        $('#cert-list-tbl').find('tbody').append(html.replace('{{subject}}', cer.Subject)
            .replace('{{issuer}}', cer.Issuer)
            .replace('{{validity}}', cer.ValidFrom + ' - ' + cer.ValidTo)
            .replace('{{checked}}', 'checked')
            .replace('{{value}}', cer.CertID)
        );
        $('#cert-list-change').click(function () {
            self.selectCertFromToken(true);
        });

        $('#signature-cert-change').css('display', 'block');
        $('#signature-cert-change').click(function () {
            self.wizard.goTo(1);
            self.selectCertFromToken(true);
        });
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
            url: "/signature/loadcertificate",
            async: true,
            beforeSend: function () {
                $('#signature-cert-loader').css('display', 'flex');
                $('#signature-cert-loader').find('.loader-message').text('Đang tải thông tin chữ ký số...');
            }
        }).done(function (response) {
            $('#signature-cert-loader').css('display', 'none');
            if (response.ResponseCode === 0) {
                if (response.Content === null || response.Content.length < 1) {
                    $('#cert-list-tbl').find('tbody').empty();
                    $('#cert-list-tbl').find('tbody').html('<tr><td><h4 style="color:#ff4c52;">Chưa đăng ký sử dụng chữ ký số tập trung</h4></td></tr><tr><td><span>Vui lòng đăng ký tại <a href="/certificates/requestcert">ĐÂY</a>. Hoặc liên hệ với VNPT theo số <strong>18001260</strong> để được hỗ trợ.</span></td></tr>');
                    $('[data-target="#step-2"]').addClass('error');
                    return;
                }
                var selectedCert = false;
                self.certificates = response.Content;
                $.each(response.Content, function (index, cer) {
                    if (cer.Selected) {
                        selectedCert = true;
                        self.certificate = {
                            CertID: cer.CertID,
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
                }
            } else {
                console.log('Error', response.ResponseContent);
            }
        });
    };

    /**
     * 
     * @param {any} e load payment
     */
    Signature.prototype.loadPaymenInfo = function (e) {
        if (this.servicegroup !== null) {
            return;
        }
        console.log('Loading payment information...');
        const self = this;
        $.ajax({
            method: "POST",
            url: "/signature/loadpaymentinfo",
            async: true,
            beforeSend: function () {
                $('#signature-payment-loader').css('display', 'flex');
                $('#signature-payment-loader').find('.loader-message').text('Đang tải thông tin thanh toán...');
            }
        }).done(function (response) {
            $('#signature-payment-loader').css('display', 'none');
            if (response.ResponseCode === 0) {
                console.log(response.Content);
                if (response.Content === null || response.Content.length < 1) {
                    $('#group-list-tbl').find('tbody').empty();
                    $('#group-list-tbl').find('tbody').html('<tr><td><h4 style="color:#ff4c52;">Không tìm thấy thông tin thanh toán dịch vụ</h4></td></tr><tr><td><span>Vui lòng liên hệ với VNPT theo số <strong>18001260</strong> để được hỗ trợ.</span></td></tr>');
                    $('[data-target="#step-3"]').addClass('error');
                    return;
                }
                var selectedGroup = false;
                self.groups = response.Content;
                $.each(response.Content, function (index, cer) {
                    if (cer.Selected) {
                        selectedGroup = true;
                        self.servicegroup = {
                            GroupID: cer.GroupID,
                            GroupName: cer.GroupName,
                            PackName: cer.PackName,
                            Period: cer.Period,
                            ExpiredDate: cer.ExpiredDate
                        };
                        self.configGroupID = cer.GroupID;
                        self.resetGroupView();
                    }

                });
                self.viewPaymentList(response.Content);
                if (selectedGroup) {
                    self.wizard.next();
                }
            } else {
                $('[data-target="#step-3"]').addClass('error');
                const h = '<div class="error-comp">' +
                    '<h3>Không tải được thông tin thanh toán</h3>' +
                    '<p>Nguyên nhân: <strong>Chưa mua gói cước, gói cước hết hạn hoặc hết lượt ký.</strong></p>' +
                    '</div>';
                $('#group-list-tbl').find('tbody').html(h);
            }
        });
    };

    Signature.prototype.viewPaymentList = function (groups) {
        const self = this;
        const html = '<tr data-url="panel.tpl" data-toggle="slidePanel">' +
            '<td class="cell-60 tran-file-type responsive-hide" onclick="document.getElementById(\'viewPaymentList-{{value}}\').click()">' +
            '<img class="img-fluid" src="/Content/Images/PAYMENT_off_old.png" alt="...">' +
            '</td>' +
            '<td onclick="document.getElementById(\'viewPaymentList-{{value}}\').click()">' +
            '<h5 class="mt-0 mb-5">Tổ chức/doanh nghiệp:&nbsp;<small>{{subject}}</small></h5>' +
            '<h5 class="mt-0 mb-5">Tên gói cước:&nbsp;<small>{{issuer}}</small></h5>' +
            '<h5 class="mt-0 mb-5">Số lượt ký còn lại:&nbsp;<small>{{validity}}</small></h5>' +
            '<h5 class="mt-0 mb-5">Ngày hết hạn:&nbsp;<small>{{expiredDate}}</small></h5>' +
            '</td>' +
            '<td class="cell-60" onclick="document.getElementById(\'viewPaymentList-{{value}}\').click()">' +
            '<div class="radio-custom radio-primary">' +
            '<input type="radio" id="viewPaymentList-{{value}}" value="{{value}}" data-name="wizard-ignore" name="payment-radios" {{checked}} />' +
            '<label for=""></label>' +
            '</div>' +
            '</td>' +
            '</tr>';
        $('#group-list-tbl').find('tbody').empty();
        $.each(self.groups, function (i, cer) {
            var checked = '';
            if (cer.Selected) {
                checked = 'checked';
            }
            $('#group-list-tbl').find('tbody').append(html.replace('{{subject}}', cer.GroupName)
                .replace('{{issuer}}', cer.PackName)
                .replace('{{validity}}', cer.Period)
                .replace('{{expiredDate}}', cer.ExpiredDate)
                .replace('{{checked}}', checked)
                .split("{{value}}").join(cer.GroupID)
            );
        });

        $('input[name=payment-radios').change(function () {
            self.selectPayment(this.value);
        });
    };

    Signature.prototype.selectPayment = function (groupID) {
        console.log('Selected group: ', groupID);
        console.log('Groups: ', this.groups);
        const self = this;
        $.each(self.groups, function (i, group) {
            if (group.GroupID === groupID) {
                if (self.configGroupID === groupID) {
                    $('#set-default-group').hide();
                } else {
                    $('#set-default-group').show();
                }
                self.servicegroup = group;
                self.resetGroupView();
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

    Signature.prototype.setDefaultCertificate = function () {
        console.log('Set default certificate: ', this.certificate);
        const self = this;
        $.ajax({
            method: "POST",
            url: "/signature/setdefaultconfig",
            data: {
                key: 'cert',
                value: this.certificate.CertID
            },
            async: true,
            beforeSend: function () {
                self.certLadda.toggle();
                self.certLadda.start();
                $('#signature-cert-loader').css('display', 'flex');
                $('#signature-cert-loader').find('.loader-message').text('Đang đặt chữ ký số mặc định...');
            }
        }).done(function (response) {
            $('#signature-cert-loader').css('display', 'none');
            self.certLadda.toggle();
            self.certLadda.stop();
            if (response !== null && response.ResponseCode === 1) {
                self.configCertID = self.certificate.certID;
                $('#set-default-cert').hide();
                showMessage('Đặt chữ ký số mặc định thành công', 'info');
            } else {
                showMessage('Không thể đặt chữ ký số mặc định. ' + response.ResponseContent, 'error');
            }
        });
    };

    Signature.prototype.setDefaultGroup = function () {
        console.log('Set default group: ', this.servicegroup);
        const self = this;
        $.ajax({
            method: "POST",
            url: "/signature/setdefaultconfig",
            data: {
                key: 'group',
                value: this.servicegroup.GroupID
            },
            async: true,
            beforeSend: function () {
                self.groupLadda.toggle();
                self.certLadda.start();
                $('#signature-payment-loader').css('display', 'flex');
                $('#signature-payment-loader').find('.loader-message').text('Đang đặt thông tin thanh toán mặc định...');
            }
        }).done(function (response) {
            $('#signature-payment-loader').css('display', 'none');
            self.groupLadda.toggle();
            self.groupLadda.stop();
            if (response !== null && response.ResponseCode === 1) {
                self.configGroupID = self.servicegroup.GroupID;
                $('#set-default-group').hide();
                showMessage('Đặt thông tin thanh toán thành công', 'info');
            } else {
                showMessage('Không thể thông tin thanh toán mặc định. ' + response.ResponseContent, 'error');
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
            '<h5 class="mt-0 mb-5">Cấp cho:&nbsp;<small>{{subject}}</small></h5>' +
            '<h5 class="mt-0 mb-5">Được cấp bởi:&nbsp;<small>{{issuer}}</small></h5>' +
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
        debugger;
        $.each(certs, function (i, cer) {
            var checked = '';
            if (cer.Selected) {
                checked = 'checked';
            }
            $('#cert-list-tbl').find('tbody').append(html.replace('{{subject}}', cer.Subject)
                .replace('{{issuer}}', cer.Subject)
                .replace('{{validity}}', cer.ValidFrom + ' - ' + cer.ValidTo)
                .replace('{{checked}}', checked)
                .split("{{value}}").join(cer.CertID)
            );
        });

        $('input[name=cert-radios').change(function () {
            self.selectCertificate(this.value);
        });
    };

    Signature.prototype.resetCertView = function () {
        const subjectIcon = '<i class="icon fa fa-user-o" aria-hidden="true"></i>';
        const issuerIcon = '<i class="icon fa fa-home" aria-hidden="true"></i>';
        const validFromIcon = '<i class="icon fa fa-calendar-minus-o" aria-hidden="true"></i>';
        const validToIcon = '<i class="icon fa fa-calendar-plus-o" aria-hidden="true"></i>';
        const html = '<div class="progress progress-sm" >' +
            '<div class="progress-bar progress-bar-indicating active" style="width: 100%;" role="progressbar"></div>' +
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

    Signature.prototype.resetGroupView = function () {
        const groupNameIcon = '<i class="icon fa fa-building-o" aria-hidden="true"></i>';
        const packNameIcon = '<i class="icon fa fa-home" aria-hidden="true"></i>';
        const periodIcon = '<i class="icon fa fa-circle-o-notch" aria-hidden="true"></i>';
        const expireIcon = '<i class="icon fa fa-calendar-plus-o" aria-hidden="true"></i>';
        const html = '<div class="progress progress-sm" >' +
            '<div class="progress-bar progress-bar-indicating active" style="width: 100%;" role="progressbar"></div>' +
            '</div >';

        const self = this;
        const group = self.servicegroup;
        if (typeof group !== 'undefined') {
            $('#group-name').html(groupNameIcon + group.GroupName);
            $('#group-package').html(packNameIcon + group.PackName);
            $('#group-period').html(periodIcon + group.Period);
            $('#group-expired-date').html(expireIcon + group.ExpiredDate);
            if (self.groups !== null && self.groups.length > 1) {
                $('#signature-payment-change').css('display', 'block');
                $('#signature-payment-change').click(function () {
                    self.wizard.goTo(2);
                });
            }
            return;
        }

        $('#group-name').html(groupNameIcon + html);
        $('#group-package').html(packNameIcon + html);
        $('#group-period').html(periodIcon + html);
        $('#group-expired-date').html(expireIcon + html);
    };

    Signature.prototype.finisWizard = function () {
        console.log(this.signPdfAdvanced);
        //$('#signature-page').empty();
        //$('#signature-page').html(sign_complete);
        if (this.signPdfAdvanced) {
            if (VNPT_PLUGIN === this.signTool) {
                this.pluginSignAdvanced(true);
            } else {
                self.vnptPdf = $('#pdf-advanced').vnptpdf({ Callback: this.sign.bind(this) });
                self.vnptPdf.initDataBase64(this.unsignedFile.fileContent);
                self.vnptPdf.start();
            }
        } else {
            if (VNPT_PLUGIN === this.signTool) {
                this.pluginSign();
            } else {
                this.sign();
            }
        }
    };

    Signature.prototype.sign = function (options) {
        console.log('Signing...');
        const self = this;

        let pdfOptionStr = '';
        if (typeof options !== 'undefined') {
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
            pdfOptionStr = JSON.stringify(pdfOption);
        }

        const fileNameSplit = self.unsignedFile.fileName.split(".");
        const fileType = fileNameSplit[fileNameSplit.length - 1].toLowerCase();
        var files = _items;

        var formdata = new FormData();
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            formdata.append('files', file);
        }
        formdata.append('certID', self.certificate.CertID);
        formdata.append('groupID', self.servicegroup.GroupID);

        $.ajax({
            method: "POST",
            processData: false,
            contentType: false,
            url: "/signature/SignMultiple",
            data: formdata,
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
            case 'SMART_OTP':
                $('#otpModal').modal({ backdrop: "static" });
                $('#otp-submit').click(function () {
                    self.otpConfirm();
                });
                break;
            case 'QR_CODE':
                console.log('QRCode required...');
                window.location.href = response.Content.AuthContent.QrCodeUrl;
                break;
            default:
                console.error('undefied 2fa.');
        }
    };

    Signature.prototype.otpConfirm = function () {
        $.ajax({
            method: "POST",
            url: "/signature/twofactorconfirm",
            data: {
                key: 'otp',
                value: $('#otp-val').val()
            },
            async: true,
            beforeSend: function () {
                $('#otpModal').modal('hide');
                $('#otp-submit').unbind('click');
                $('.finish-signature-loader').css('display', 'flex');
                $('.finish-signature-loader').find('.loader-message').text('Đang hoàn tất giao dịch...');
            }
        }).done(function (response) {
            $('.finish-signature-loader').css('display', 'none');
            if (response.ResponseCode === 1) {
                console.log('Signing complete');
                $('#signature-page').empty();
                $('#signature-page').html(sign_complete);
            }
            else {
                showMessage("Ký dữ liệu thất bại. " + response.ResponseContent, "error");
            }
        });
    };

    Signature.prototype.pluginSign = function () {
        this.pluginSignAdvanced(false);
    };

    Signature.prototype.pluginSignAdvanced = function (advanced) {
        var sigOptions = null;
        if (advanced) {
            sigOptions = new PdfSigner();
            sigOptions.AdvancedCustom = true;
        }

        const fileNameSplit = this.unsignedFile.fileName.split(".");
        const fileType = fileNameSplit[fileNameSplit.length - 1].toLowerCase();

        var dataJS = {};
        const self = this;

        var arrData = [];
        dataJS.data = this.unsignedFile.fileContent;
        dataJS.type = fileType;
        dataJS.sigOptions = JSON.stringify(sigOptions);

        var jsData = "";
        jsData += JSON.stringify(dataJS);
        arrData.push(jsData);
        console.log(this.certificate);

        vnpt_plugin.signArrDataAdvanced(arrData, this.certificate.SerialNumber, true).then(function (data) {
            self.pluginSignCallback(fileType, data);
        });
    };

    Signature.prototype.pluginSignCallback = function (fileType, dataJson) {
        var jsObj = JSON.parse(JSON.parse(dataJson)[0]);
        if (jsObj.code !== 0) {
            showPluginResponseMessage(jsObj.code);
            return;
        }

        const self = this;

        $.ajax({
            async: true,
            type: "POST",
            url: "/signature/pluginsigncallback",
            data: {
                signedData: jsObj.data,
                type: fileType,
                name: self.unsignedFile.fileName,
                size: self.unsignedFile.fileSize,
                contentType: self.unsignedFile.fileContentType,
                groupID: self.servicegroup.GroupID
            },
            beforeSend: function () {
                $('.finish-signature-loader').css('display', 'flex');
                $('.finish-signature-loader').find('.loader-message').text('Đang hoàn tất giao dịch...');
            }
        }).done(function (response) {
            $('.finish-signature-loader').css('display', 'none');
            if (response.ResponseCode === 1) {
                console.log('Signing complete');
                $('#signature-page').empty();
                $('#signature-page').html(sign_complete);
            }
            else {
                showMessage("Ký dữ liệu thất bại. " + response.ResponseContent, "error");
            }
        });
    };

    /*
     * 
     *
     */
    Signature.prototype.showPluginResponseMessage = function (data) {
        var err = "Lỗi không xác định";
        switch (data) {
            case 1:
                err = "Dữ liệu đầu vào không đúng định dạng";
                break;
            case 2:
                err = "Không lấy được thông tin chứng thư số";
                break;
            case 3:
                err = "Có lỗi trong quá trình ký số";
                break;
            case 4:
                err = ("Chứng thư số không có khóa bí mật");
                break;
            case 5:
                err = ("Lỗi không xác định");
                break;
            case 6:
                err = ("Ký pdf: không tìm thấy tham số số trang cần ký");
                break;
            case 7:
                err = ("Ký pdf: trang đặt chữ ký không tồn tại");
                break;
            case 8:
                err = ("Ký xml: không tìm thấy thẻ ký số");
                break;
            case 9:
                err = ("Ký pdf: không tìm thấy id của thẻ ký số");
                break;
            case 10:
                err = ("Dữ liệu ký đã chứa một hoặc nhiều chữ ký không hợp lệ");
                break;
            case 11:
                err = ("Người dùng hủy bỏ");
                break;
            default:
                err = ("Lỗi không xác định");
                break;
        }
        showMessage(err, "error");
    }

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
        '<span>Dữ liệu của Quý khách đã được ký số trên dịch vụ VNPT Ký số. Tra cứu lịch sử giao dịch tại <a href="/transactions"><strong>ĐÂY</strong></a></span>' +
        '<br /><br />' +
        '<div class="sign-complete-act col-md-6 offset-md-3">' +
        '<a class="btn btn-block btn-round btn-success" href="/transactions/download">Tải về tệp đã ký</a>' +
        '</div>' +
        '<div class="sign-complete-act col-md-6 offset-md-3">' +
        '<button class="btn btn-primary btn-outline btn-block btn-round" data-target="#examplePositionSidebar" data-toggle="modal">Chuyển tới đối tác</button>' +
        '</div>' +
        '<div class="sign-complete-act col-md-6 offset-md-3">' +
        '<a href="/signature">Giao dịch mới</a>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';

    const PLUGIN_LICENSE = 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48TGljZW5zZSB4bWxuczp4c2Q9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hIiB4bWxuczp4c2k9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlIj48UGhhbk1lbT5WTlBULUNBIFBsdWdpbjwvUGhhbk1lbT48Tmd1b2lDYXA+Vk5QVCBTT0ZUV0FSRTwvTmd1b2lDYXA+PERvblZpRHVvY0NhcD5odHRwOi8vbG9jYWxob3N0OjY0Nzc4PC9Eb25WaUR1b2NDYXA+PE5nYXlCYXREYXU+MDA6MDA6MDA8L05nYXlCYXREYXU+PE5nYXlLZXRUaHVjPjAwOjAwOjAwPC9OZ2F5S2V0VGh1Yz48U2lnbmF0dXJlIElkPSJsaWNlbnNlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnIyI+PFNpZ25lZEluZm8+PENhbm9uaWNhbGl6YXRpb25NZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy14bWwtYzE0bi0yMDAxMDMxNSIgLz48U2lnbmF0dXJlTWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnI3JzYS1zaGExIiAvPjxSZWZlcmVuY2UgVVJJPSIiPjxUcmFuc2Zvcm1zPjxUcmFuc2Zvcm0gQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjZW52ZWxvcGVkLXNpZ25hdHVyZSIgLz48L1RyYW5zZm9ybXM+PERpZ2VzdE1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyNzaGExIiAvPjxEaWdlc3RWYWx1ZT5ROEJNcmhWYTcwbExUWFNYQ1haYnZmNVpCZjQ9PC9EaWdlc3RWYWx1ZT48L1JlZmVyZW5jZT48L1NpZ25lZEluZm8+PFNpZ25hdHVyZVZhbHVlPm4wNTJYT1NWS3dQYTFtRWd0bnE2TXJCby9UVlVabjBpMHAwUXAwRmpoWUk4YlNUTkZXNitXbTNNajE1ZlFkK3NRdmRMdjNwSTI2WXUwNlNPNkx5QW1qc3k4VmZqV3JHeFV4TWJobXE2aUlQSGRlcVRGMXVFbHlWMXc5UGk2Rng0YlcvcGsvUkVKejhmSDQ1MHJRMGQzbjdncnlrU3JlZ3hCT2J0Nkp6QTYxM2Q5ZHk2VkpXS3labENRV2Q1L05HWGhIb0pwaHpqT1V2R1U5ZkRhQlEzV2N5NGNnN2l6Mzg4OU5IMWkzdmp4QmxhS21FSmgvbmo2RU9RZXMzeWRxNkl1RlpiTXB2dGVVcnlDdzdYNityN2ZnSlhQNnNlejl5UW1IRmZ6aGJYbkRLWGZDL0taTGcrZ0ltaExidmV3ZFliOE0wam1DRUYyYlNqUGhhZ2ZpRjB2UT09PC9TaWduYXR1cmVWYWx1ZT48S2V5SW5mbz48S2V5VmFsdWU+PFJTQUtleVZhbHVlPjxNb2R1bHVzPnAyOGNVVG5vWEc5VW83NTRwandkWkdIOG1YNFZaUWtBeWtvcWhzQXB2Z1lQeVVRRWtCRTZkOXFzWkwzNkd2MWpGWjF2S2hvbkk2ZkxFeFZyYkhEbTkrRGVLZXpWSVpxUXZMaXM2M2czaHJtelJ0K2Mvb0F6YTZPUnFlQlZWbVBoQ1hPdy9KRHJ3eEgzQ0xacmxSMVhHeG1zcWxqaTcrVk0wcEMvQ0lraWcvNXRGdS9QQ3VUY1RZL05mL3lmbU1UOTdOaXk5Tm5GTlg1Y1FxREVZNWxTQ0Rvb3kwaHBTQ25jWVFzdUxjUUpBZll6dnp3OW9vT2pGallPVXZtY2VtREMxLzBFRTlkYldsV2V0Zm5WTmI4c3pvcXNMQnJMQURCMUNoU2ZubDlvUUZ6R1FWYTBSaUo5eE93UG9KMjVqUWRWaW1FMTh2VE1aV1p0bUdOUzJyKytPUT09PC9Nb2R1bHVzPjxFeHBvbmVudD5BUUFCPC9FeHBvbmVudD48L1JTQUtleVZhbHVlPjwvS2V5VmFsdWU+PFg1MDlEYXRhPjxYNTA5Q2VydGlmaWNhdGU+TUlJR1JUQ0NCQzJnQXdJQkFnSVFWQUVrajN5WFJFSTd3SzdLUi9jSHNqQU5CZ2txaGtpRzl3MEJBUVVGQURCcE1Rc3dDUVlEVlFRR0V3SldUakVUTUJFR0ExVUVDaE1LVms1UVZDQkhjbTkxY0RFZU1Cd0dBMVVFQ3hNVlZrNVFWQzFEUVNCVWNuVnpkQ0JPWlhSM2IzSnJNU1V3SXdZRFZRUURFeHhXVGxCVUlFTmxjblJwWm1sallYUnBiMjRnUVhWMGFHOXlhWFI1TUI0WERURTNNREl5TnpBNU16SXdNRm9YRFRFNU1ESXlOekl4TXpJd01Gb3dnWW94Q3pBSkJnTlZCQVlUQWxaT01SSXdFQVlEVlFRSURBbEl3NEFnVHVHN21Fa3hGVEFUQmdOVkJBY01ERVBodXFkMUlFZHA0YnFsZVRFc01Db0dBMVVFQXd3alZrNVFWQ0JUVDBaVVYwRlNSU0F0SUZaT1VGUWdRMEVnTFNCVVJWTlVJRk5KUjA0eElqQWdCZ29Ka2lhSmsvSXNaQUVCREJKTlUxUTZNVEF4TmpnMk9UY3pPQzB3TVRJd2dnRWlNQTBHQ1NxR1NJYjNEUUVCQVFVQUE0SUJEd0F3Z2dFS0FvSUJBUUNuYnh4Uk9laGNiMVNqdm5pbVBCMWtZZnlaZmhWbENRREtTaXFHd0NtK0JnL0pSQVNRRVRwMzJxeGt2Zm9hL1dNVm5XOHFHaWNqcDhzVEZXdHNjT2IzNE40cDdOVWhtcEM4dUt6cmVEZUd1Yk5HMzV6K2dETnJvNUdwNEZWV1krRUpjN0Q4a092REVmY0l0bXVWSFZjYkdheXFXT0x2NVV6U2tMOElpU0tEL20wVzc4OEs1TnhOajgxLy9KK1l4UDNzMkxMMDJjVTFmbHhDb01Sam1WSUlPaWpMU0dsSUtkeGhDeTR0eEFrQjlqTy9QRDJpZzZNV05nNVMrWng2WU1MWC9RUVQxMXRhVlo2MStkVTF2eXpPaXF3c0dzc0FNSFVLRkorZVgyaEFYTVpCVnJSR0luM0U3QStnbmJtTkIxV0tZVFh5OU14bFptMllZMUxhdjc0NUFnTUJBQUdqZ2dIRk1JSUJ3VEJ3QmdnckJnRUZCUWNCQVFSa01HSXdNZ1lJS3dZQkJRVUhNQUtHSm1oMGRIQTZMeTl3ZFdJdWRtNXdkQzFqWVM1MmJpOWpaWEowY3k5MmJuQjBZMkV1WTJWeU1Dd0dDQ3NHQVFVRkJ6QUJoaUJvZEhSd09pOHZiMk56Y0M1MmJuQjBMV05oTG5adUwzSmxjM0J2Ym1SbGNqQWRCZ05WSFE0RUZnUVViSDRodEZzT2JMRDFrME5vQ1hqeUZUdlpDUXN3REFZRFZSMFRBUUgvQkFJd0FEQWZCZ05WSFNNRUdEQVdnQlFHYWNEVjFRS0tGWTFHZmVsODRtZ0tWYXhxcnpCb0JnTlZIU0FFWVRCZk1GMEdEaXNHQVFRQmdlMERBUUVEQVFFQ01Fc3dJZ1lJS3dZQkJRVUhBZ0l3Rmg0VUFFOEFTUUJFQUMwQVVBQnlBQzBBTWdBdUFEQXdKUVlJS3dZQkJRVUhBZ0VXR1doMGRIQTZMeTl3ZFdJdWRtNXdkQzFqWVM1MmJpOXljR0V3TVFZRFZSMGZCQ293S0RBbW9DU2dJb1lnYUhSMGNEb3ZMMk55YkM1MmJuQjBMV05oTG5adUwzWnVjSFJqWVM1amNtd3dEZ1lEVlIwUEFRSC9CQVFEQWdUd01EUUdBMVVkSlFRdE1Dc0dDQ3NHQVFVRkJ3TUNCZ2dyQmdFRkJRY0RCQVlLS3dZQkJBR0NOd29EREFZSktvWklodmN2QVFFRk1Cd0dBMVVkRVFRVk1CT0JFVEZqYUhWamRYVkFaMjFoYVd3dVkyOXRNQTBHQ1NxR1NJYjNEUUVCQlFVQUE0SUNBUUF5cWlKUHZ2a0NNTUYzQkJpUFozR25laG53dmh0bURSSmpaUlJObWI1MjJMdzh5U3FJcG81N2dYSVNuTGUzcVd5QzBHQ1dhVnMvV0o2VEpnM2ZCMUdhSHAydUpHOGhHVjBnNU1KbmdnQWtXSUhIYmtoa3lYbEtkL3h4dkY3bENXc2xoN09Mby9Ed0p6UGNBUUtkRG1vc0RMa0x1dGxqaXJLZ1AxMThYbVRwSmU5Y25oVEdXeG1SNDNSWG8xcEs2TVpKUy8zNUEwYUVjVUZ3bGt5T0pwRnV6K0dyanEycUsyWXNUcHZOSW53M0xaRHdSa2tZamhtSk9FK2Z1a3FmcDhXRmNCdEVHcVdEYUJibXFnWnZjaXQ5cytSb2kzV2VPTXhVS3JpMGZTQUtEY3V4bmY0cnhpZlEwQmJhczlIVW1ObTY1VkVzbStmNUIwdmRTbTZTN1g4Wm81NHVRdFJnL0hkMWFDUHkwQUZkZmFIaSs2YWRxcjJacTNwdE1JUzEwN2xDZHEyNkt5TjNSTXhZdmg1TlpzZzg4SmM5SU5sR3hMNThXRDlFQjdNekZrV21uR2I5SmMxdWtBRWFQWkE5dndaV1pVQXRwV09JZFR4Tm1VdnNaZGxWQTl2RGMvVG5KUmJVazBhQ3d2cVZXTWFqUFBvenQ4L0N2ekhxd2NPdWdrRnVjNys4TTlSRmkrUnRaWEEra3JUTmduVEtKUkhkMTYzZFdzeTNmcHlGVTlQQWN5a3lUS3FGZmlsRmpOaUc4N1gwTVpycDRsTFJjU3VGa2dIWTZyL2lJa0x2Rk02RElyVEpTeERQM2JYbzlqRmw5UU9hYlNOZm9QeEttNDF1NUdxcGVKWGpsTk5BREkrR050V1E2ZzNaMm11WVdwUzU0TlVkSk5yeUdQeUx4QT09PC9YNTA5Q2VydGlmaWNhdGU+PC9YNTA5RGF0YT48L0tleUluZm8+PE9iamVjdD48U2lnbmF0dXJlUHJvcGVydGllcyBJZD0ic2lnbmF0dXJlUHJvcGVydGllcyI+PFNpZ25hdHVyZVByb3BlcnR5IFRhcmdldD0iI2xpY2Vuc2UiPjxTaWduaW5nVGltZSB4bWxucz0iaHR0cDovL3d3dy5leGFtcGxlLm9yZy8jc2lnbmF0dXJlUHJvcGVydGllcyI+MTcvMDQvMjAxOSAxMToxMzo1MDwvU2lnbmluZ1RpbWU+PC9TaWduYXR1cmVQcm9wZXJ0eT48L1NpZ25hdHVyZVByb3BlcnRpZXM+PC9PYmplY3Q+PC9TaWduYXR1cmU+PC9MaWNlbnNlPg==';

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
