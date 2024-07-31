/*!
 * =============================================================
 * vnptpdf v1.0.2 - PDF Advanced signature helper.
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
        root.VnptPdf = factory(root.jQuery);
    }
}(this, function ($) {
    var pluginName = "vnptpdf";

    /**
     * 
     * @param {any} element Wrapper element
     * @param {any} options Plugin options
     * @param {any} callback Callback function
     */
    function VnptPdf(element, options) {
        var defaults = {
            Callback: null,
            location: '',
            reason: '',
            signatures: [],
            comments: [],
            pdfFile: {
                file: null,
                totalPages: 0
            },
            fontName: 'Time',
            fontSize: 10,
            fontStyle: 3,
            visibleType: 2,
            fontColor: '000000',
            visibleText: 'Ký bởi: _______________\nNgày ký: ' + this.getCurrentDate() + '\nTổ chức xác thực: _ _ _ _ _ _ _ _ _',
            signatureImg: "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",
            useDefaultText: true,
            TextAlign: 1
        };
        this.wrapper = element;
        this.CallBack = options.Callback;        
        this.settings = $.extend(true, defaults, options);
        if ((typeof options.visibleText !== 'undefined') && options.visibleText !== '') {
            this.settings.useDefaultText = false;
        }
        this.pdfPages = [];
        this.show = false;
        
        $('body').append('<div id="dpi" style="height: 1in; left: -100%; position: absolute; top: -100%; width: 1in;"></div>');
    }

    VnptPdf.prototype.getCurrentDate = function () {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        var hh = today.getHours();
        var min = today.getMinutes();
        var ss = today.getSeconds();

        return dd + '/' + mm + '/' + yyyy + " - " + hh + ":" + min + ":" + ss;
    };

    /**
     * */
    VnptPdf.prototype.initUI = function () {
        const self = this;

        // Color picker plugin
        this.wrapper.html(pdfWorkingArea.replace('SIG-COLOR', '#' + this.settings.fontColor));
        jscolor.installByClassName("jscolor");

        // Add comment modal
        this.wrapper.append(_addCommentModal);

        // Add signature view modal
        this.wrapper.append(_addSignatureModal);
        $('#add-signature-modal').find('.pdf-btn').click(function () {
            self.addSignatureHandle();
        });
        $('#sig-font-color').change({ msgTarget: this }, this.changeFontColorEvent);

        //this.changeSignatureVisibleType();
        this.changeSignatureVisibleImg();

        // Add change visible type listener
        this.visibleTypeInput = $('#sign-visible-type-select');
        this.visibleTypeInput.val('' + this.settings.visibleType);
        this.visibleTypeInput.change({ msgTarget: this }, this.changeSignatureVisibleTypeEvent);

        //this.textAlignTypeInput = $('input[name="textAlign"]');
        //this.textAlignTypeInput.change({ msgTarget: this }, this.changeTextAlignOptionEvent);

        this.signatureTextInput = $('#pdf-sign-text');
        this.signatureTextInput.val('' + this.settings.visibleText.replace("\n", '\n'));
        this.signatureTextInput.keyup({ msgTarget: this }, this.updateSignatureTextEvent);

        this.signatureTextDefaultInput = $('#useDefaultText');
        this.signatureTextDefaultInput.change({ msgTarget: this }, this.changeVisibleTextDefault);

        this.fontNameInput = $('#sign-font-type-select');
        this.fontNameInput.change({ msgTarget: this }, this.changeSignatureFontNameEvent);

        $('#sign-font-style-select').val('' + this.settings.fontStyle);
        this.fontNameInput.val(this.settings.fontName);
        $('#sign-font-style-select').change({ msgTarget: this }, this.changeFontStyleEvent);

        $('#pdf-sign-page').val(this.settings.sigPage);
        this.signaturePageBtn = $('#pdf-sign-page-btn');
        this.signaturePageBtn.click({ msgTarget: this }, this.changeSignaturePageEvent);

        this.signatureImgBtn = $('#signature-img-btn');
        this.signatureImgBtn.click({ msgTarget: this }, this.changeSignatureImageEvent);

        this.signatureCommentBtn = $('#add-comment-btn');
        this.signatureCommentBtn.click({ msgTarget: this }, this.addComment);

        this.signatureAddBtn = $('#add-sig-btn');
        this.signatureAddBtn.click({ msgTarget: this }, this.addSignature);

        $(".pdf-action-menu").mCustomScrollbar({
            theme: "minimal-dark"
        });

        $('.pdf-action-menu').append(_menuSwitch);


        $('.page-aside-switch').click(function () {
            let menuW = $('.pdf-action-menu').width();
            $('.pdf-action-menu').css('width', 370 - menuW);
            if (menuW > 0) {
                $('.pdf-action-menu').css('padding', '0');
                $('.pdf-page').css('padding-left', '0');
            } else {
                $('.pdf-action-menu').css('padding', '10px 25px');
                $('.pdf-action-menu').css('padding-top', '45px');
            }
            self.windowResizeEventHandle();
        });

        $('#sig-font-size').asRange();
        $('#sig-font-size').asRange('set', '' + this.settings.fontSize); 
        $('#sig-font-size').on('asRange::change', function (e) {
            self.settings.fontSize = $('#sig-font-size').asRange('get');
            self.setFontSize();
        });

        var coll = document.getElementsByClassName("pdf-collapsible");
        var i;

        for (i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function () {
                this.classList.toggle("active");
                var content = this.nextElementSibling;
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            });
        }
    };

    /**
     * Init pdf data from base64 encode
     * @param {any} base64 pdf data with base64 encoded
     */
    VnptPdf.prototype.initDataBase64 = function (base64) {
        var typedarray = this.convertDataURIToBinary(base64);
        this.initData(typedarray);
    };

    /**
     * Init pdf data from file
     * @param {any} file Pdf data file
     */
    VnptPdf.prototype.initDataFile = function (file) {
        var fileReader = new FileReader();
        var self = this;
        getBase64(file);
        fileReader.onload = function () {
            var typedarray = new Uint8Array(this.result);
            self.initData(typedarray);
        };
        fileReader.readAsArrayBuffer(file);
    };
    function getBase64(file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            console.log(reader.result);
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }
    /**
     * Init pdf data from byte array
     * @param {any} typedarrayData byte[] array pdf data
     */
    VnptPdf.prototype.initData = function (typedarrayData) {
        this.data = typedarrayData;
    };

    VnptPdf.prototype.start = function () {
        var self = this;
        self.initUI();
        PDFJS.getDocument(self.data).then(function (pdf) {
            if (pdf.numPages < self.settings.sigPage) {
                console.error('[Error] >> options[sigPage] is invalid, total pages is %d', pdf.numPages);
                return;
            }

            if (self.settings.useLastPage) {
                self.settings.sigPage = pdf.numPages;
                $('#pdf-sign-page').val(self.settings.sigPage);
            }

            const totalPages = pdf.numPages;
            this.pdfPages = [];

            self.renderPdf(pdf, 1, totalPages);
        });
    };

    /**
     * Render all pdf pages using recursive function
     * @param {any} pdf PDF content
     * @param {any} index page index 
     * @param {any} totalPages Total pages
     */
    VnptPdf.prototype.renderPdf = function (pdf, index, totalPages) {
        const self = this;

        // Recursive stop condition
        if (index > totalPages) {
            self.show = true;
            $('#action-btns').empty();
            $('#action-btns').append('<td>' +
                '                        <button class="pdf-btn" id="pdf-complete">Ký dữ liệu</button>' +
                '                    </td>' +
                '                    <td>' +
                '                        <button class="pdf-btn pdf-btn-error" id="pdf-cancel">Hủy</button>' +
                '                    </td>');

            self.btnSign = $('#pdf-complete');
            self.btnSign.click({ msgTarget: this }, this.complete);

            self.btnCancel = $('#pdf-cancel');
            self.btnCancel.click({ msgTarget: this }, this.reject);
            self.initDefaultSignature();
            self.initSignatures();
            self.initComments();
            return;
        }

        pdf.getPage(index).then(function (page) {
            const dpi = document.getElementById('dpi').offsetWidth;
            var xview = page.getViewport(1);
            self.pdfPages.push({
                width: xview.width,
                height: xview.height
            });
            let canvasId = "pdfPage_" + (index);
            var canvasI = _canvasPdf.replace("ID_VALUE", canvasId);
            $('.pdf-page').append(canvasI);

            var viewport = page.getViewport(1 / 72 * dpi);

            var canvas = document.getElementById(canvasId);
            var context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context.
            var renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            var renderTask = page.render(renderContext);

            renderTask.promise.then(function () {
                $('#' + canvasId).show();
                self.renderPdf(pdf, index + 1, totalPages);
            });
        });
    };

    VnptPdf.prototype.updateSignatureTextEvent = function (evt) {
        const self = evt.data.msgTarget;
        self.settings.visibleText = evt.target.value;
        self.settings.useDefaultText = false;
        self.setVisibleText();
    };

    VnptPdf.prototype.setVisibleText = function () {
        let htmlInner = '<span>' + this.settings.visibleText.replace(/(?:\r\n|\r|\n)/g, '<br>') + '</span>';
        $('.sig-text').html(htmlInner);
        if (!this.settings.useDefaultText) {
            $('#useDefaultText').prop('checked', false); 
        }
    };

    VnptPdf.prototype.changeVisibleTextDefault = function (evt) {
        const self = evt.data.msgTarget;
        self.settings.useDefaultText = evt.target.checked;
    };

    VnptPdf.prototype.changeSignatureFontNameEvent = function (evt) {
        const self = evt.data.msgTarget;
        self.settings.fontName = evt.target.value;
        self.setFontName();
    };

    VnptPdf.prototype.setFontName = function () {
        $('.signaturebox').css('font-family', this.getFontFamily(this.settings.fontName));
        //$('.pdf-comment span').css('font-family', this.getFontFamily());
    };

    VnptPdf.prototype.getFontFamily = function (family) {
        switch (family) {
            case 'Time':
                return '"Times New Roman", Times, serif';
            case 'Roboto':
                return 'Roboto';
            case 'Arial':
                return 'Arial, Helvetica, sans-serif';
            default:
                return '"Times New Roman", Times, serif';
        }
    };

    VnptPdf.prototype.changeFontStyleEvent = function (evt) {
        const self = evt.data.msgTarget;
        self.settings.fontStyle = evt.target.value;
        self.setFontStyle(self.settings.fontStyle);
    };

    /**
     * */
    VnptPdf.prototype.setFontStyle = function () {
        $('.font-style').css('font-weight', '');
        $('.font-style').css('font-style', '');
        $('.font-style').css('font-decoration', '');
        switch ('' + this.settings.fontStyle) {
            case '1':
                $('.font-style').css('font-weight', 'bold');
                break;
            case '2':
                $('.font-style').css('font-style', 'italic');
                break;
            case '3':
                $('.font-style').css('font-style', 'italic');
                $('.font-style').css('font-weight', 'bold');
                break;
            case '4':
                $('.font-style').css('font-decoration', 'underline');
                break;
        }

        $('#sign-font-style-select').find(":selected").css('font-style', 'italic');
    };

    /**
     * 
     * @param {any} evt Change color event
     */
    VnptPdf.prototype.changeFontColorEvent = function (evt) {
        const self = evt.data.msgTarget;
        self.settings.fontColor = evt.target.value;
        self.setFontColor();
    };

    /**
     * */
    VnptPdf.prototype.setFontColor = function () {
        $('.signaturebox').css('color', '#' + this.settings.fontColor);
        //$('.pdf-comment span').css('color', '#' + this.settings.fontColor);
    };

    /**
     * Handle change visible type radio button checked
     * @param {any} evt Radio button checked event
     */
    VnptPdf.prototype.changeSignatureVisibleTypeEvent = function (evt) {
        const self = evt.data.msgTarget;
        self.settings.visibleType = parseInt('' + evt.target.value);
        self.changeSignatureVisibleType();
    };

    /**
     * Handle change text align option
     * @param {any} evt Radio button checked event
     */
    //VnptPdf.prototype.changeTextAlignOptionEvent = function (evt) {
    //    const self = evt.data.msgTarget;
    //    self.settings.TextAlign = parseInt('' + evt.target.value);
    //    console.log(self.settings)
    //    console.log(evt.target.value);
    //    self.changeTextAlignOption();
    //};


    /**
     * Change signature visible type
     * */
    VnptPdf.prototype.changeSignatureVisibleType = function () {
        const boxHtml = this.getSignatureVisibleElement(this.settings.visibleType);
        const self = this;
        this.settings.signatures.forEach(function (box) {
            if (typeof box.element === 'undefined') {
                return;
            }
            let boxContent = box.element.find('.sign-box-content');
            boxContent.empty();
            boxContent.html(boxHtml);
            self.setVisibleText();
            self.setFontName();
            self.setFontStyle();
            self.setFontSize();
            self.setFontColor();
        });
    };

    //VnptPdf.prototype.changeTextAlignOption = function () {
    //    const value = $('input[name="textAlign"]:checked')[0].value;
    //    console.log(value);
    //    if (value == 0) $(".sig-text").css('text-align', 'left');
    //    if (value == 1) $(".sig-text").css('text-align', 'center');
    //    if (value == 2) $(".sig-text").css('text-align', 'right');
    //};

    VnptPdf.prototype.setFontSize = function () {
        const dpi = document.getElementById('dpi').offsetWidth;
        const size = Math.ceil(this.settings.fontSize * dpi / 72);
        $('.signaturebox').css('font-size', size + 'px');
        //$('.pdf-comment span').css('font-size', size + 'px');
    };

    VnptPdf.prototype.changeSignaturePageEvent = function (evt) {
        const self = evt.data.msgTarget;
        const p = Number($('#pdf-sign-page').val());
        if (isNaN(p) || p < 1 || p > self.pdfPages.length) {
            alert("Trang đặt chữ ký không hợp lệ. (Số trang từ 1 đến " + self.pdfPages.length + ")");
            return;
        }

        self.settings.sigPage = p;
        self.initSignatureBox();

    };

    /**
     * 
     * @param {any} evt Select file event
     */
    VnptPdf.prototype.changeSignatureImageEvent = function (evt) {
        const self = evt.data.msgTarget;
        $(document).on(
            'change',
            '#pdf-sign-image-file :file',
            function (event) {
                if (!$(this).get(0).files) {
                    console.log('null');
                    return;
                }

                var input = $(this), numFiles = input.get(0).files ? input
                    .get(0).files.length : 1, label = input.val().replace(
                        /\\/g, '/').replace(/.*\//, '');
                $('#pdf-sign-img-name').val(label);
                var f = input.get(0).files[0];

                var reader = new FileReader();
                reader.addEventListener("load", function () {
                    var prefix = ("" + this.result).substr(0, ("" + this.result).indexOf("base64,") + 7);
                    self.settings.signatureImg = this.result.replace(prefix, "");
                    self.changeSignatureVisibleImg();
                });
                if (f) {
                    reader.readAsDataURL(f);
                }
            });
    };

    /**
     * */
    VnptPdf.prototype.changeSignatureVisibleImg = function () {
        const style = $('#vnptpdf-style');
        if (style) {
            style.remove();
        }
        const styleElem = document.head.appendChild(document.createElement("style"));
        styleElem.innerHTML = ".signature-img::before{background-image: url(data:image/png;base64," + this.settings.signatureImg + ");background-position: center;}";
    };

    /**
     * 
     * @param {any} sig Signature instance 
     * @param {any} index signature page index
     */
    VnptPdf.prototype.initSignature = function (sig, index) {
        const sigHtml = this.getSignatureVisibleElement(this.settings.visibleType).replace('signature_', 'signature_' + index);
        const sigElement = $(_signatureBox).appendTo(this.wrapper.find('.pdf-page'));
        sigElement.find('.sign-box-content').empty();
        sigElement.find('.sign-box-content').html(sigHtml);
        sig.element = sigElement;

        sig.urx = sig.x + sig.width;
        sig.ury = sig.y + sig.height;

        const sigRow = $('<tr></tr>').appendTo('#pdf-signatures-table>tbody');
        sig.signatureRow = sigRow;
        sigRow.append('<td>' + (this.settings.signatures.indexOf(sig) + 1) + '</td>');
        sigRow.append('<td class="sig-rectangle">[' + sig.x + ',' + sig.y + ',' + sig.urx + ',' + sig.ury + ']</td >');
        sigRow.append('<td>' + sig.page + '</td>');

        const actionCell = $('<td class="comment-act">' + _trashIcon + '</td>').appendTo(sigRow);
        actionCell.click({ msgTarget: this, elmentTarget: sig }, this.removeSignature);


        const page = sig.page;
        const pdfPage = $('#pdfPage_' + page);
        const boundX = pdfPage[0].offsetLeft;
        const boundY = pdfPage[0].offsetTop;
        const pageHeight = Math.ceil(this.pdfPages[page - 1].height);
        const x = sig.x;
        const y = sig.y;
        const height = sig.height;
        const width = sig.width;
        const dpi = document.getElementById('dpi').offsetWidth;

        var yPos = Math.floor((pageHeight - y - height) * dpi / 72) + 9 - 4 + boundY;
        var xPos = boundX + 9 + Math.floor(x * dpi / 72);
        var h = Math.floor(height * dpi / 72);
        var w = Math.floor(width * dpi / 72);
        sig.element.css({ 'top': yPos, 'left': xPos, 'height': h, 'width': w, 'position': 'absolute' });
        sig.element.show();

        sig.element.draggable({
            containment: pdfPage,
            drag: function () {
                const boundX = pdfPage[0].offsetLeft;
                const boundY = pdfPage[0].offsetTop;
                const top = sig.element[0].offsetTop;
                const left = sig.element[0].offsetLeft;
                const xPos = Math.floor((left - boundX - 9) / dpi * 72);
                sig.x = xPos;
                const h = Math.floor(sig.element[0].offsetHeight / dpi * 72);
                const yPos = pageHeight - Math.ceil((top - boundY - 9) / dpi * 72) - h;
                sig.y = yPos;
                sig.urx = sig.x + sig.width;
                sig.ury = sig.y + sig.height;
                sig.signatureRow.find('.sig-rectangle').text('[' + sig.x + ',' + sig.y + ',' + sig.urx + ',' + sig.ury + ']');
            },
            stop: function () {
            }
        })
            .resizable({
                resize: function (event, ui) {
                    var w = Math.floor(sig.element[0].offsetWidth / dpi * 72);
                    var h = Math.floor(sig.element[0].offsetHeight / dpi * 72);
                    sig.width = w;
                    sig.height = h;
                    sig.urx = sig.x + sig.width;
                    sig.ury = sig.y + sig.height;
                    sig.signatureRow.find('.sig-rectangle').text('[' + sig.x + ',' + sig.y + ',' + sig.urx + ',' + sig.ury + ']');
                },
                stop: function (event, ui) {
                }
            });

        pdfPage.droppable({
            accept: sig.element,
            over: function () {
                sig.element.draggable('option', 'containment', $(this));
            }
        });

        //const self = this;
        //window.addEventListener('resize', function () {
        //    self.windowResizeEventHandle();
        //});
        this.setFontColor();
        this.setFontSize();
        this.setFontStyle();
        this.setFontName();
        this.setVisibleText();
    };

    /**
     * 
     * @param {any} type String signature visible type
     * @returns {any} html signature box
     */
    VnptPdf.prototype.getSignatureVisibleElement = function (type) {
        let html = '';
        switch (type) {
            case 1:
                html = _textOnly;
                break;
            case 2:
                html = _textandLogoLeft;
                break;
            case 3:
                html = _logoOnly;
                break;
            case 4:
                html = _textAndLogoTop;
                break;
            case 5:
                html = _textAndBackground;
                break;
        }

        return html;
    };

    /**
     * */
    VnptPdf.prototype.initSignatureBoxEvent = function () {
        const dpi = document.getElementById('dpi').offsetWidth;
        const page = this.settings.sigPage;
        const pageHeight = Math.ceil(this.pdfPages[page - 1].height);
        const pdfPage = $('#pdfPage_' + page);
        const signBox = this.signatureBox;
        const self = this;

        signBox
            .draggable({
                containment: pdfPage,
                drag: function () {
                    const boundX = pdfPage[0].offsetLeft;
                    const boundY = pdfPage[0].offsetTop;
                    const top = signBox[0].offsetTop;
                    const left = signBox[0].offsetLeft;
                    const xPos = Math.floor((left - boundX - 9) / dpi * 72);
                    self.settings.x = xPos;

                    const h = Math.floor(signBox[0].offsetHeight / dpi * 72);
                    const yPos = pageHeight - Math.ceil((top - boundY - 9) / dpi * 72) - h;
                    self.settings.y = yPos;
                    $('#signbox-xpos').val(xPos);
                    $('#signbox-ypos').val(yPos);

                },
                stop: function () {
                }
            })
            .resizable({
                resize: function (event, ui) {
                    var w = Math.floor(signBox[0].offsetWidth / dpi * 72);
                    var h = Math.floor(signBox[0].offsetHeight / dpi * 72);
                    self.settings.width = w;
                    self.settings.height = h;
                    $('#signbox-width').val(w);
                    $('#signbox-height').val(h);
                },
                stop: function (event, ui) {
                }
            });

        pdfPage.droppable({
            accept: signBox,
            over: function () {
                signBox.draggable('option', 'containment', $(this));
            }
        });
    };

    VnptPdf.prototype.initSignatures = function () {
        const self = this;
        self.settings.signatures.forEach(function (sig, index) {
            if (sig.page > self.pdfPages.length) {
                console.error('[Error] Signature page invalid.');
                $('#pdf-signatures-error').text('[Error] Signature page invalid.');
                return;
            }
            self.initSignature(sig, index);
        });
    };

    VnptPdf.prototype.initDefaultSignature = function () {
        if (this.settings.signatures === null || this.settings.signatures.length === 0) {
            const pageHeight = Math.ceil(this.pdfPages[0].height);
            this.settings.signatures = [{
                x: 20, // bottom_left x value
                y: pageHeight - 20 - 9 - 80, // bottom_left y value
                width: 374,
                height: 80,
                page: 1
            }];
        }
    };

    VnptPdf.prototype.initComments = function () {
        const self = this;
        this.settings.comments.forEach(function (comment) {
            if (comment.page > self.pdfPages.length) {
                console.error('[Error] Comment page invalid.');
                $('#pdf-comments-error').text('[Error] Comment page invalid.');
                return;
            }
            self.initComment(comment);
        });
    };

    VnptPdf.prototype.initComment = function (comment) {
        const com = _comment.replace('COMMENT', comment.text);
        const commentElement = $(com).appendTo(this.wrapper.find('.pdf-page'));
        comment.element = commentElement;
        if (typeof comment.fontSize === 'undefined') {
            comment.fontSize = 13;
        }
        if (typeof comment.fontName === 'undefined') {
            comment.fontName = 'Time';
        }
        if (typeof comment.fontStyle === 'undefined') {
            comment.fontStyle = 0;
        }

        const commentRow = $('<tr></tr>').appendTo('#pdf-comments-table>tbody');
        comment.commentRow = commentRow;
        commentRow.append('<td>' + (this.settings.comments.indexOf(comment) + 1) + '</td>');
        commentRow.append('<td>' + comment.text + '</td >');
        commentRow.append('<td>' + comment.page + '</td>');

        const actionEditCell = $('<td class="comment-act">' + _editIcon + '</td>').appendTo(commentRow);
        actionEditCell.click({ msgTarget: this, elmentTarget: comment }, this.editComment);

        const actionCell = $('<td class="comment-act">' + _trashIcon + '</td>').appendTo(commentRow);
        actionCell.click({ msgTarget: this, elmentTarget: comment }, this.removeComment);

        const pdfPage = $('#pdfPage_' + comment.page);
        const boundX = pdfPage[0].offsetLeft;
        const boundY = pdfPage[0].offsetTop;
        const pageHeight = Math.ceil(this.pdfPages[comment.page - 1].height);
        const dpi = document.getElementById('dpi').offsetWidth;

        const x = comment.x || 50;
        const y = comment.y || 50;
        const width = comment.width || 200;
        const height = comment.height || 15;

        var yPos = (pageHeight - y - height) * dpi / 72 + 9 - 4 + boundY;
        var xPos = boundX + 9 + Math.floor(x * dpi / 72);
        var h = Math.floor(height * dpi / 72);
        var w = Math.floor(width * dpi / 72);
        //var h = height * dpi / 72;
        //var w = width * dpi / 72;
        comment.element.css({ 'top': yPos, 'left': xPos, 'height': h, 'width': w, 'position': 'absolute' });
        comment.element.show();

        comment.element.draggable({
            containment: pdfPage,
            drag: function () {
                const boundX = pdfPage[0].offsetLeft;
                const boundY = pdfPage[0].offsetTop;
                const top = comment.element[0].offsetTop;
                const left = comment.element[0].offsetLeft;
                const xPos = Math.floor((left - boundX - 9) / dpi * 72);
                comment.x = xPos;
                const h = Math.floor(comment.element[0].offsetHeight / dpi * 72);
                const yPos = pageHeight - (top - boundY - 9+4) / dpi * 72 - h;
                comment.y = Math.floor(yPos);
            },
            stop: function () {
            }
        })
            .resizable({
                resize: function (event, ui) {
                    var w = Math.floor(comment.element[0].offsetWidth / dpi * 72);
                    var h = Math.floor(comment.element[0].offsetHeight / dpi * 72);
                    comment.width = w;
                    comment.height = h;
                },
                stop: function (event, ui) {
                }
            });

        pdfPage.droppable({
            accept: comment.element,
            over: function () {
                comment.element.draggable('option', 'containment', $(this));
            }
        });
        let commentTextElement = commentElement.find('span');
        let w3 = 'normal';
        let s = 'normal';
        switch ('' + comment.fontStyle) {
            case '1':
                w3 = 'bold';
                s = 'normal';
                break;
            case '2':
                s = 'italic';
                break;
            case '3':
                s = 'italic';
                w3 = 'bold';
                break;
            case '4':
                break;
        }
        const size = Math.ceil(comment.fontSize * dpi / 72);
        commentTextElement.css({
            'font-family': this.getFontFamily(comment.fontName),
            'font-size': size,
            'color': '#' + comment.fontColor
        });
        commentElement.css({
            'font-style': s,
            'font-weight': w3
        });
    };

    VnptPdf.prototype.editComment = function (evt) {
        const self = evt.data.msgTarget;
        const comment = evt.data.elmentTarget;

        let addCommentModal = document.getElementById('add-comment-modal');
        $('#comment-text').val(comment.text);
        $('#comment-text-page').val(comment.page);
        $('#com-font-name').val(comment.fontName);
        $('#com-font-style').val(comment.fontStyle);
        $('#comment-font-color').val(comment.fontColor);
        $('#com-font-size').val(comment.fontSize);
        $('#com-font-size').asRange();
        $('#com-font-size').asRange('set', '' + comment.fontSize);
        jscolor.installByClassName("jscolor");
        $('#comment-font-color').addClass('jscolor-active');
        $('#comment-font-color').css('background-color', '#' + comment.fontColor);
        addCommentModal.style.display = "block";
        $('#add-comment-modal').find('#com-add').click(function () {
            self.editCommentHandle(comment);
        });
        $('#add-comment-modal').find('#com-close').click(function () {
            $("#add-comment-modal").find('#com-add').off("click");
            addCommentModal.style.display = "none";
        });

        const span = addCommentModal.getElementsByClassName("pdf-modal-close")[0];
        span.onclick = function () {
            addCommentModal.style.display = "none";
        };
    };

    VnptPdf.prototype.editCommentHandle = function (comment) {
        const text = $('#comment-text').val();
        if ('' === text) {
            alert('Nhập nội dung comment để tiếp tục');
            return;
        }

        const p = Number($('#comment-text-page').val());
        if (isNaN(p) || p < 1 || p > this.pdfPages.length) {
            alert("Trang đặt comment không hợp lệ. (Số trang từ 1 đến " + this.pdfPages.length + ")");
            return;
        }
        comment.page = p;
        comment.text = text;
        comment.fontSize = $('#com-font-size').asRange('get');
        comment.fontName = $('#com-font-name').val();
        comment.fontStyle = $('#com-font-style').val();
        comment.fontColor = $('#comment-font-color').val();
        this.settings.comments.forEach(function (comm) {
            comm.element.remove();
            comm.commentRow.remove();
        });
        this.initComments();
        $("#add-comment-modal").find('#com-add').off("click");
        document.getElementById('add-comment-modal').style.display = "none";
    };

    VnptPdf.prototype.removeComment = function (evt) {
        const self = evt.data.msgTarget;
        const comment = evt.data.elmentTarget;
        if (!confirm("Xác nhận xóa comment '" + comment.text + "'")) {
            return;
        }
        let temp = [];
        self.settings.comments.forEach(function (comm) {
            comm.element.remove();
            comm.commentRow.remove();
            if (comm === comment) {
                comm.element = null;
            } else {
                temp.push(comm);
            }
        });
        self.settings.comments = temp;
        self.initComments();
    };

    VnptPdf.prototype.removeSignature = function (evt) {
        const self = evt.data.msgTarget;
        const sig = evt.data.elmentTarget;
        if (!confirm("Xác nhận xóa hình ảnh chữ ký")) {
            return;
        }
        let temp = [];
        self.settings.signatures.forEach(function (comm) {
            comm.element.remove();
            comm.signatureRow.remove();
            if (comm === sig) {
                comm.element = null;
            } else {
                temp.push(comm);
            }
        });
        self.settings.signatures = temp;
        self.initSignatures();
    };

    /**
     * 
     * @param {any} evt Add signature comment event
     */
    VnptPdf.prototype.addComment = function (evt) {
        let addCommentModal = document.getElementById('add-comment-modal');
        jscolor.installByClassName("jscolor");
        const self = evt.data.msgTarget;
        $('#add-comment-modal').find('#com-add').click(function () {
            self.addCommentHandle();
        });
        $('#add-comment-modal').find('#com-close').click(function () {
            $("#add-comment-modal").find('#com-add').off("click");
            addCommentModal.style.display = "none";
        });
        addCommentModal.style.display = "block";
        $('#com-font-size').asRange();

        const span = addCommentModal.getElementsByClassName("pdf-modal-close")[0];
        span.onclick = function () {
            $("#add-comment-modal").find('#com-add').off("click");
            addCommentModal.style.display = "none";
        };
    };

    VnptPdf.prototype.addCommentHandle = function () {
        const self = this;
        const text = $('#comment-text').val();
        if ('' === text) {
            alert('Nhập nội dung comment để tiếp tục');
            return;
        }

        const p = Number($('#comment-text-page').val());
        if (isNaN(p) || p < 1 || p > self.pdfPages.length) {
            alert("Trang đặt comment không hợp lệ. (Số trang từ 1 đến " + self.pdfPages.length + ")");
            return;
        }

        let comm = {
            x: 50,
            y: 500,
            width: 200,
            height: 20,
            page: p,
            text: text,
            fontColor: $('#comment-font-color').val(),
            fontSize: $('#com-font-size').asRange('get'),
            fontName: $('#com-font-name').val(),
            fontStyle: $('#com-font-style').val()
        };

        self.settings.comments.push(comm);
        self.initComment(comm);
        $('#comment-text').val('');
        $('#comment-text-page').val('');
        $("#add-comment-modal").find('#com-add').off("click");
        document.getElementById('add-comment-modal').style.display = "none";
    };

    /**
     * 
     * @param {any} evt Add signature comment event
     */
    VnptPdf.prototype.addSignature = function (evt) {
        let addSignatureModal = document.getElementById('add-signature-modal');
        addSignatureModal.style.display = "block";
        window.onclick = function (event) {
            if (event.target === addSignatureModal) {
                addSignatureModal.style.display = "none";
            }
        };
        const span = addSignatureModal.getElementsByClassName("pdf-modal-close")[0];
        span.onclick = function () {
            addSignatureModal.style.display = "none";
        };
    };

    VnptPdf.prototype.addSignatureHandle = function () {
        const self = this;
        const p = Number($('#sig-text-page').val());
        if (isNaN(p) || p < 1 || p > self.pdfPages.length) {
            alert("Trang đặt ảnh chữ ký không hợp lệ. (Số trang từ 1 đến " + self.pdfPages.length + ")");
            return;
        }

        let comm = {
            x: 50,
            y: 500,
            width: 200,
            height: 100,
            page: p
        };

        self.settings.signatures.push(comm);
        self.initSignature(comm);
        $('#sig-text-page').val('');
        document.getElementById('add-signature-modal').style.display = "none";
    };

    /**
     * */
    VnptPdf.prototype.windowResizeEventHandle = function () {
        if (!this.show) {
            return;
        }
        const page = this.settings.sigPage;
        const pdfPage = $('#pdfPage_' + page);
        const boundX = pdfPage[0].offsetLeft;
        const boundY = pdfPage[0].offsetTop;
        const pageHeight = this.pdfPages[page - 1].height;
        const x = this.settings.x;
        const y = this.settings.y;
        const height = this.settings.height;
        const dpi = document.getElementById('dpi').offsetWidth;

        var yPos = Math.floor((pageHeight - y - height) * dpi / 72) + 9 - 4 + boundY;
        var xPos = boundX + 9 + Math.floor(x * dpi / 72);
        this.signatureBox.css({ 'top': yPos, 'left': xPos });
        console.log(boundX);
        this.settings.comments.forEach(function (comment) {
            const xPos1 = boundX + 9 + Math.floor(comment.x * dpi / 72);
            const yPos1 = Math.floor((pageHeight - comment.y - comment.height) * dpi / 72) + 9 - 4 + boundY;
            comment.element.css({ 'top': yPos1, 'left': xPos1 });
        });
    };

    /**
     * 
     * @param {any} evt Final function
     */
    VnptPdf.prototype.complete = function (evt) {
        const self = evt.data.msgTarget;
        self.show = false;
        self.wrapper.empty();
        self.CallBack(self.getPdfSignatureOptions());
    };

    VnptPdf.prototype.reject = function (evt) {
        const self = evt.data.msgTarget;
        self.show = false;
        self.wrapper.empty();
    };

    /**
     * @return {any} json object
     * */
    VnptPdf.prototype.getPdfSignatureOptions = function () {
        const signRectangle = "" + this.settings.x + "," + this.settings.y + "," + (this.settings.x + this.settings.width) + "," + (this.settings.y + this.settings.height);
        let comments = [];
        this.settings.comments.forEach(function (comment) {
            comments.push({
                text: comment.text,
                rectangle: "" + comment.x + "," + comment.y + "," + Math.floor(comment.x + comment.width) + "," + Math.floor(comment.y + comment.height),
                page: comment.page,
                fontName: comment.fontName,
                fontStyle: comment.fontStyle,
                fontSize: comment.fontSize,
                fontColor: comment.fontColor
            });
        });

        console.log(this.settings.visibleText);

        let signatures = [];
        this.settings.signatures.forEach(function (sig) {
            signatures.push({
                rectangle: "" + sig.x + "," + sig.y + "," + Math.floor(sig.x + sig.width) + "," + Math.floor(sig.y + sig.height),
                page: sig.page
            });
        });


        let res = {
            fontName: this.settings.fontName,
            fontSize: this.settings.fontSize,
            fontColor: this.settings.fontColor,
            fontStyle: this.settings.fontStyle,
            imageSrc: this.settings.signatureImg,
            visibleType: this.settings.visibleType,
            comment: Base64.encode(JSON.stringify(comments)),
            signatures: Base64.encode(JSON.stringify(signatures)),
            TextAlign: this.settings.TextAlign
        };
        console.log(this.settings.useDefaultText);
        if (!this.settings.useDefaultText) {
            res = $.extend(true, { signatureText: this.settings.visibleText.replace(/\n/g, "\\n")}, res);
        }
        return res;
    };

    /**
     * 
     * @param {any} base64 base64 encoded
     * @return {any} byte array
     */
    VnptPdf.prototype.convertDataURIToBinary = function (base64) {
        var raw = window.atob(base64);
        var rawLength = raw.length;
        var array = new Uint8Array(new ArrayBuffer(rawLength));

        for (i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        return array;
    };

    // 
    $.fn[pluginName] = function (options) {
        var vnptPdf;
        if (!$.data(this, pluginName)) {
            vnptPdf = new VnptPdf(this, options);
            $.data(this, pluginName, vnptPdf);
        }
        return vnptPdf;
    };

    const pdfWorkingArea =
        '<div class="pdf-working-area">' +

        '<nav class="site-navbar navbar navbar-default navbar-fixed-top navbar-mega" role="navigation">' +
        '      <div class="navbar-header">' +
        '        <div class="navbar-brand navbar-brand-center site-gridmenu-toggle" data-toggle="gridmenu">' +
        '          <img class="navbar-brand-logo" src="data:image/png;base64,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" title="UIC-Kyso">' +
        '          <span class="navbar-brand-text hidden-xs-down"> UIC-Kyso</span>' +
        '        </div>' +
        '      </div>' +
        '    ' +
        '      <div class="navbar-container container-fluid">' +
        '        <!-- Navbar Collapse -->' +
        '        <div class="collapse navbar-collapse navbar-collapse-toolbar" id="site-navbar-collapse">' +
        '          <!-- Navbar Toolbar -->' +
        '          <ul class="nav navbar-toolbar">' +
        '            ' +
        '          </ul>' +
        '          <!-- End Navbar Toolbar -->' +
        '    ' +
        '          <!-- Navbar Toolbar Right -->' +
        '          <ul class="nav navbar-toolbar navbar-right navbar-toolbar-right">' +
        '            ' +
        '          </ul>' +
        '          <!-- End Navbar Toolbar Right -->' +
        '        </div>' +
        '        <!-- End Navbar Collapse -->' +
        '      </div>' +
        '    </nav>' +

        '    <div class="pdf-action-menu page-aside-left">' +
        '        <div class="pdf-action-menu-content">' +
        '            <fieldset>' +
        '                <legend>Signatures</legend>' +
        '                <div class="pdf-input-group" style="padding-right: 15px;">' +
        '                    <div class="pdf-size-row">' +
        '                        <div id="pdf-signatures">' +
        '                            <table class="table-striped" id="pdf-signatures-table" cellspacing="0">' +
        '                               <tbody>' +
        '                               </tbody>' +
        '                            </table>' +
        '                            <div class="pdf-size-row">' +
        '                               <label id="pdf-signatures-error" class="error"></label>' +
        '                            </div>' +
        '                            <button class="pdf-btn" id="add-sig-btn" style="width: 70px;margin-top: 10px;">Thêm</button>' +
        '                        </div>' +
        '                    </div>' +
        '                </div>' +
        '                <br /><a class="pdf-collapsible" href="javascript:void(0)">Tùy chọn nâng cao</a>' +
        '                <div class="pdf-collapse-content" style="">' +
        '                <div style="display:none">' +
        '                    <br /><label>Nội dung hiển thị:</label>' +
        '                    <div class="pdf-input-group">' +
        '                        <textarea id="pdf-sign-text" rows="4" type="text" class="" style="width: calc(100% - 20px);"></textarea>' +
        '                    </div>' +
        '                    <label class="checkbox-container">Hiển thị nội dung mặc định' +
        '                        <input id="useDefaultText" type="checkbox" checked="checked" value="1">' +
        '                          <span class="checkmark"></span>' +
        '                    </label>' +          
        '                </div >' +
        '                <div>' +
        '                    <br /><label>Kiểu hiển thị:</label><br />' +
        '                    <select name="sign-visible-type" id="sign-visible-type-select" class="sign-visible-types">' +
        '                      <option value="1">1. Chỉ hiển thị text</option>' +
        '                      <option value="2">2. Hiển thị text và logo bên trái</option>' +
        '                      <option value="3">3. Chỉ hiển thị logo</option>' +
        '                      <option value="4">4. Hiển thị text và logo phía trên</option>' +
        '                      <option value="5">5. Hiển thị text và background</option>' +
        '                    </select>' +
        '                </div>' +
        '                <div>' +
        '                    <label>Tùy chọn hình hảnh</label>' +
        '                    <div class="pdf-input-group">' +
        '                        <input id="pdf-sign-img-name" type="text" class="pdf-file-name"' +
        '                               readonly="readonly">' +
        '                        <span class="pdf-input-group-btn">' +
        '                            <span class="pdf-btn pdf-btn-file" id="pdf-sign-image-file">' +
        '                                ... <input id="signature-img-btn" name="SetupFile" type="file"' +
        '                                           accept="image/x-png,image/gif,image/jpeg" required>' +
        '                            </span>' +
        '                        </span>' +
        '                    </div>' +
        '                    <br />' +
        '                </div>' +
        '                <div>' +
        '                    <br />' +
        '                    <br />' +
        '                    <label>Kiểu chữ hiển thị:</label><br />' +
        '                    <select name="sign-visible-type" id="sign-font-type-select" class="sign-visible-types" style="width:65%;">' +
        '                      <option value="Time">1. Times New Roman</option>' +
        '                      <option value="Roboto">2. Roboto Condensed</option>' +
        '                      <option value="Arial">3. Arial</option>' +
        '                    </select>' +
        '                    <select name="sign-visible-type" id="sign-font-style-select" class="font-style1 sign-visible-types" style="width:100px;float:right;margin-right:15px;">' +
        '                      <option value="0">Normal</option>' +
        '                      <option value="1" style="font-weight:bold;">Bold</option>' +
        '                      <option value="2" style="font-style:italic;">Italic</option>' +
        '                      <option value="4" style="text-decoration: underline;">Underline</option>' +
        '                      <option value="3" style="font-style:italic;font-weight:bold;">Bold Italic</option>' +
        '                    </select>' +
        '                </div >' +
        '                <div>' +
        '                    <br />' +
        '                    <label>Cỡ chữ hiển thị:</label><br />' +
        '                    <input id="sig-font-size" class="example" type="range" min="5" max="15" name="points" step="1" />' +
        '                </div >' +
        '                <div>' +
        '                    <br />' +
        '                    <br />' +
        '                    <label>Màu chữ:</label><br />' +
        '                    <input id="sig-font-color" class="jscolor" value="SIG-COLOR">' +
        '                </div >' +  
        '                </div>' +
        '            </fieldset>' +
        '            <fieldset>' +
        '                <legend>Comments</legend>' +
        '                <div class="pdf-input-group" style="padding-right: 15px;">' +
        '                    <div class="pdf-size-row">' +
        '                        <div id="pdf-comments">' +
        '                            <table class="table-striped" id="pdf-comments-table" cellspacing="0">' +
        '                               <tbody>' +
        '                               </tbody>' +
        '                            </table>' +
        '                            <div class="pdf-size-row">' +
        '                               <label id="pdf-comments-error" class="error"></label>' +
        '                            </div>' +
        '                            <button class="pdf-btn" id="add-comment-btn" style="width: 70px;margin-top: 10px;">Thêm</button>' +
        '                        </div>' +
        '                    </div>' +
        '                </div>' +
        '            </fieldset>' +
        '            <br />' +
        '            <br />' +
        '            <table>' +
        '                <tr id="action-btns">' +
        '                </tr>' +
        '            </table>' +
        '        </div>' +
        '    </div>' +
        '    <div class="pdf-page">' +
        '        <div id="dragThis">' +
        '             <div id="sign-box-content"></div>' +
        '        </div>' +
        '    </div>' +
        '</div>';
    var _canvasPdf = '<canvas id="ID_VALUE" class="pdf-viewport"></canvas><br/>';

    const _menuSwitch =
        '<div class="page-aside-switch">' +
        '	<i class="icon md-chevron-left" aria-hidden="true"><</i>' +
        '	<i class="icon md-chevron-right" aria-hidden="true">></i>' +
        '</div>';

    const _signatureBox =
        '        <div id="signature_" class="signature-view font-style">' +
        '             <div class="sign-box-content">' +
        '             </div > ' +
        '        </div>';

    const _textOnly =
        '                 <div id="" class="signaturebox">' +
        '                     <div class="signaturebox-text-only sig-text">' +
        '                         <span>Ky boi: Ten chu chung thu</span><br />' +
        '                         <span>Ngay ky: 18/03/2019</span>' +
        '                     </div>' +
        '        </div>';

    const _textandLogoLeft =
        '    <div id="" class="signaturebox">' +
        '        <div class="signaturebox-image-left">' +
        '            <div class="sig-text">' +
        '                <span>Ky boi: Ten chu chung thu</span><br />' +
        '                <span>Ngay ky: 18/03/2019</span>' +
        '            </div>' +
        '            <div class="signature-img signaturebox-image-left-img">' +
        '            </div>' +
        '             </div > ' +
        '        </div>';
    const _logoOnly =
        '                 <div id="" class="signaturebox">' +
        '        <div class="signature-img signaturebox-image-only">' +
        '        </div>' +
        '        </div>';
    const _textAndLogoTop =
        '    <div id="" class="signaturebox">' +
        '        <div class="signaturebox-image-top">' +
        '            <div class="sig-text">' +
        '                <span>Ky boi: Ten chu chung thu</span><br />' +
        '                <span>Ngay ky: 18/03/2019</span>' +
        '            </div>' +
        '            <div class="signature-img signaturebox-image-top-img">' +
        '            </div>' +
        '        </div>' +
        '        </div>';
    const _textAndBackground =
        '    <div id="" class="signaturebox">' +
        '        <div class="signature-img signaturebox-textonly">' +
        '            <div class="sig-text">' +
        '                <span>Ky boi: Ten chu chung thu</span><br />' +
        '                <span>Ngay ky: 18/03/2019</span>' +
        '            </div>' +
        '             </div>' +
        '        </div>';
    const _addCommentModal =
        '<div id="add-comment-modal" class="pdf-modal">' +
        '        <div class="pdf-modal-content pdf-modal-dialog">' +
        '            <div class="pdf-modal-header">' +
        '                <span class="pdf-modal-close">×</span>' +
        '                <h4>Thêm comment</h4>' +
        '            </div>' +
        '            <div class="pdf-modal-body">' +
        '                <div class="pdf-modal-row">' +
        '                    <div class="width-70">' +
        '                        <label>Nội dung hiển thị</label>' +
        '                        <input id="comment-text" class="pdf-file-name pdf-modal-input-text" type="text"><br>' +
        '                    </div>' +
        '                    <div class="width-30">' +
        '                        <label>Trang hiển thị</label>' +
        '                        <input id="comment-text-page" class="pdf-file-name pdf-modal-input-text" type="text">' +
        '                    </div>' +
        '                </div>' +
        '                <div class="pdf-modal-row">' +
        '                    <div class="width-70">' +
        '                        <label>Font chữ</label>' +
        '                        <select id="com-font-name" name="sign-visible-type" class="sign-visible-types" style="width:100%;">' +
        '                            <option value="Time">1. Times New Roman</option>' +
        '                            <option value="Roboto">2. Roboto Condensed</option>' +
        '                            <option value="Arial">3. Arial</option>' +
        '                        </select>' +
        '                    </div>' +
        '                    <div class="width-30">' +
        '                        <label>Kiểu chữ</label>' +
        '                        <select id="com-font-style" name="sign-visible-type" class="font-style1 sign-visible-types" style="width:100%;">' +
        '                            <option value="0">Normal</option>' +
        '                            <option value="1" style="font-weight:bold;">Bold</option>' +
        '                            <option value="2" style="font-style:italic;">Italic</option>' +
        '                            <option value="4" style="text-decoration: underline;">Underline</option>' +
        '                            <option value="3" style="font-style:italic;font-weight:bold;">Bold Italic</option>' +
        '                        </select>' +
        '                    </div>' +
        '                </div>' +
        '                <div class="pdf-modal-row">' +
        '                    <div class="width-50">' +
        '                        <label>Màu chữ</label>' +
        '                        <input id="comment-font-color" class="jscolor" value="000000">' +
        '                    </div>' +
        '                </div>' +
        '                <div class="pdf-modal-row">' +
        '                    <div class="width-80">' +
        '                        <label>Cỡ chữ</label>' +
        '                        <input id="com-font-size" class="example" type="range" min="5" max="15" name="points" step="1" />' +
        '                    </div>' +
        '                </div>' +
        '            </div>' +
        '            <div class="pdf-modal-footer">' +
        '                <button id="com-close" class="pdf-btn pdf-btn-default">Hủy</button>' +
        '                <button id="com-add" class="pdf-btn">Xác nhận</button>' +
        '            </div>' +
        '        </div>' +
        '    </div>';

    const _addSignatureModal =
        '<div id="add-signature-modal" class="pdf-modal">' +
        '    <div class="pdf-modal-content pdf-modal-dialog">' +
        '    <div class="pdf-modal-header">' +
        '        <span class="pdf-modal-close">&times;</span>' +
        '        <h4>Thêm ảnh chữ ký</h4>' +
        '    </div>' +
        '    <div class="pdf-modal-body">' +
        '    <div class="pdf-modal-row">' +
        '        <label>Trang hiển thị</label></br>' +
        '        <input id="sig-text-page" class="pdf-file-name pdf-modal-input-text" type="text" />' +
        '    </div>' +
        '    </div>' +
        '    <div class="pdf-modal-footer">' +
        '        <button class="pdf-btn">Xác nhận</button>' +
        '    </div>' +
        '    </div>' +
        '</div>';

    const _comment = '<div class="pdf-comment"><span>COMMENT</span></div>';

    const _trashIcon = '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="trash-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-trash-alt fa-w-14 fa-2x"><path fill="currentColor" d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z" class=""></path></svg>';
    const _editIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -1 401.52289 401"class=""><g><path d="m370.589844 250.972656c-5.523438 0-10 4.476563-10 10v88.789063c-.019532 16.5625-13.4375 29.984375-30 30h-280.589844c-16.5625-.015625-29.980469-13.4375-30-30v-260.589844c.019531-16.558594 13.4375-29.980469 30-30h88.789062c5.523438 0 10-4.476563 10-10 0-5.519531-4.476562-10-10-10h-88.789062c-27.601562.03125-49.96875 22.398437-50 50v260.59375c.03125 27.601563 22.398438 49.96875 50 50h280.589844c27.601562-.03125 49.96875-22.398437 50-50v-88.792969c0-5.523437-4.476563-10-10-10zm0 0" data-original="#000000" class="active-path" data-old_color="#494949" fill="#464646"/><path d="m376.628906 13.441406c-17.574218-17.574218-46.066406-17.574218-63.640625 0l-178.40625 178.40625c-1.222656 1.222656-2.105469 2.738282-2.566406 4.402344l-23.460937 84.699219c-.964844 3.472656.015624 7.191406 2.5625 9.742187 2.550781 2.546875 6.269531 3.527344 9.742187 2.566406l84.699219-23.464843c1.664062-.460938 3.179687-1.34375 4.402344-2.566407l178.402343-178.410156c17.546875-17.585937 17.546875-46.054687 0-63.640625zm-220.257812 184.90625 146.011718-146.015625 47.089844 47.089844-146.015625 146.015625zm-9.40625 18.875 37.621094 37.625-52.039063 14.417969zm227.257812-142.546875-10.605468 10.605469-47.09375-47.09375 10.609374-10.605469c9.761719-9.761719 25.589844-9.761719 35.351563 0l11.738281 11.734375c9.746094 9.773438 9.746094 25.589844 0 35.359375zm0 0" data-original="#000000" class="active-path" data-old_color="#494949" fill="#464646"/></g> </svg>';
    const Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9+/=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/rn/g, "n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }
    return VnptPdf;

    }));




/* == jquery mousewheel plugin == Version: 3.1.13, License: MIT License (MIT) */
!function (a) { "function" === typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? module.exports = a : a(jQuery) }(function (a) { function b(b) { var g = b || window.event, h = i.call(arguments, 1), j = 0, l = 0, m = 0, n = 0, o = 0, p = 0; if (b = a.event.fix(g), b.type = "mousewheel", "detail" in g && (m = -1 * g.detail), "wheelDelta" in g && (m = g.wheelDelta), "wheelDeltaY" in g && (m = g.wheelDeltaY), "wheelDeltaX" in g && (l = -1 * g.wheelDeltaX), "axis" in g && g.axis === g.HORIZONTAL_AXIS && (l = -1 * m, m = 0), j = 0 === m ? l : m, "deltaY" in g && (m = -1 * g.deltaY, j = m), "deltaX" in g && (l = g.deltaX, 0 === m && (j = -1 * l)), 0 !== m || 0 !== l) { if (1 === g.deltaMode) { var q = a.data(this, "mousewheel-line-height"); j *= q, m *= q, l *= q } else if (2 === g.deltaMode) { var r = a.data(this, "mousewheel-page-height"); j *= r, m *= r, l *= r } if (n = Math.max(Math.abs(m), Math.abs(l)), (!f || f > n) && (f = n, d(g, n) && (f /= 40)), d(g, n) && (j /= 40, l /= 40, m /= 40), j = Math[j >= 1 ? "floor" : "ceil"](j / f), l = Math[l >= 1 ? "floor" : "ceil"](l / f), m = Math[m >= 1 ? "floor" : "ceil"](m / f), k.settings.normalizeOffset && this.getBoundingClientRect) { var s = this.getBoundingClientRect(); o = b.clientX - s.left, p = b.clientY - s.top } return b.deltaX = l, b.deltaY = m, b.deltaFactor = f, b.offsetX = o, b.offsetY = p, b.deltaMode = 0, h.unshift(b, j, l, m), e && clearTimeout(e), e = setTimeout(c, 200), (a.event.dispatch || a.event.handle).apply(this, h) } } function c() { f = null } function d(a, b) { return k.settings.adjustOldDeltas && "mousewheel" === a.type && b % 120 === 0 } var e, f, g = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"], h = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"], i = Array.prototype.slice; if (a.event.fixHooks) for (var j = g.length; j;)a.event.fixHooks[g[--j]] = a.event.mouseHooks; var k = a.event.special.mousewheel = { version: "3.1.12", setup: function () { if (this.addEventListener) for (var c = h.length; c;)this.addEventListener(h[--c], b, !1); else this.onmousewheel = b; a.data(this, "mousewheel-line-height", k.getLineHeight(this)), a.data(this, "mousewheel-page-height", k.getPageHeight(this)) }, teardown: function () { if (this.removeEventListener) for (var c = h.length; c;)this.removeEventListener(h[--c], b, !1); else this.onmousewheel = null; a.removeData(this, "mousewheel-line-height"), a.removeData(this, "mousewheel-page-height") }, getLineHeight: function (b) { var c = a(b), d = c["offsetParent" in a.fn ? "offsetParent" : "parent"](); return d.length || (d = a("body")), parseInt(d.css("fontSize"), 10) || parseInt(c.css("fontSize"), 10) || 16 }, getPageHeight: function (b) { return a(b).height() }, settings: { adjustOldDeltas: !0, normalizeOffset: !0 } }; a.fn.extend({ mousewheel: function (a) { return a ? this.bind("mousewheel", a) : this.trigger("mousewheel") }, unmousewheel: function (a) { return this.unbind("mousewheel", a) } }) }); !function (a) { "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? module.exports = a : a(jQuery) }(function (a) { function b(b) { var g = b || window.event, h = i.call(arguments, 1), j = 0, l = 0, m = 0, n = 0, o = 0, p = 0; if (b = a.event.fix(g), b.type = "mousewheel", "detail" in g && (m = -1 * g.detail), "wheelDelta" in g && (m = g.wheelDelta), "wheelDeltaY" in g && (m = g.wheelDeltaY), "wheelDeltaX" in g && (l = -1 * g.wheelDeltaX), "axis" in g && g.axis === g.HORIZONTAL_AXIS && (l = -1 * m, m = 0), j = 0 === m ? l : m, "deltaY" in g && (m = -1 * g.deltaY, j = m), "deltaX" in g && (l = g.deltaX, 0 === m && (j = -1 * l)), 0 !== m || 0 !== l) { if (1 === g.deltaMode) { var q = a.data(this, "mousewheel-line-height"); j *= q, m *= q, l *= q } else if (2 === g.deltaMode) { var r = a.data(this, "mousewheel-page-height"); j *= r, m *= r, l *= r } if (n = Math.max(Math.abs(m), Math.abs(l)), (!f || f > n) && (f = n, d(g, n) && (f /= 40)), d(g, n) && (j /= 40, l /= 40, m /= 40), j = Math[j >= 1 ? "floor" : "ceil"](j / f), l = Math[l >= 1 ? "floor" : "ceil"](l / f), m = Math[m >= 1 ? "floor" : "ceil"](m / f), k.settings.normalizeOffset && this.getBoundingClientRect) { var s = this.getBoundingClientRect(); o = b.clientX - s.left, p = b.clientY - s.top } return b.deltaX = l, b.deltaY = m, b.deltaFactor = f, b.offsetX = o, b.offsetY = p, b.deltaMode = 0, h.unshift(b, j, l, m), e && clearTimeout(e), e = setTimeout(c, 200), (a.event.dispatch || a.event.handle).apply(this, h) } } function c() { f = null } function d(a, b) { return k.settings.adjustOldDeltas && "mousewheel" === a.type && b % 120 === 0 } var e, f, g = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"], h = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"], i = Array.prototype.slice; if (a.event.fixHooks) for (var j = g.length; j;)a.event.fixHooks[g[--j]] = a.event.mouseHooks; var k = a.event.special.mousewheel = { version: "3.1.12", setup: function () { if (this.addEventListener) for (var c = h.length; c;)this.addEventListener(h[--c], b, !1); else this.onmousewheel = b; a.data(this, "mousewheel-line-height", k.getLineHeight(this)), a.data(this, "mousewheel-page-height", k.getPageHeight(this)) }, teardown: function () { if (this.removeEventListener) for (var c = h.length; c;)this.removeEventListener(h[--c], b, !1); else this.onmousewheel = null; a.removeData(this, "mousewheel-line-height"), a.removeData(this, "mousewheel-page-height") }, getLineHeight: function (b) { var c = a(b), d = c["offsetParent" in a.fn ? "offsetParent" : "parent"](); return d.length || (d = a("body")), parseInt(d.css("fontSize"), 10) || parseInt(c.css("fontSize"), 10) || 16 }, getPageHeight: function (b) { return a(b).height() }, settings: { adjustOldDeltas: !0, normalizeOffset: !0 } }; a.fn.extend({ mousewheel: function (a) { return a ? this.bind("mousewheel", a) : this.trigger("mousewheel") }, unmousewheel: function (a) { return this.unbind("mousewheel", a) } }) });
/* == malihu jquery custom scrollbar plugin == Version: 3.1.5, License: MIT License (MIT) */
!function (e) { "function" === typeof define && define.amd ? define(["jquery"], e) : "undefined" != typeof module && module.exports ? module.exports = e : e(jQuery, window, document) }(function (e) {
    !function (t) { var o = "function" === typeof define && define.amd, a = "undefined" !== typeof module && module.exports, n = "https:" == document.location.protocol ? "https:" : "http:", i = "cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min.js"; o || (a ? require("jquery-mousewheel")(e) : e.event.special.mousewheel || e("head").append(decodeURI("%3Cscript src=" + n + "//" + i + "%3E%3C/script%3E"))), t() }(function () {
        var t, o = "mCustomScrollbar", a = "mCS", n = ".mCustomScrollbar", i = { setTop: 0, setLeft: 0, axis: "y", scrollbarPosition: "inside", scrollInertia: 950, autoDraggerLength: !0, alwaysShowScrollbar: 0, snapOffset: 0, mouseWheel: { enable: !0, scrollAmount: "auto", axis: "y", deltaFactor: "auto", disableOver: ["select", "option", "keygen", "datalist", "textarea"] }, scrollButtons: { scrollType: "stepless", scrollAmount: "auto" }, keyboard: { enable: !0, scrollType: "stepless", scrollAmount: "auto" }, contentTouchScroll: 25, documentTouchScroll: !0, advanced: { autoScrollOnFocus: "input,textarea,select,button,datalist,keygen,a[tabindex],area,object,[contenteditable='true']", updateOnContentResize: !0, updateOnImageLoad: "auto", autoUpdateTimeout: 60 }, theme: "light", callbacks: { onTotalScrollOffset: 0, onTotalScrollBackOffset: 0, alwaysTriggerOffsets: !0 } }, r = 0, l = {}, s = window.attachEvent && !window.addEventListener ? 1 : 0, c = !1, d = ["mCSB_dragger_onDrag", "mCSB_scrollTools_onDrag", "mCS_img_loaded", "mCS_disabled", "mCS_destroyed", "mCS_no_scrollbar", "mCS-autoHide", "mCS-dir-rtl", "mCS_no_scrollbar_y", "mCS_no_scrollbar_x", "mCS_y_hidden", "mCS_x_hidden", "mCSB_draggerContainer", "mCSB_buttonUp", "mCSB_buttonDown", "mCSB_buttonLeft", "mCSB_buttonRight"], u = { init: function (t) { var t = e.extend(!0, {}, i, t), o = f.call(this); if (t.live) { var s = t.liveSelector || this.selector || n, c = e(s); if ("off" === t.live) return void m(s); l[s] = setTimeout(function () { c.mCustomScrollbar(t), "once" === t.live && c.length && m(s) }, 500) } else m(s); return t.setWidth = t.set_width ? t.set_width : t.setWidth, t.setHeight = t.set_height ? t.set_height : t.setHeight, t.axis = t.horizontalScroll ? "x" : p(t.axis), t.scrollInertia = t.scrollInertia > 0 && t.scrollInertia < 17 ? 17 : t.scrollInertia, "object" != typeof t.mouseWheel && 1 == t.mouseWheel && (t.mouseWheel = { enable: !0, scrollAmount: "auto", axis: "y", preventDefault: !1, deltaFactor: "auto", normalizeDelta: !1, invert: !1 }), t.mouseWheel.scrollAmount = t.mouseWheelPixels ? t.mouseWheelPixels : t.mouseWheel.scrollAmount, t.mouseWheel.normalizeDelta = t.advanced.normalizeMouseWheelDelta ? t.advanced.normalizeMouseWheelDelta : t.mouseWheel.normalizeDelta, t.scrollButtons.scrollType = g(t.scrollButtons.scrollType), h(t), e(o).each(function () { var o = e(this); if (!o.data(a)) { o.data(a, { idx: ++r, opt: t, scrollRatio: { y: null, x: null }, overflowed: null, contentReset: { y: null, x: null }, bindEvents: !1, tweenRunning: !1, sequential: {}, langDir: o.css("direction"), cbOffsets: null, trigger: null, poll: { size: { o: 0, n: 0 }, img: { o: 0, n: 0 }, change: { o: 0, n: 0 } } }); var n = o.data(a), i = n.opt, l = o.data("mcs-axis"), s = o.data("mcs-scrollbar-position"), c = o.data("mcs-theme"); l && (i.axis = l), s && (i.scrollbarPosition = s), c && (i.theme = c, h(i)), v.call(this), n && i.callbacks.onCreate && "function" == typeof i.callbacks.onCreate && i.callbacks.onCreate.call(this), e("#mCSB_" + n.idx + "_container img:not(." + d[2] + ")").addClass(d[2]), u.update.call(null, o) } }) }, update: function (t, o) { var n = t || f.call(this); return e(n).each(function () { var t = e(this); if (t.data(a)) { var n = t.data(a), i = n.opt, r = e("#mCSB_" + n.idx + "_container"), l = e("#mCSB_" + n.idx), s = [e("#mCSB_" + n.idx + "_dragger_vertical"), e("#mCSB_" + n.idx + "_dragger_horizontal")]; if (!r.length) return; n.tweenRunning && Q(t), o && n && i.callbacks.onBeforeUpdate && "function" == typeof i.callbacks.onBeforeUpdate && i.callbacks.onBeforeUpdate.call(this), t.hasClass(d[3]) && t.removeClass(d[3]), t.hasClass(d[4]) && t.removeClass(d[4]), l.css("max-height", "none"), l.height() !== t.height() && l.css("max-height", t.height()), _.call(this), "y" === i.axis || i.advanced.autoExpandHorizontalScroll || r.css("width", x(r)), n.overflowed = y.call(this), M.call(this), i.autoDraggerLength && S.call(this), b.call(this), T.call(this); var c = [Math.abs(r[0].offsetTop), Math.abs(r[0].offsetLeft)]; "x" !== i.axis && (n.overflowed[0] ? s[0].height() > s[0].parent().height() ? B.call(this) : (G(t, c[0].toString(), { dir: "y", dur: 0, overwrite: "none" }), n.contentReset.y = null) : (B.call(this), "y" === i.axis ? k.call(this) : "yx" === i.axis && n.overflowed[1] && G(t, c[1].toString(), { dir: "x", dur: 0, overwrite: "none" }))), "y" !== i.axis && (n.overflowed[1] ? s[1].width() > s[1].parent().width() ? B.call(this) : (G(t, c[1].toString(), { dir: "x", dur: 0, overwrite: "none" }), n.contentReset.x = null) : (B.call(this), "x" === i.axis ? k.call(this) : "yx" === i.axis && n.overflowed[0] && G(t, c[0].toString(), { dir: "y", dur: 0, overwrite: "none" }))), o && n && (2 === o && i.callbacks.onImageLoad && "function" == typeof i.callbacks.onImageLoad ? i.callbacks.onImageLoad.call(this) : 3 === o && i.callbacks.onSelectorChange && "function" == typeof i.callbacks.onSelectorChange ? i.callbacks.onSelectorChange.call(this) : i.callbacks.onUpdate && "function" == typeof i.callbacks.onUpdate && i.callbacks.onUpdate.call(this)), N.call(this) } }) }, scrollTo: function (t, o) { if ("undefined" != typeof t && null != t) { var n = f.call(this); return e(n).each(function () { var n = e(this); if (n.data(a)) { var i = n.data(a), r = i.opt, l = { trigger: "external", scrollInertia: r.scrollInertia, scrollEasing: "mcsEaseInOut", moveDragger: !1, timeout: 60, callbacks: !0, onStart: !0, onUpdate: !0, onComplete: !0 }, s = e.extend(!0, {}, l, o), c = Y.call(this, t), d = s.scrollInertia > 0 && s.scrollInertia < 17 ? 17 : s.scrollInertia; c[0] = X.call(this, c[0], "y"), c[1] = X.call(this, c[1], "x"), s.moveDragger && (c[0] *= i.scrollRatio.y, c[1] *= i.scrollRatio.x), s.dur = ne() ? 0 : d, setTimeout(function () { null !== c[0] && "undefined" != typeof c[0] && "x" !== r.axis && i.overflowed[0] && (s.dir = "y", s.overwrite = "all", G(n, c[0].toString(), s)), null !== c[1] && "undefined" != typeof c[1] && "y" !== r.axis && i.overflowed[1] && (s.dir = "x", s.overwrite = "none", G(n, c[1].toString(), s)) }, s.timeout) } }) } }, stop: function () { var t = f.call(this); return e(t).each(function () { var t = e(this); t.data(a) && Q(t) }) }, disable: function (t) { var o = f.call(this); return e(o).each(function () { var o = e(this); if (o.data(a)) { o.data(a); N.call(this, "remove"), k.call(this), t && B.call(this), M.call(this, !0), o.addClass(d[3]) } }) }, destroy: function () { var t = f.call(this); return e(t).each(function () { var n = e(this); if (n.data(a)) { var i = n.data(a), r = i.opt, l = e("#mCSB_" + i.idx), s = e("#mCSB_" + i.idx + "_container"), c = e(".mCSB_" + i.idx + "_scrollbar"); r.live && m(r.liveSelector || e(t).selector), N.call(this, "remove"), k.call(this), B.call(this), n.removeData(a), $(this, "mcs"), c.remove(), s.find("img." + d[2]).removeClass(d[2]), l.replaceWith(s.contents()), n.removeClass(o + " _" + a + "_" + i.idx + " " + d[6] + " " + d[7] + " " + d[5] + " " + d[3]).addClass(d[4]) } }) } }, f = function () { return "object" != typeof e(this) || e(this).length < 1 ? n : this }, h = function (t) { var o = ["rounded", "rounded-dark", "rounded-dots", "rounded-dots-dark"], a = ["rounded-dots", "rounded-dots-dark", "3d", "3d-dark", "3d-thick", "3d-thick-dark", "inset", "inset-dark", "inset-2", "inset-2-dark", "inset-3", "inset-3-dark"], n = ["minimal", "minimal-dark"], i = ["minimal", "minimal-dark"], r = ["minimal", "minimal-dark"]; t.autoDraggerLength = e.inArray(t.theme, o) > -1 ? !1 : t.autoDraggerLength, t.autoExpandScrollbar = e.inArray(t.theme, a) > -1 ? !1 : t.autoExpandScrollbar, t.scrollButtons.enable = e.inArray(t.theme, n) > -1 ? !1 : t.scrollButtons.enable, t.autoHideScrollbar = e.inArray(t.theme, i) > -1 ? !0 : t.autoHideScrollbar, t.scrollbarPosition = e.inArray(t.theme, r) > -1 ? "outside" : t.scrollbarPosition }, m = function (e) { l[e] && (clearTimeout(l[e]), $(l, e)) }, p = function (e) { return "yx" === e || "xy" === e || "auto" === e ? "yx" : "x" === e || "horizontal" === e ? "x" : "y" }, g = function (e) { return "stepped" === e || "pixels" === e || "step" === e || "click" === e ? "stepped" : "stepless" }, v = function () { var t = e(this), n = t.data(a), i = n.opt, r = i.autoExpandScrollbar ? " " + d[1] + "_expand" : "", l = ["<div id='mCSB_" + n.idx + "_scrollbar_vertical' class='mCSB_scrollTools mCSB_" + n.idx + "_scrollbar mCS-" + i.theme + " mCSB_scrollTools_vertical" + r + "'><div class='" + d[12] + "'><div id='mCSB_" + n.idx + "_dragger_vertical' class='mCSB_dragger' style='position:absolute;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>", "<div id='mCSB_" + n.idx + "_scrollbar_horizontal' class='mCSB_scrollTools mCSB_" + n.idx + "_scrollbar mCS-" + i.theme + " mCSB_scrollTools_horizontal" + r + "'><div class='" + d[12] + "'><div id='mCSB_" + n.idx + "_dragger_horizontal' class='mCSB_dragger' style='position:absolute;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>"], s = "yx" === i.axis ? "mCSB_vertical_horizontal" : "x" === i.axis ? "mCSB_horizontal" : "mCSB_vertical", c = "yx" === i.axis ? l[0] + l[1] : "x" === i.axis ? l[1] : l[0], u = "yx" === i.axis ? "<div id='mCSB_" + n.idx + "_container_wrapper' class='mCSB_container_wrapper' />" : "", f = i.autoHideScrollbar ? " " + d[6] : "", h = "x" !== i.axis && "rtl" === n.langDir ? " " + d[7] : ""; i.setWidth && t.css("width", i.setWidth), i.setHeight && t.css("height", i.setHeight), i.setLeft = "y" !== i.axis && "rtl" === n.langDir ? "989999px" : i.setLeft, t.addClass(o + " _" + a + "_" + n.idx + f + h).wrapInner("<div id='mCSB_" + n.idx + "' class='mCustomScrollBox mCS-" + i.theme + " " + s + "'><div id='mCSB_" + n.idx + "_container' class='mCSB_container' style='position:relative; top:" + i.setTop + "; left:" + i.setLeft + ";' dir='" + n.langDir + "' /></div>"); var m = e("#mCSB_" + n.idx), p = e("#mCSB_" + n.idx + "_container"); "y" === i.axis || i.advanced.autoExpandHorizontalScroll || p.css("width", x(p)), "outside" === i.scrollbarPosition ? ("static" === t.css("position") && t.css("position", "relative"), t.css("overflow", "visible"), m.addClass("mCSB_outside").after(c)) : (m.addClass("mCSB_inside").append(c), p.wrap(u)), w.call(this); var g = [e("#mCSB_" + n.idx + "_dragger_vertical"), e("#mCSB_" + n.idx + "_dragger_horizontal")]; g[0].css("min-height", g[0].height()), g[1].css("min-width", g[1].width()) }, x = function (t) { var o = [t[0].scrollWidth, Math.max.apply(Math, t.children().map(function () { return e(this).outerWidth(!0) }).get())], a = t.parent().width(); return o[0] > a ? o[0] : o[1] > a ? o[1] : "100%" }, _ = function () { var t = e(this), o = t.data(a), n = o.opt, i = e("#mCSB_" + o.idx + "_container"); if (n.advanced.autoExpandHorizontalScroll && "y" !== n.axis) { i.css({ width: "auto", "min-width": 0, "overflow-x": "scroll" }); var r = Math.ceil(i[0].scrollWidth); 3 === n.advanced.autoExpandHorizontalScroll || 2 !== n.advanced.autoExpandHorizontalScroll && r > i.parent().width() ? i.css({ width: r, "min-width": "100%", "overflow-x": "inherit" }) : i.css({ "overflow-x": "inherit", position: "absolute" }).wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />").css({ width: Math.ceil(i[0].getBoundingClientRect().right + .4) - Math.floor(i[0].getBoundingClientRect().left), "min-width": "100%", position: "relative" }).unwrap() } }, w = function () { var t = e(this), o = t.data(a), n = o.opt, i = e(".mCSB_" + o.idx + "_scrollbar:first"), r = oe(n.scrollButtons.tabindex) ? "tabindex='" + n.scrollButtons.tabindex + "'" : "", l = ["<a href='#' class='" + d[13] + "' " + r + " />", "<a href='#' class='" + d[14] + "' " + r + " />", "<a href='#' class='" + d[15] + "' " + r + " />", "<a href='#' class='" + d[16] + "' " + r + " />"], s = ["x" === n.axis ? l[2] : l[0], "x" === n.axis ? l[3] : l[1], l[2], l[3]]; n.scrollButtons.enable && i.prepend(s[0]).append(s[1]).next(".mCSB_scrollTools").prepend(s[2]).append(s[3]) }, S = function () { var t = e(this), o = t.data(a), n = e("#mCSB_" + o.idx), i = e("#mCSB_" + o.idx + "_container"), r = [e("#mCSB_" + o.idx + "_dragger_vertical"), e("#mCSB_" + o.idx + "_dragger_horizontal")], l = [n.height() / i.outerHeight(!1), n.width() / i.outerWidth(!1)], c = [parseInt(r[0].css("min-height")), Math.round(l[0] * r[0].parent().height()), parseInt(r[1].css("min-width")), Math.round(l[1] * r[1].parent().width())], d = s && c[1] < c[0] ? c[0] : c[1], u = s && c[3] < c[2] ? c[2] : c[3]; r[0].css({ height: d, "max-height": r[0].parent().height() - 10 }).find(".mCSB_dragger_bar").css({ "line-height": c[0] + "px" }), r[1].css({ width: u, "max-width": r[1].parent().width() - 10 }) }, b = function () { var t = e(this), o = t.data(a), n = e("#mCSB_" + o.idx), i = e("#mCSB_" + o.idx + "_container"), r = [e("#mCSB_" + o.idx + "_dragger_vertical"), e("#mCSB_" + o.idx + "_dragger_horizontal")], l = [i.outerHeight(!1) - n.height(), i.outerWidth(!1) - n.width()], s = [l[0] / (r[0].parent().height() - r[0].height()), l[1] / (r[1].parent().width() - r[1].width())]; o.scrollRatio = { y: s[0], x: s[1] } }, C = function (e, t, o) { var a = o ? d[0] + "_expanded" : "", n = e.closest(".mCSB_scrollTools"); "active" === t ? (e.toggleClass(d[0] + " " + a), n.toggleClass(d[1]), e[0]._draggable = e[0]._draggable ? 0 : 1) : e[0]._draggable || ("hide" === t ? (e.removeClass(d[0]), n.removeClass(d[1])) : (e.addClass(d[0]), n.addClass(d[1]))) }, y = function () { var t = e(this), o = t.data(a), n = e("#mCSB_" + o.idx), i = e("#mCSB_" + o.idx + "_container"), r = null == o.overflowed ? i.height() : i.outerHeight(!1), l = null == o.overflowed ? i.width() : i.outerWidth(!1), s = i[0].scrollHeight, c = i[0].scrollWidth; return s > r && (r = s), c > l && (l = c), [r > n.height(), l > n.width()] }, B = function () { var t = e(this), o = t.data(a), n = o.opt, i = e("#mCSB_" + o.idx), r = e("#mCSB_" + o.idx + "_container"), l = [e("#mCSB_" + o.idx + "_dragger_vertical"), e("#mCSB_" + o.idx + "_dragger_horizontal")]; if (Q(t), ("x" !== n.axis && !o.overflowed[0] || "y" === n.axis && o.overflowed[0]) && (l[0].add(r).css("top", 0), G(t, "_resetY")), "y" !== n.axis && !o.overflowed[1] || "x" === n.axis && o.overflowed[1]) { var s = dx = 0; "rtl" === o.langDir && (s = i.width() - r.outerWidth(!1), dx = Math.abs(s / o.scrollRatio.x)), r.css("left", s), l[1].css("left", dx), G(t, "_resetX") } }, T = function () { function t() { r = setTimeout(function () { e.event.special.mousewheel ? (clearTimeout(r), W.call(o[0])) : t() }, 100) } var o = e(this), n = o.data(a), i = n.opt; if (!n.bindEvents) { if (I.call(this), i.contentTouchScroll && D.call(this), E.call(this), i.mouseWheel.enable) { var r; t() } P.call(this), U.call(this), i.advanced.autoScrollOnFocus && H.call(this), i.scrollButtons.enable && F.call(this), i.keyboard.enable && q.call(this), n.bindEvents = !0 } }, k = function () { var t = e(this), o = t.data(a), n = o.opt, i = a + "_" + o.idx, r = ".mCSB_" + o.idx + "_scrollbar", l = e("#mCSB_" + o.idx + ",#mCSB_" + o.idx + "_container,#mCSB_" + o.idx + "_container_wrapper," + r + " ." + d[12] + ",#mCSB_" + o.idx + "_dragger_vertical,#mCSB_" + o.idx + "_dragger_horizontal," + r + ">a"), s = e("#mCSB_" + o.idx + "_container"); n.advanced.releaseDraggableSelectors && l.add(e(n.advanced.releaseDraggableSelectors)), n.advanced.extraDraggableSelectors && l.add(e(n.advanced.extraDraggableSelectors)), o.bindEvents && (e(document).add(e(!A() || top.document)).unbind("." + i), l.each(function () { e(this).unbind("." + i) }), clearTimeout(t[0]._focusTimeout), $(t[0], "_focusTimeout"), clearTimeout(o.sequential.step), $(o.sequential, "step"), clearTimeout(s[0].onCompleteTimeout), $(s[0], "onCompleteTimeout"), o.bindEvents = !1) }, M = function (t) { var o = e(this), n = o.data(a), i = n.opt, r = e("#mCSB_" + n.idx + "_container_wrapper"), l = r.length ? r : e("#mCSB_" + n.idx + "_container"), s = [e("#mCSB_" + n.idx + "_scrollbar_vertical"), e("#mCSB_" + n.idx + "_scrollbar_horizontal")], c = [s[0].find(".mCSB_dragger"), s[1].find(".mCSB_dragger")]; "x" !== i.axis && (n.overflowed[0] && !t ? (s[0].add(c[0]).add(s[0].children("a")).css("display", "block"), l.removeClass(d[8] + " " + d[10])) : (i.alwaysShowScrollbar ? (2 !== i.alwaysShowScrollbar && c[0].css("display", "none"), l.removeClass(d[10])) : (s[0].css("display", "none"), l.addClass(d[10])), l.addClass(d[8]))), "y" !== i.axis && (n.overflowed[1] && !t ? (s[1].add(c[1]).add(s[1].children("a")).css("display", "block"), l.removeClass(d[9] + " " + d[11])) : (i.alwaysShowScrollbar ? (2 !== i.alwaysShowScrollbar && c[1].css("display", "none"), l.removeClass(d[11])) : (s[1].css("display", "none"), l.addClass(d[11])), l.addClass(d[9]))), n.overflowed[0] || n.overflowed[1] ? o.removeClass(d[5]) : o.addClass(d[5]) }, O = function (t) { var o = t.type, a = t.target.ownerDocument !== document && null !== frameElement ? [e(frameElement).offset().top, e(frameElement).offset().left] : null, n = A() && t.target.ownerDocument !== top.document && null !== frameElement ? [e(t.view.frameElement).offset().top, e(t.view.frameElement).offset().left] : [0, 0]; switch (o) { case "pointerdown": case "MSPointerDown": case "pointermove": case "MSPointerMove": case "pointerup": case "MSPointerUp": return a ? [t.originalEvent.pageY - a[0] + n[0], t.originalEvent.pageX - a[1] + n[1], !1] : [t.originalEvent.pageY, t.originalEvent.pageX, !1]; case "touchstart": case "touchmove": case "touchend": var i = t.originalEvent.touches[0] || t.originalEvent.changedTouches[0], r = t.originalEvent.touches.length || t.originalEvent.changedTouches.length; return t.target.ownerDocument !== document ? [i.screenY, i.screenX, r > 1] : [i.pageY, i.pageX, r > 1]; default: return a ? [t.pageY - a[0] + n[0], t.pageX - a[1] + n[1], !1] : [t.pageY, t.pageX, !1] } }, I = function () { function t(e, t, a, n) { if (h[0].idleTimer = d.scrollInertia < 233 ? 250 : 0, o.attr("id") === f[1]) var i = "x", s = (o[0].offsetLeft - t + n) * l.scrollRatio.x; else var i = "y", s = (o[0].offsetTop - e + a) * l.scrollRatio.y; G(r, s.toString(), { dir: i, drag: !0 }) } var o, n, i, r = e(this), l = r.data(a), d = l.opt, u = a + "_" + l.idx, f = ["mCSB_" + l.idx + "_dragger_vertical", "mCSB_" + l.idx + "_dragger_horizontal"], h = e("#mCSB_" + l.idx + "_container"), m = e("#" + f[0] + ",#" + f[1]), p = d.advanced.releaseDraggableSelectors ? m.add(e(d.advanced.releaseDraggableSelectors)) : m, g = d.advanced.extraDraggableSelectors ? e(!A() || top.document).add(e(d.advanced.extraDraggableSelectors)) : e(!A() || top.document); m.bind("contextmenu." + u, function (e) { e.preventDefault() }).bind("mousedown." + u + " touchstart." + u + " pointerdown." + u + " MSPointerDown." + u, function (t) { if (t.stopImmediatePropagation(), t.preventDefault(), ee(t)) { c = !0, s && (document.onselectstart = function () { return !1 }), L.call(h, !1), Q(r), o = e(this); var a = o.offset(), l = O(t)[0] - a.top, u = O(t)[1] - a.left, f = o.height() + a.top, m = o.width() + a.left; f > l && l > 0 && m > u && u > 0 && (n = l, i = u), C(o, "active", d.autoExpandScrollbar) } }).bind("touchmove." + u, function (e) { e.stopImmediatePropagation(), e.preventDefault(); var a = o.offset(), r = O(e)[0] - a.top, l = O(e)[1] - a.left; t(n, i, r, l) }), e(document).add(g).bind("mousemove." + u + " pointermove." + u + " MSPointerMove." + u, function (e) { if (o) { var a = o.offset(), r = O(e)[0] - a.top, l = O(e)[1] - a.left; if (n === r && i === l) return; t(n, i, r, l) } }).add(p).bind("mouseup." + u + " touchend." + u + " pointerup." + u + " MSPointerUp." + u, function () { o && (C(o, "active", d.autoExpandScrollbar), o = null), c = !1, s && (document.onselectstart = null), L.call(h, !0) }) }, D = function () { function o(e) { if (!te(e) || c || O(e)[2]) return void (t = 0); t = 1, b = 0, C = 0, d = 1, y.removeClass("mCS_touch_action"); var o = I.offset(); u = O(e)[0] - o.top, f = O(e)[1] - o.left, z = [O(e)[0], O(e)[1]] } function n(e) { if (te(e) && !c && !O(e)[2] && (T.documentTouchScroll || e.preventDefault(), e.stopImmediatePropagation(), (!C || b) && d)) { g = K(); var t = M.offset(), o = O(e)[0] - t.top, a = O(e)[1] - t.left, n = "mcsLinearOut"; if (E.push(o), W.push(a), z[2] = Math.abs(O(e)[0] - z[0]), z[3] = Math.abs(O(e)[1] - z[1]), B.overflowed[0]) var i = D[0].parent().height() - D[0].height(), r = u - o > 0 && o - u > -(i * B.scrollRatio.y) && (2 * z[3] < z[2] || "yx" === T.axis); if (B.overflowed[1]) var l = D[1].parent().width() - D[1].width(), h = f - a > 0 && a - f > -(l * B.scrollRatio.x) && (2 * z[2] < z[3] || "yx" === T.axis); r || h ? (U || e.preventDefault(), b = 1) : (C = 1, y.addClass("mCS_touch_action")), U && e.preventDefault(), w = "yx" === T.axis ? [u - o, f - a] : "x" === T.axis ? [null, f - a] : [u - o, null], I[0].idleTimer = 250, B.overflowed[0] && s(w[0], R, n, "y", "all", !0), B.overflowed[1] && s(w[1], R, n, "x", L, !0) } } function i(e) { if (!te(e) || c || O(e)[2]) return void (t = 0); t = 1, e.stopImmediatePropagation(), Q(y), p = K(); var o = M.offset(); h = O(e)[0] - o.top, m = O(e)[1] - o.left, E = [], W = [] } function r(e) { if (te(e) && !c && !O(e)[2]) { d = 0, e.stopImmediatePropagation(), b = 0, C = 0, v = K(); var t = M.offset(), o = O(e)[0] - t.top, a = O(e)[1] - t.left; if (!(v - g > 30)) { _ = 1e3 / (v - p); var n = "mcsEaseOut", i = 2.5 > _, r = i ? [E[E.length - 2], W[W.length - 2]] : [0, 0]; x = i ? [o - r[0], a - r[1]] : [o - h, a - m]; var u = [Math.abs(x[0]), Math.abs(x[1])]; _ = i ? [Math.abs(x[0] / 4), Math.abs(x[1] / 4)] : [_, _]; var f = [Math.abs(I[0].offsetTop) - x[0] * l(u[0] / _[0], _[0]), Math.abs(I[0].offsetLeft) - x[1] * l(u[1] / _[1], _[1])]; w = "yx" === T.axis ? [f[0], f[1]] : "x" === T.axis ? [null, f[1]] : [f[0], null], S = [4 * u[0] + T.scrollInertia, 4 * u[1] + T.scrollInertia]; var y = parseInt(T.contentTouchScroll) || 0; w[0] = u[0] > y ? w[0] : 0, w[1] = u[1] > y ? w[1] : 0, B.overflowed[0] && s(w[0], S[0], n, "y", L, !1), B.overflowed[1] && s(w[1], S[1], n, "x", L, !1) } } } function l(e, t) { var o = [1.5 * t, 2 * t, t / 1.5, t / 2]; return e > 90 ? t > 4 ? o[0] : o[3] : e > 60 ? t > 3 ? o[3] : o[2] : e > 30 ? t > 8 ? o[1] : t > 6 ? o[0] : t > 4 ? t : o[2] : t > 8 ? t : o[3] } function s(e, t, o, a, n, i) { e && G(y, e.toString(), { dur: t, scrollEasing: o, dir: a, overwrite: n, drag: i }) } var d, u, f, h, m, p, g, v, x, _, w, S, b, C, y = e(this), B = y.data(a), T = B.opt, k = a + "_" + B.idx, M = e("#mCSB_" + B.idx), I = e("#mCSB_" + B.idx + "_container"), D = [e("#mCSB_" + B.idx + "_dragger_vertical"), e("#mCSB_" + B.idx + "_dragger_horizontal")], E = [], W = [], R = 0, L = "yx" === T.axis ? "none" : "all", z = [], P = I.find("iframe"), H = ["touchstart." + k + " pointerdown." + k + " MSPointerDown." + k, "touchmove." + k + " pointermove." + k + " MSPointerMove." + k, "touchend." + k + " pointerup." + k + " MSPointerUp." + k], U = void 0 !== document.body.style.touchAction && "" !== document.body.style.touchAction; I.bind(H[0], function (e) { o(e) }).bind(H[1], function (e) { n(e) }), M.bind(H[0], function (e) { i(e) }).bind(H[2], function (e) { r(e) }), P.length && P.each(function () { e(this).bind("load", function () { A(this) && e(this.contentDocument || this.contentWindow.document).bind(H[0], function (e) { o(e), i(e) }).bind(H[1], function (e) { n(e) }).bind(H[2], function (e) { r(e) }) }) }) }, E = function () { function o() { return window.getSelection ? window.getSelection().toString() : document.selection && "Control" != document.selection.type ? document.selection.createRange().text : 0 } function n(e, t, o) { d.type = o && i ? "stepped" : "stepless", d.scrollAmount = 10, j(r, e, t, "mcsLinearOut", o ? 60 : null) } var i, r = e(this), l = r.data(a), s = l.opt, d = l.sequential, u = a + "_" + l.idx, f = e("#mCSB_" + l.idx + "_container"), h = f.parent(); f.bind("mousedown." + u, function () { t || i || (i = 1, c = !0) }).add(document).bind("mousemove." + u, function (e) { if (!t && i && o()) { var a = f.offset(), r = O(e)[0] - a.top + f[0].offsetTop, c = O(e)[1] - a.left + f[0].offsetLeft; r > 0 && r < h.height() && c > 0 && c < h.width() ? d.step && n("off", null, "stepped") : ("x" !== s.axis && l.overflowed[0] && (0 > r ? n("on", 38) : r > h.height() && n("on", 40)), "y" !== s.axis && l.overflowed[1] && (0 > c ? n("on", 37) : c > h.width() && n("on", 39))) } }).bind("mouseup." + u + " dragend." + u, function () { t || (i && (i = 0, n("off", null)), c = !1) }) }, W = function () { function t(t, a) { if (Q(o), !z(o, t.target)) { var r = "auto" !== i.mouseWheel.deltaFactor ? parseInt(i.mouseWheel.deltaFactor) : s && t.deltaFactor < 100 ? 100 : t.deltaFactor || 100, d = i.scrollInertia; if ("x" === i.axis || "x" === i.mouseWheel.axis) var u = "x", f = [Math.round(r * n.scrollRatio.x), parseInt(i.mouseWheel.scrollAmount)], h = "auto" !== i.mouseWheel.scrollAmount ? f[1] : f[0] >= l.width() ? .9 * l.width() : f[0], m = Math.abs(e("#mCSB_" + n.idx + "_container")[0].offsetLeft), p = c[1][0].offsetLeft, g = c[1].parent().width() - c[1].width(), v = "y" === i.mouseWheel.axis ? t.deltaY || a : t.deltaX; else var u = "y", f = [Math.round(r * n.scrollRatio.y), parseInt(i.mouseWheel.scrollAmount)], h = "auto" !== i.mouseWheel.scrollAmount ? f[1] : f[0] >= l.height() ? .9 * l.height() : f[0], m = Math.abs(e("#mCSB_" + n.idx + "_container")[0].offsetTop), p = c[0][0].offsetTop, g = c[0].parent().height() - c[0].height(), v = t.deltaY || a; "y" === u && !n.overflowed[0] || "x" === u && !n.overflowed[1] || ((i.mouseWheel.invert || t.webkitDirectionInvertedFromDevice) && (v = -v), i.mouseWheel.normalizeDelta && (v = 0 > v ? -1 : 1), (v > 0 && 0 !== p || 0 > v && p !== g || i.mouseWheel.preventDefault) && (t.stopImmediatePropagation(), t.preventDefault()), t.deltaFactor < 5 && !i.mouseWheel.normalizeDelta && (h = t.deltaFactor, d = 17), G(o, (m - v * h).toString(), { dir: u, dur: d })) } } if (e(this).data(a)) { var o = e(this), n = o.data(a), i = n.opt, r = a + "_" + n.idx, l = e("#mCSB_" + n.idx), c = [e("#mCSB_" + n.idx + "_dragger_vertical"), e("#mCSB_" + n.idx + "_dragger_horizontal")], d = e("#mCSB_" + n.idx + "_container").find("iframe"); d.length && d.each(function () { e(this).bind("load", function () { A(this) && e(this.contentDocument || this.contentWindow.document).bind("mousewheel." + r, function (e, o) { t(e, o) }) }) }), l.bind("mousewheel." + r, function (e, o) { t(e, o) }) } }, R = new Object, A = function (t) { var o = !1, a = !1, n = null; if (void 0 === t ? a = "#empty" : void 0 !== e(t).attr("id") && (a = e(t).attr("id")), a !== !1 && void 0 !== R[a]) return R[a]; if (t) { try { var i = t.contentDocument || t.contentWindow.document; n = i.body.innerHTML } catch (r) { } o = null !== n } else { try { var i = top.document; n = i.body.innerHTML } catch (r) { } o = null !== n } return a !== !1 && (R[a] = o), o }, L = function (e) { var t = this.find("iframe"); if (t.length) { var o = e ? "auto" : "none"; t.css("pointer-events", o) } }, z = function (t, o) { var n = o.nodeName.toLowerCase(), i = t.data(a).opt.mouseWheel.disableOver, r = ["select", "textarea"]; return e.inArray(n, i) > -1 && !(e.inArray(n, r) > -1 && !e(o).is(":focus")) }, P = function () { var t, o = e(this), n = o.data(a), i = a + "_" + n.idx, r = e("#mCSB_" + n.idx + "_container"), l = r.parent(), s = e(".mCSB_" + n.idx + "_scrollbar ." + d[12]); s.bind("mousedown." + i + " touchstart." + i + " pointerdown." + i + " MSPointerDown." + i, function (o) { c = !0, e(o.target).hasClass("mCSB_dragger") || (t = 1) }).bind("touchend." + i + " pointerup." + i + " MSPointerUp." + i, function () { c = !1 }).bind("click." + i, function (a) { if (t && (t = 0, e(a.target).hasClass(d[12]) || e(a.target).hasClass("mCSB_draggerRail"))) { Q(o); var i = e(this), s = i.find(".mCSB_dragger"); if (i.parent(".mCSB_scrollTools_horizontal").length > 0) { if (!n.overflowed[1]) return; var c = "x", u = a.pageX > s.offset().left ? -1 : 1, f = Math.abs(r[0].offsetLeft) - u * (.9 * l.width()) } else { if (!n.overflowed[0]) return; var c = "y", u = a.pageY > s.offset().top ? -1 : 1, f = Math.abs(r[0].offsetTop) - u * (.9 * l.height()) } G(o, f.toString(), { dir: c, scrollEasing: "mcsEaseInOut" }) } }) }, H = function () { var t = e(this), o = t.data(a), n = o.opt, i = a + "_" + o.idx, r = e("#mCSB_" + o.idx + "_container"), l = r.parent(); r.bind("focusin." + i, function () { var o = e(document.activeElement), a = r.find(".mCustomScrollBox").length, i = 0; o.is(n.advanced.autoScrollOnFocus) && (Q(t), clearTimeout(t[0]._focusTimeout), t[0]._focusTimer = a ? (i + 17) * a : 0, t[0]._focusTimeout = setTimeout(function () { var e = [ae(o)[0], ae(o)[1]], a = [r[0].offsetTop, r[0].offsetLeft], s = [a[0] + e[0] >= 0 && a[0] + e[0] < l.height() - o.outerHeight(!1), a[1] + e[1] >= 0 && a[0] + e[1] < l.width() - o.outerWidth(!1)], c = "yx" !== n.axis || s[0] || s[1] ? "all" : "none"; "x" === n.axis || s[0] || G(t, e[0].toString(), { dir: "y", scrollEasing: "mcsEaseInOut", overwrite: c, dur: i }), "y" === n.axis || s[1] || G(t, e[1].toString(), { dir: "x", scrollEasing: "mcsEaseInOut", overwrite: c, dur: i }) }, t[0]._focusTimer)) }) }, U = function () { var t = e(this), o = t.data(a), n = a + "_" + o.idx, i = e("#mCSB_" + o.idx + "_container").parent(); i.bind("scroll." + n, function () { 0 === i.scrollTop() && 0 === i.scrollLeft() || e(".mCSB_" + o.idx + "_scrollbar").css("visibility", "hidden") }) }, F = function () { var t = e(this), o = t.data(a), n = o.opt, i = o.sequential, r = a + "_" + o.idx, l = ".mCSB_" + o.idx + "_scrollbar", s = e(l + ">a"); s.bind("contextmenu." + r, function (e) { e.preventDefault() }).bind("mousedown." + r + " touchstart." + r + " pointerdown." + r + " MSPointerDown." + r + " mouseup." + r + " touchend." + r + " pointerup." + r + " MSPointerUp." + r + " mouseout." + r + " pointerout." + r + " MSPointerOut." + r + " click." + r, function (a) { function r(e, o) { i.scrollAmount = n.scrollButtons.scrollAmount, j(t, e, o) } if (a.preventDefault(), ee(a)) { var l = e(this).attr("class"); switch (i.type = n.scrollButtons.scrollType, a.type) { case "mousedown": case "touchstart": case "pointerdown": case "MSPointerDown": if ("stepped" === i.type) return; c = !0, o.tweenRunning = !1, r("on", l); break; case "mouseup": case "touchend": case "pointerup": case "MSPointerUp": case "mouseout": case "pointerout": case "MSPointerOut": if ("stepped" === i.type) return; c = !1, i.dir && r("off", l); break; case "click": if ("stepped" !== i.type || o.tweenRunning) return; r("on", l) } } }) }, q = function () { function t(t) { function a(e, t) { r.type = i.keyboard.scrollType, r.scrollAmount = i.keyboard.scrollAmount, "stepped" === r.type && n.tweenRunning || j(o, e, t) } switch (t.type) { case "blur": n.tweenRunning && r.dir && a("off", null); break; case "keydown": case "keyup": var l = t.keyCode ? t.keyCode : t.which, s = "on"; if ("x" !== i.axis && (38 === l || 40 === l) || "y" !== i.axis && (37 === l || 39 === l)) { if ((38 === l || 40 === l) && !n.overflowed[0] || (37 === l || 39 === l) && !n.overflowed[1]) return; "keyup" === t.type && (s = "off"), e(document.activeElement).is(u) || (t.preventDefault(), t.stopImmediatePropagation(), a(s, l)) } else if (33 === l || 34 === l) { if ((n.overflowed[0] || n.overflowed[1]) && (t.preventDefault(), t.stopImmediatePropagation()), "keyup" === t.type) { Q(o); var f = 34 === l ? -1 : 1; if ("x" === i.axis || "yx" === i.axis && n.overflowed[1] && !n.overflowed[0]) var h = "x", m = Math.abs(c[0].offsetLeft) - f * (.9 * d.width()); else var h = "y", m = Math.abs(c[0].offsetTop) - f * (.9 * d.height()); G(o, m.toString(), { dir: h, scrollEasing: "mcsEaseInOut" }) } } else if ((35 === l || 36 === l) && !e(document.activeElement).is(u) && ((n.overflowed[0] || n.overflowed[1]) && (t.preventDefault(), t.stopImmediatePropagation()), "keyup" === t.type)) { if ("x" === i.axis || "yx" === i.axis && n.overflowed[1] && !n.overflowed[0]) var h = "x", m = 35 === l ? Math.abs(d.width() - c.outerWidth(!1)) : 0; else var h = "y", m = 35 === l ? Math.abs(d.height() - c.outerHeight(!1)) : 0; G(o, m.toString(), { dir: h, scrollEasing: "mcsEaseInOut" }) } } } var o = e(this), n = o.data(a), i = n.opt, r = n.sequential, l = a + "_" + n.idx, s = e("#mCSB_" + n.idx), c = e("#mCSB_" + n.idx + "_container"), d = c.parent(), u = "input,textarea,select,datalist,keygen,[contenteditable='true']", f = c.find("iframe"), h = ["blur." + l + " keydown." + l + " keyup." + l]; f.length && f.each(function () { e(this).bind("load", function () { A(this) && e(this.contentDocument || this.contentWindow.document).bind(h[0], function (e) { t(e) }) }) }), s.attr("tabindex", "0").bind(h[0], function (e) { t(e) }) }, j = function (t, o, n, i, r) { function l(e) { u.snapAmount && (f.scrollAmount = u.snapAmount instanceof Array ? "x" === f.dir[0] ? u.snapAmount[1] : u.snapAmount[0] : u.snapAmount); var o = "stepped" !== f.type, a = r ? r : e ? o ? p / 1.5 : g : 1e3 / 60, n = e ? o ? 7.5 : 40 : 2.5, s = [Math.abs(h[0].offsetTop), Math.abs(h[0].offsetLeft)], d = [c.scrollRatio.y > 10 ? 10 : c.scrollRatio.y, c.scrollRatio.x > 10 ? 10 : c.scrollRatio.x], m = "x" === f.dir[0] ? s[1] + f.dir[1] * (d[1] * n) : s[0] + f.dir[1] * (d[0] * n), v = "x" === f.dir[0] ? s[1] + f.dir[1] * parseInt(f.scrollAmount) : s[0] + f.dir[1] * parseInt(f.scrollAmount), x = "auto" !== f.scrollAmount ? v : m, _ = i ? i : e ? o ? "mcsLinearOut" : "mcsEaseInOut" : "mcsLinear", w = !!e; return e && 17 > a && (x = "x" === f.dir[0] ? s[1] : s[0]), G(t, x.toString(), { dir: f.dir[0], scrollEasing: _, dur: a, onComplete: w }), e ? void (f.dir = !1) : (clearTimeout(f.step), void (f.step = setTimeout(function () { l() }, a))) } function s() { clearTimeout(f.step), $(f, "step"), Q(t) } var c = t.data(a), u = c.opt, f = c.sequential, h = e("#mCSB_" + c.idx + "_container"), m = "stepped" === f.type, p = u.scrollInertia < 26 ? 26 : u.scrollInertia, g = u.scrollInertia < 1 ? 17 : u.scrollInertia; switch (o) { case "on": if (f.dir = [n === d[16] || n === d[15] || 39 === n || 37 === n ? "x" : "y", n === d[13] || n === d[15] || 38 === n || 37 === n ? -1 : 1], Q(t), oe(n) && "stepped" === f.type) return; l(m); break; case "off": s(), (m || c.tweenRunning && f.dir) && l(!0) } }, Y = function (t) { var o = e(this).data(a).opt, n = []; return "function" == typeof t && (t = t()), t instanceof Array ? n = t.length > 1 ? [t[0], t[1]] : "x" === o.axis ? [null, t[0]] : [t[0], null] : (n[0] = t.y ? t.y : t.x || "x" === o.axis ? null : t, n[1] = t.x ? t.x : t.y || "y" === o.axis ? null : t), "function" == typeof n[0] && (n[0] = n[0]()), "function" == typeof n[1] && (n[1] = n[1]()), n }, X = function (t, o) { if (null != t && "undefined" != typeof t) { var n = e(this), i = n.data(a), r = i.opt, l = e("#mCSB_" + i.idx + "_container"), s = l.parent(), c = typeof t; o || (o = "x" === r.axis ? "x" : "y"); var d = "x" === o ? l.outerWidth(!1) - s.width() : l.outerHeight(!1) - s.height(), f = "x" === o ? l[0].offsetLeft : l[0].offsetTop, h = "x" === o ? "left" : "top"; switch (c) { case "function": return t(); case "object": var m = t.jquery ? t : e(t); if (!m.length) return; return "x" === o ? ae(m)[1] : ae(m)[0]; case "string": case "number": if (oe(t)) return Math.abs(t); if (-1 !== t.indexOf("%")) return Math.abs(d * parseInt(t) / 100); if (-1 !== t.indexOf("-=")) return Math.abs(f - parseInt(t.split("-=")[1])); if (-1 !== t.indexOf("+=")) { var p = f + parseInt(t.split("+=")[1]); return p >= 0 ? 0 : Math.abs(p) } if (-1 !== t.indexOf("px") && oe(t.split("px")[0])) return Math.abs(t.split("px")[0]); if ("top" === t || "left" === t) return 0; if ("bottom" === t) return Math.abs(s.height() - l.outerHeight(!1)); if ("right" === t) return Math.abs(s.width() - l.outerWidth(!1)); if ("first" === t || "last" === t) { var m = l.find(":" + t); return "x" === o ? ae(m)[1] : ae(m)[0] } return e(t).length ? "x" === o ? ae(e(t))[1] : ae(e(t))[0] : (l.css(h, t), void u.update.call(null, n[0])) } } }, N = function (t) {
            function o() { return clearTimeout(f[0].autoUpdate), 0 === l.parents("html").length ? void (l = null) : void (f[0].autoUpdate = setTimeout(function () { return c.advanced.updateOnSelectorChange && (s.poll.change.n = i(), s.poll.change.n !== s.poll.change.o) ? (s.poll.change.o = s.poll.change.n, void r(3)) : c.advanced.updateOnContentResize && (s.poll.size.n = l[0].scrollHeight + l[0].scrollWidth + f[0].offsetHeight + l[0].offsetHeight + l[0].offsetWidth, s.poll.size.n !== s.poll.size.o) ? (s.poll.size.o = s.poll.size.n, void r(1)) : !c.advanced.updateOnImageLoad || "auto" === c.advanced.updateOnImageLoad && "y" === c.axis || (s.poll.img.n = f.find("img").length, s.poll.img.n === s.poll.img.o) ? void ((c.advanced.updateOnSelectorChange || c.advanced.updateOnContentResize || c.advanced.updateOnImageLoad) && o()) : (s.poll.img.o = s.poll.img.n, void f.find("img").each(function () { n(this) })) }, c.advanced.autoUpdateTimeout)) } function n(t) {
                function o(e, t) {
                    return function () {
                        return t.apply(e, arguments);
                    };
                } function a() { this.onload = null, e(t).addClass(d[2]), r(2) } if (e(t).hasClass(d[2])) return void r(); var n = new Image; n.onload = o(n, a), n.src = t.src
            } function i() { c.advanced.updateOnSelectorChange === !0 && (c.advanced.updateOnSelectorChange = "*"); var e = 0, t = f.find(c.advanced.updateOnSelectorChange); return c.advanced.updateOnSelectorChange && t.length > 0 && t.each(function () { e += this.offsetHeight + this.offsetWidth }), e } function r(e) { clearTimeout(f[0].autoUpdate), u.update.call(null, l[0], e) } var l = e(this), s = l.data(a), c = s.opt, f = e("#mCSB_" + s.idx + "_container"); return t ? (clearTimeout(f[0].autoUpdate), void $(f[0], "autoUpdate")) : void o()
        }, V = function (e, t, o) { return Math.round(e / t) * t - o; }, Q = function (t) { var o = t.data(a), n = e("#mCSB_" + o.idx + "_container,#mCSB_" + o.idx + "_container_wrapper,#mCSB_" + o.idx + "_dragger_vertical,#mCSB_" + o.idx + "_dragger_horizontal"); n.each(function () { Z.call(this) }) }, G = function (t, o, n) { function i(e) { return s && c.callbacks[e] && "function" == typeof c.callbacks[e] } function r() { return [c.callbacks.alwaysTriggerOffsets || w >= S[0] + y, c.callbacks.alwaysTriggerOffsets || -B >= w] } function l() { var e = [h[0].offsetTop, h[0].offsetLeft], o = [x[0].offsetTop, x[0].offsetLeft], a = [h.outerHeight(!1), h.outerWidth(!1)], i = [f.height(), f.width()]; t[0].mcs = { content: h, top: e[0], left: e[1], draggerTop: o[0], draggerLeft: o[1], topPct: Math.round(100 * Math.abs(e[0]) / (Math.abs(a[0]) - i[0])), leftPct: Math.round(100 * Math.abs(e[1]) / (Math.abs(a[1]) - i[1])), direction: n.dir } } var s = t.data(a), c = s.opt, d = { trigger: "internal", dir: "y", scrollEasing: "mcsEaseOut", drag: !1, dur: c.scrollInertia, overwrite: "all", callbacks: !0, onStart: !0, onUpdate: !0, onComplete: !0 }, n = e.extend(d, n), u = [n.dur, n.drag ? 0 : n.dur], f = e("#mCSB_" + s.idx), h = e("#mCSB_" + s.idx + "_container"), m = h.parent(), p = c.callbacks.onTotalScrollOffset ? Y.call(t, c.callbacks.onTotalScrollOffset) : [0, 0], g = c.callbacks.onTotalScrollBackOffset ? Y.call(t, c.callbacks.onTotalScrollBackOffset) : [0, 0]; if (s.trigger = n.trigger, 0 === m.scrollTop() && 0 === m.scrollLeft() || (e(".mCSB_" + s.idx + "_scrollbar").css("visibility", "visible"), m.scrollTop(0).scrollLeft(0)), "_resetY" !== o || s.contentReset.y || (i("onOverflowYNone") && c.callbacks.onOverflowYNone.call(t[0]), s.contentReset.y = 1), "_resetX" !== o || s.contentReset.x || (i("onOverflowXNone") && c.callbacks.onOverflowXNone.call(t[0]), s.contentReset.x = 1), "_resetY" !== o && "_resetX" !== o) { if (!s.contentReset.y && t[0].mcs || !s.overflowed[0] || (i("onOverflowY") && c.callbacks.onOverflowY.call(t[0]), s.contentReset.x = null), !s.contentReset.x && t[0].mcs || !s.overflowed[1] || (i("onOverflowX") && c.callbacks.onOverflowX.call(t[0]), s.contentReset.x = null), c.snapAmount) { var v = c.snapAmount instanceof Array ? "x" === n.dir ? c.snapAmount[1] : c.snapAmount[0] : c.snapAmount; o = V(o, v, c.snapOffset) } switch (n.dir) { case "x": var x = e("#mCSB_" + s.idx + "_dragger_horizontal"), _ = "left", w = h[0].offsetLeft, S = [f.width() - h.outerWidth(!1), x.parent().width() - x.width()], b = [o, 0 === o ? 0 : o / s.scrollRatio.x], y = p[1], B = g[1], T = y > 0 ? y / s.scrollRatio.x : 0, k = B > 0 ? B / s.scrollRatio.x : 0; break; case "y": var x = e("#mCSB_" + s.idx + "_dragger_vertical"), _ = "top", w = h[0].offsetTop, S = [f.height() - h.outerHeight(!1), x.parent().height() - x.height()], b = [o, 0 === o ? 0 : o / s.scrollRatio.y], y = p[0], B = g[0], T = y > 0 ? y / s.scrollRatio.y : 0, k = B > 0 ? B / s.scrollRatio.y : 0 }b[1] < 0 || 0 === b[0] && 0 === b[1] ? b = [0, 0] : b[1] >= S[1] ? b = [S[0], S[1]] : b[0] = -b[0], t[0].mcs || (l(), i("onInit") && c.callbacks.onInit.call(t[0])), clearTimeout(h[0].onCompleteTimeout), J(x[0], _, Math.round(b[1]), u[1], n.scrollEasing), !s.tweenRunning && (0 === w && b[0] >= 0 || w === S[0] && b[0] <= S[0]) || J(h[0], _, Math.round(b[0]), u[0], n.scrollEasing, n.overwrite, { onStart: function () { n.callbacks && n.onStart && !s.tweenRunning && (i("onScrollStart") && (l(), c.callbacks.onScrollStart.call(t[0])), s.tweenRunning = !0, C(x), s.cbOffsets = r()) }, onUpdate: function () { n.callbacks && n.onUpdate && i("whileScrolling") && (l(), c.callbacks.whileScrolling.call(t[0])) }, onComplete: function () { if (n.callbacks && n.onComplete) { "yx" === c.axis && clearTimeout(h[0].onCompleteTimeout); var e = h[0].idleTimer || 0; h[0].onCompleteTimeout = setTimeout(function () { i("onScroll") && (l(), c.callbacks.onScroll.call(t[0])), i("onTotalScroll") && b[1] >= S[1] - T && s.cbOffsets[0] && (l(), c.callbacks.onTotalScroll.call(t[0])), i("onTotalScrollBack") && b[1] <= k && s.cbOffsets[1] && (l(), c.callbacks.onTotalScrollBack.call(t[0])), s.tweenRunning = !1, h[0].idleTimer = 0, C(x, "hide") }, e) } } }) } }, J = function (e, t, o, a, n, i, r) { function l() { S.stop || (x || m.call(), x = K() - v, s(), x >= S.time && (S.time = x > S.time ? x + f - (x - S.time) : x + f - 1, S.time < x + 1 && (S.time = x + 1)), S.time < a ? S.id = h(l) : g.call()) } function s() { a > 0 ? (S.currVal = u(S.time, _, b, a, n), w[t] = Math.round(S.currVal) + "px") : w[t] = o + "px", p.call() } function c() { f = 1e3 / 60, S.time = x + f, h = window.requestAnimationFrame ? window.requestAnimationFrame : function (e) { return s(), setTimeout(e, .01) }, S.id = h(l) } function d() { null != S.id && (window.requestAnimationFrame ? window.cancelAnimationFrame(S.id) : clearTimeout(S.id), S.id = null) } function u(e, t, o, a, n) { switch (n) { case "linear": case "mcsLinear": return o * e / a + t; case "mcsLinearOut": return e /= a, e-- , o * Math.sqrt(1 - e * e) + t; case "easeInOutSmooth": return e /= a / 2, 1 > e ? o / 2 * e * e + t : (e-- , -o / 2 * (e * (e - 2) - 1) + t); case "easeInOutStrong": return e /= a / 2, 1 > e ? o / 2 * Math.pow(2, 10 * (e - 1)) + t : (e-- , o / 2 * (-Math.pow(2, -10 * e) + 2) + t); case "easeInOut": case "mcsEaseInOut": return e /= a / 2, 1 > e ? o / 2 * e * e * e + t : (e -= 2, o / 2 * (e * e * e + 2) + t); case "easeOutSmooth": return e /= a, e-- , -o * (e * e * e * e - 1) + t; case "easeOutStrong": return o * (-Math.pow(2, -10 * e / a) + 1) + t; case "easeOut": case "mcsEaseOut": default: var i = (e /= a) * e, r = i * e; return t + o * (.499999999999997 * r * i + -2.5 * i * i + 5.5 * r + -6.5 * i + 4 * e) } } e._mTween || (e._mTween = { top: {}, left: {} }); var f, h, r = r || {}, m = r.onStart || function () { }, p = r.onUpdate || function () { }, g = r.onComplete || function () { }, v = K(), x = 0, _ = e.offsetTop, w = e.style, S = e._mTween[t]; "left" === t && (_ = e.offsetLeft); var b = o - _; S.stop = 0, "none" !== i && d(), c() }, K = function () { return window.performance && window.performance.now ? window.performance.now() : window.performance && window.performance.webkitNow ? window.performance.webkitNow() : Date.now ? Date.now() : (new Date).getTime() }, Z = function () { var e = this; e._mTween || (e._mTween = { top: {}, left: {} }); for (var t = ["top", "left"], o = 0; o < t.length; o++) { var a = t[o]; e._mTween[a].id && (window.requestAnimationFrame ? window.cancelAnimationFrame(e._mTween[a].id) : clearTimeout(e._mTween[a].id), e._mTween[a].id = null, e._mTween[a].stop = 1) } }, $ = function (e, t) { try { delete e[t] } catch (o) { e[t] = null } }, ee = function (e) { return !(e.which && 1 !== e.which) }, te = function (e) { var t = e.originalEvent.pointerType; return !(t && "touch" !== t && 2 !== t) }, oe = function (e) { return !isNaN(parseFloat(e)) && isFinite(e) }, ae = function (e) { var t = e.parents(".mCSB_container"); return [e.offset().top - t.offset().top, e.offset().left - t.offset().left] }, ne = function () { function e() { var e = ["webkit", "moz", "ms", "o"]; if ("hidden" in document) return "hidden"; for (var t = 0; t < e.length; t++)if (e[t] + "Hidden" in document) return e[t] + "Hidden"; return null } var t = e(); return t ? document[t] : !1 }; e.fn[o] = function (t) { return u[t] ? u[t].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof t && t ? void e.error("Method " + t + " does not exist") : u.init.apply(this, arguments) }, e[o] = function (t) { return u[t] ? u[t].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof t && t ? void e.error("Method " + t + " does not exist") : u.init.apply(this, arguments) }, e[o].defaults = i, window[o] = !0, e(window).bind("load", function () { e(n)[o](), e.extend(e.expr[":"], { mcsInView: e.expr[":"].mcsInView || function (t) { var o, a, n = e(t), i = n.parents(".mCSB_container"); if (i.length) return o = i.parent(), a = [i[0].offsetTop, i[0].offsetLeft], a[0] + ae(n)[0] >= 0 && a[0] + ae(n)[0] < o.height() - n.outerHeight(!1) && a[1] + ae(n)[1] >= 0 && a[1] + ae(n)[1] < o.width() - n.outerWidth(!1) }, mcsInSight: e.expr[":"].mcsInSight || function (t, o, a) { var n, i, r, l, s = e(t), c = s.parents(".mCSB_container"), d = "exact" === a[3] ? [[1, 0], [1, 0]] : [[.9, .1], [.6, .4]]; if (c.length) return n = [s.outerHeight(!1), s.outerWidth(!1)], r = [c[0].offsetTop + ae(s)[0], c[0].offsetLeft + ae(s)[1]], i = [c.parent()[0].offsetHeight, c.parent()[0].offsetWidth], l = [n[0] < i[0] ? d[0] : d[1], n[1] < i[1] ? d[0] : d[1]], r[0] - i[0] * l[0][0] < 0 && r[0] + n[0] - i[0] * l[0][1] >= 0 && r[1] - i[1] * l[1][0] < 0 && r[1] + n[1] - i[1] * l[1][1] >= 0 }, mcsOverflow: e.expr[":"].mcsOverflow || function (t) { var o = e(t).data(a); if (o) return o.overflowed[0] || o.overflowed[1] } }) })
    });
});