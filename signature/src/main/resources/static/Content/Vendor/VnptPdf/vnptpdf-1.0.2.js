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
            sigPage: 1,
            useLastPage: false,
            location: '',
            reason: '',
            x: 20,
            y: 20,
            width: 200,
            height: 100,
            comments: [],
            pdfFile: {
                file: null,
                totalPages: 0
            },
            fontSize: 8,
            visibleType: 2,
            signatureImg: "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"
        };
        this.wrapper = element;
        this.CallBack = options.Callback;
        this.settings = $.extend(true, defaults, options);
        this.pdfPages = [];
        this.show = false;
        
        $('body').append('<div id="dpi" style="height: 1in; left: -100%; position: absolute; top: -100%; width: 1in;"></div>');
    }

    /**
     * */
    VnptPdf.prototype.initUI = function () {
        this.wrapper.html(pdfWorkingArea);
        $('#dragThis').hide();

        this.signatureBox = $('#dragThis');
        this.changeSignatureVisibleType();
        this.changeSignatureVisibleImg();

        this.visibleTypeInput = $('input[name=sign-visible-type]');
        $("input[name='sign-visible-type'][value='" + this.settings.visibleType + "']").attr("checked", true);
        this.visibleTypeInput.change({ msgTarget: this }, this.changeSignatureVisibleTypeEvent);

        $('#pdf-sign-page').val(this.settings.sigPage);
        this.signaturePageBtn = $('#pdf-sign-page-btn');
        this.signaturePageBtn.click({ msgTarget: this }, this.changeSignaturePageEvent);

        $('#pdf-sign-font').val(this.settings.fontSize);
        this.signatureFontSizeBtn = $('#pdf-sign-font-btn');
        this.signatureFontSizeBtn.click({ msgTarget: this }, this.changeSignatureFontSizeEvent);
        this.changeSignatureFontSize();

        this.signatureImgBtn = $('#signature-img-btn');
        this.signatureImgBtn.click({ msgTarget: this }, this.changeSignatureImageEvent);

        this.signatureCommentBtn = $('#add-comment-btn');
        this.signatureCommentBtn.click({ msgTarget: this }, this.addComment);

        $(".pdf-action-menu").mCustomScrollbar({
            theme: "minimal-dark"
        });
        const self = this;

        $('.page-aside-switch').click(function () {
            let menuW = $('.pdf-action-menu').width();
            $('.pdf-action-menu').css('width', 370 - menuW);
            if (menuW > 0) {
                $('.pdf-action-menu').css('padding', '0');
                $('.pdf-page').css('padding-left', '0');
            } else {
                $('.pdf-action-menu').css('padding', '10px 25px');
                $('.pdf-action-menu').css('padding-top', '45px');
                $('.pdf-page').css('padding-left', '420px');
            }
            self.windowResizeEventHandle();
        });
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
        fileReader.onload = function () {
            var typedarray = new Uint8Array(this.result);
            self.initData(typedarray);
        };
        fileReader.readAsArrayBuffer(file);
    };

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
            self.initSignatureBox();
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

    /**
     * Handle change visible type radio button checked
     * @param {any} evt Radio button checked event
     */
    VnptPdf.prototype.changeSignatureVisibleTypeEvent = function (evt) {
        const self = evt.data.msgTarget;
        self.settings.visibleType = evt.target.value;
        self.changeSignatureVisibleType();
    };

    /**
     * Change signature visible type
     * */
    VnptPdf.prototype.changeSignatureVisibleType = function () {
        const type = '' + this.settings.visibleType;
        const signatureBoxContent = this.signatureBox.find('#sign-box-content');
        signatureBoxContent.empty();
        switch (type) {
            case '1':
                signatureBoxContent.html(_textOnly);
                break;
            case '2':
                signatureBoxContent.html(_textandLogoLeft);
                break;
            case '3':
                signatureBoxContent.html(_logoOnly);
                break;
            case '4':
                signatureBoxContent.html(_textAndLogoTop);
                break;
            case '5':
                signatureBoxContent.html(_textAndBackground);
                break;
        }
    };

    VnptPdf.prototype.changeSignatureFontSizeEvent = function (evt) {
        const self = evt.data.msgTarget;
        self.settings.fontSize = $('#pdf-sign-font').val();
        self.changeSignatureFontSize();
    };

    VnptPdf.prototype.changeSignatureFontSize = function () {
        const dpi = document.getElementById('dpi').offsetWidth;
        const size = Math.ceil(this.settings.fontSize * dpi / 72);
        this.signatureBox.css('font-size', size + 'px');
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
        styleElem.innerHTML = ".signature-img::before{background-image: url(data:image/png;base64," + this.settings.signatureImg + ")}";
    };

    /**
     * */
    VnptPdf.prototype.initSignatureBox = function () {
        const page = this.settings.sigPage;
        const pdfPage = $('#pdfPage_' + page);
        const boundX = pdfPage[0].offsetLeft;
        const boundY = pdfPage[0].offsetTop;
        const pageHeight = this.pdfPages[page - 1].height;
        const x = this.settings.x;
        const y = this.settings.y;
        const height = this.settings.height;
        const width = this.settings.width;
        const dpi = document.getElementById('dpi').offsetWidth;

        var yPos = Math.floor((pageHeight - y - height) * dpi / 72) + 9 - 4 + boundY;
        var xPos = boundX + 9 + Math.floor(x * dpi / 72);
        var h = Math.floor(height * dpi / 72);
        var w = Math.floor(width * dpi / 72);
        this.signatureBox.css({ 'top': yPos, 'left': xPos, 'height': h, 'width': w, 'position': 'absolute' });
        this.signatureBox.show();
        this.initSignatureBoxEvent();
        const self = this;
        window.addEventListener('resize', function () {
            self.windowResizeEventHandle();
        });
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

    VnptPdf.prototype.initComments = function () {
        const self = this;
        this.settings.comments.forEach(function (comment) {
            self.initComment(comment);
        });
    };

    VnptPdf.prototype.initComment = function (comment) {
        const com = _comment.replace('COMMENT', comment.text);
        const commentElement = $(com).appendTo(this.wrapper.find('.pdf-page'));
        comment.element = commentElement;

        const commentRow = $('<tr></tr>').appendTo('#pdf-comments-table');
        comment.commentRow = commentRow;
        commentRow.append('<td>' + (this.settings.comments.indexOf(comment) + 1) + '</td>');
        commentRow.append('<td><span class="pdf-size-lbl">Nội dung</span></td>');
        commentRow.append('<td><input class="sign-pos comment-val" type="text" value="' + comment.text + '" disabled /></td >');
        commentRow.append('<td><span class="pdf-size-lbl comment-page-input">Page </span></td>');
        commentRow.append('<td><input class="sign-pos comment-page-input" value="' + comment.page + '" type="text" disabled /></td>');

        const actionCell = $('<td class="comment-act">' + _trashIcon + '</td>').appendTo(commentRow);
        actionCell.click({ msgTarget: this, elmentTarget: comment }, this.removeComment);

        const pdfPage = $('#pdfPage_' + comment.page);
        const boundX = pdfPage[0].offsetLeft;
        const boundY = pdfPage[0].offsetTop;
        const pageHeight = this.pdfPages[comment.page - 1].height;
        const dpi = document.getElementById('dpi').offsetWidth;

        const x = comment.x || 50;
        const y = comment.y || 50;
        const width = comment.width || 200;
        const height = comment.height || 15;

        var yPos = Math.floor((pageHeight - y - height) * dpi / 72) + 9 - 4 + boundY;
        var xPos = boundX + 9 + Math.floor(x * dpi / 72);
        var h = Math.floor(height * dpi / 72);
        var w = Math.floor(width * dpi / 72);
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
                const yPos = pageHeight - Math.ceil((top - boundY - 9) / dpi * 72) - h;
                comment.y = yPos;
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
    };

    VnptPdf.prototype.removeComment = function (evt) {
        const self = evt.data.msgTarget;
        const comment = evt.data.elmentTarget;
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

    /**
     * 
     * @param {any} evt Add signature comment event
     */
    VnptPdf.prototype.addComment = function (evt) {
        const self = evt.data.msgTarget;
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
            x: 200,
            y: 400,
            width: 200,
            height: 20,
            page: p,
            text: text
        };

        self.settings.comments.push(comm);
        self.initComment(comm);
        $('#comment-text').val('');
        $('#comment-text-page').val('');
    };

    /**
     * */
    VnptPdf.prototype.windowResizeEventHandle = function () {
        if (!this.show) {
            return;
        }
        console.log('handle');
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
                page: comment.page
            });
        });

        return {
            page: this.settings.sigPage,
            fontSize: this.settings.fontSize,
            imageSrc: this.settings.signatureImg,
            rectangle: signRectangle,
            visibleType: this.settings.visibleType,
            //comments: comments,
            comment: Base64.encode(JSON.stringify(comments))
        };
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
        '          <img class="navbar-brand-logo" src="data:image/png;base64,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" title="VNPT-Kyso">' +
        '          <span class="navbar-brand-text hidden-xs-down"> VNPT-Kyso</span>' +
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
        '                <legend>Vị trí chữ ký</legend>' +
        '                <table>' +
        '                    <tr>' +
        '                        <td>' +
        '                            <span class="pdf-size-lbl">X Pos = </span>' +
        '                        </td>' +
        '                        <td>' +
        '                            <input class="sign-pos" id="signbox-xpos" type="text" value="15" disabled />' +
        '                        </td>' +
        '                        <td>' +
        '                            <span class="pdf-size-lbl">  Y Pos = </span>' +
        '                        </td>' +
        '                        <td>' +
        '                            <input class="sign-pos" id="signbox-ypos" type="text" value="765" disabled />' +
        '                        </td>' +
        '                    </tr>' +
        '                    <tr>' +
        '                        <td>' +
        '                            <span class="pdf-size-lbl">Width = </span>' +
        '                        </td>' +
        '                        <td>' +
        '                            <input class="sign-pos" id="signbox-width" type="text" value="200" disabled />' +
        '                        </td>' +
        '                        <td>' +
        '                            <span class="pdf-size-lbl">  Height = </span>' +
        '                        </td>' +
        '                        <td>' +
        '                            <input class="sign-pos" id="signbox-height" type="text" value="60" disabled />' +
        '                        </td>' +
        '                    </tr>' +
        '                    <tr>' +
        '                        <td> </td>' +
        '                    </tr>' +
        '                    <tr>' +
        '                        <td colspan="4">' +
        '                            <span>Trang chứa chữ ký:</span>' +
        '                        </td>' +
        '                    </tr>' +
        '                    <tr>' +
        '                        <td></td>' +
        '                        <td>' +
        '                            <input type="text" id="pdf-sign-page" value="1" />' +
        '                        </td>' +
        '                        <td>' +
        '                            <span class="pdf-size-lbl pdf-all-page-lbl" id="pdf-total-pages"></span>' +
        '                        </td>' +
        '                        <td>' +
        '                            <button class="pdf-btn" id="pdf-sign-page-btn" style="width: 70px;">Set</button>' +
        '                        </td>' +
        '                    </tr>' +
        '                    <tr>' +
        '                        <td> </td>' +
        '                    </tr>' +
        '                    <tr>' +
        '                        <td colspan="4">' +
        '                            <span>Cỡ chữ hiển thị: </span>' +
        '                        </td>' +
        '                    </tr>' +
        '                    <tr>' +
        '                        <td></td>' +
        '                        <td>' +
        '                            <input type="text" id="pdf-sign-font" value="8" />' +
        '                        </td>' +
        '                        <td> </td>' +
        '                        <td>' +
        '                            <button class="pdf-btn" id="pdf-sign-font-btn" style="width: 70px;">Set</button>' +
        '                        </td>' +
        '                    </tr>' +
        '' +
        '                </table>' +
        '            </fieldset>' +
        '            <fieldset>' +
        '                <legend>Kiểu hiển thị chữ ký</legend>' +
        '                <div>' +
        '                    <input type="radio" name="sign-visible-type" value="1"> Chỉ hiển thị text<br />' +
        '                    <input type="radio" name="sign-visible-type" value="2"> Hiển thị text và logo bên trái<br />' +
        '                    <input type="radio" name="sign-visible-type" value="3"> Chỉ hiển thị logo<br />' +
        '                    <input type="radio" name="sign-visible-type" value="4"> Hiển thị text và logo phía trên<br />' +
        '                    <input type="radio" name="sign-visible-type" value="5"> Hiển thị text và background<br />' +
        '                </div>' +
        '                <div>' +
        '                    <br />' +
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
        '                </div>' +
        '            </fieldset>' +
        '            <fieldset>' +
        '                <legend>Thêm comments</legend>' +
        '                <div class="pdf-input-group">' +
        '                    <div class="pdf-size-row">' +
        '                        <div id="pdf-comments">' +
        '                            <table id="pdf-comments-table">' +
        '                            </table>' +
        '                            <br />' +
        '                            <table>' +
        '                                <tr>' +
        '                                    <td>' +
        '                                        <span class="pdf-size-lbl">Nội dung</span>' +
        '                                    </td>' +
        '                                    <td>' +
        '                                        <input id="comment-text" class="sign-pos" type="text" />' +
        '                                    </td>' +
        '                                    <td>' +
        '                                        <span class="pdf-size-lbl">Page </span>' +
        '                                    </td>' +
        '                                    <td>' +
        '                                        <input id="comment-text-page" class="sign-pos" type="text" />' +
        '                                    </td>' +
        '                                </tr>' +
        '                                <tr></tr>' +
        '                                <tr>' +
        '                                    <td colspan="4">' +
        '                                        <button class="pdf-btn" id="add-comment-btn" style="width: 70px;margin-top: 10px;">Thêm</button>' +
        '                                    </td>' +
        '                                </tr>' +
        '                            </table>' +
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
        '<div class="page-aside-switch">' +
        '	<i class="icon md-chevron-left" aria-hidden="true"><</i>' +
        '	<i class="icon md-chevron-right" aria-hidden="true">></i>' +
        '</div>' +
        '    </div>' +
        '    <div class="pdf-page">' +
        '        <div id="dragThis">' +
        '             <div id="sign-box-content"></div>' +
        '        </div>' +
        '    </div>' +
        '</div>';
    var _canvasPdf = '<canvas id="ID_VALUE" class="pdf-viewport"></canvas><br/>';

    const _textOnly =
        '    <div id="" class="signaturebox">' +
        '        <div class="signaturebox-text-only">' +
        '            <span>Ky boi: Ten chu chung thu</span><br />' +
        '            <span>Ngay ky: 18/03/2019</span>' +
        '        </div>' +
        '    </div>';
    const _textandLogoLeft =
        '    <div id="" class="signaturebox">' +
        '        <div class="signaturebox-image-left">' +
        '            <div>' +
        '                <span>Ky boi: Ten chu chung thu</span><br />' +
        '                <span>Ngay ky: 18/03/2019</span>' +
        '            </div>' +
        '            <div class="signature-img signaturebox-image-left-img">' +
        '            </div>' +
        '        </div>' +
        '    </div>';
    const _logoOnly =
        '    <div id="" class="signaturebox">' +
        '        <div class="signature-img signaturebox-image-only">' +
        '        </div>' +
        '    </div>';
    const _textAndLogoTop =
        '    <div id="" class="signaturebox">' +
        '        <div class="signaturebox-image-top">' +
        '            <div>' +
        '                <span>Ky boi: Ten chu chung thu</span><br />' +
        '                <span>Ngay ky: 18/03/2019</span>' +
        '            </div>' +
        '            <div class="signature-img signaturebox-image-top-img">' +
        '            </div>' +
        '        </div>' +
        '    </div>';
    const _textAndBackground =
        '    <div id="" class="signaturebox">' +
        '        <div class="signature-img signaturebox-textonly">' +
        '            <div>' +
        '                <span>Ky boi: Ten chu chung thu</span><br />' +
        '                <span>Ngay ky: 18/03/2019</span>' +
        '            </div>' +
        '        </div>' +
        '    </div>';

    const _comment = '<div class="pdf-comment"><span>COMMENT</span></div>';

    const _trashIcon = '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="trash-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-trash-alt fa-w-14 fa-2x"><path fill="currentColor" d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z" class=""></path></svg>';
    const Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9+/=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/rn/g, "n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }
    return VnptPdf;

    }));




/* == jquery mousewheel plugin == Version: 3.1.13, License: MIT License (MIT) */
!function (a) { "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? module.exports = a : a(jQuery) }(function (a) { function b(b) { var g = b || window.event, h = i.call(arguments, 1), j = 0, l = 0, m = 0, n = 0, o = 0, p = 0; if (b = a.event.fix(g), b.type = "mousewheel", "detail" in g && (m = -1 * g.detail), "wheelDelta" in g && (m = g.wheelDelta), "wheelDeltaY" in g && (m = g.wheelDeltaY), "wheelDeltaX" in g && (l = -1 * g.wheelDeltaX), "axis" in g && g.axis === g.HORIZONTAL_AXIS && (l = -1 * m, m = 0), j = 0 === m ? l : m, "deltaY" in g && (m = -1 * g.deltaY, j = m), "deltaX" in g && (l = g.deltaX, 0 === m && (j = -1 * l)), 0 !== m || 0 !== l) { if (1 === g.deltaMode) { var q = a.data(this, "mousewheel-line-height"); j *= q, m *= q, l *= q } else if (2 === g.deltaMode) { var r = a.data(this, "mousewheel-page-height"); j *= r, m *= r, l *= r } if (n = Math.max(Math.abs(m), Math.abs(l)), (!f || f > n) && (f = n, d(g, n) && (f /= 40)), d(g, n) && (j /= 40, l /= 40, m /= 40), j = Math[j >= 1 ? "floor" : "ceil"](j / f), l = Math[l >= 1 ? "floor" : "ceil"](l / f), m = Math[m >= 1 ? "floor" : "ceil"](m / f), k.settings.normalizeOffset && this.getBoundingClientRect) { var s = this.getBoundingClientRect(); o = b.clientX - s.left, p = b.clientY - s.top } return b.deltaX = l, b.deltaY = m, b.deltaFactor = f, b.offsetX = o, b.offsetY = p, b.deltaMode = 0, h.unshift(b, j, l, m), e && clearTimeout(e), e = setTimeout(c, 200), (a.event.dispatch || a.event.handle).apply(this, h) } } function c() { f = null } function d(a, b) { return k.settings.adjustOldDeltas && "mousewheel" === a.type && b % 120 === 0 } var e, f, g = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"], h = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"], i = Array.prototype.slice; if (a.event.fixHooks) for (var j = g.length; j;)a.event.fixHooks[g[--j]] = a.event.mouseHooks; var k = a.event.special.mousewheel = { version: "3.1.12", setup: function () { if (this.addEventListener) for (var c = h.length; c;)this.addEventListener(h[--c], b, !1); else this.onmousewheel = b; a.data(this, "mousewheel-line-height", k.getLineHeight(this)), a.data(this, "mousewheel-page-height", k.getPageHeight(this)) }, teardown: function () { if (this.removeEventListener) for (var c = h.length; c;)this.removeEventListener(h[--c], b, !1); else this.onmousewheel = null; a.removeData(this, "mousewheel-line-height"), a.removeData(this, "mousewheel-page-height") }, getLineHeight: function (b) { var c = a(b), d = c["offsetParent" in a.fn ? "offsetParent" : "parent"](); return d.length || (d = a("body")), parseInt(d.css("fontSize"), 10) || parseInt(c.css("fontSize"), 10) || 16 }, getPageHeight: function (b) { return a(b).height() }, settings: { adjustOldDeltas: !0, normalizeOffset: !0 } }; a.fn.extend({ mousewheel: function (a) { return a ? this.bind("mousewheel", a) : this.trigger("mousewheel") }, unmousewheel: function (a) { return this.unbind("mousewheel", a) } }) }); !function (a) { "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? module.exports = a : a(jQuery) }(function (a) { function b(b) { var g = b || window.event, h = i.call(arguments, 1), j = 0, l = 0, m = 0, n = 0, o = 0, p = 0; if (b = a.event.fix(g), b.type = "mousewheel", "detail" in g && (m = -1 * g.detail), "wheelDelta" in g && (m = g.wheelDelta), "wheelDeltaY" in g && (m = g.wheelDeltaY), "wheelDeltaX" in g && (l = -1 * g.wheelDeltaX), "axis" in g && g.axis === g.HORIZONTAL_AXIS && (l = -1 * m, m = 0), j = 0 === m ? l : m, "deltaY" in g && (m = -1 * g.deltaY, j = m), "deltaX" in g && (l = g.deltaX, 0 === m && (j = -1 * l)), 0 !== m || 0 !== l) { if (1 === g.deltaMode) { var q = a.data(this, "mousewheel-line-height"); j *= q, m *= q, l *= q } else if (2 === g.deltaMode) { var r = a.data(this, "mousewheel-page-height"); j *= r, m *= r, l *= r } if (n = Math.max(Math.abs(m), Math.abs(l)), (!f || f > n) && (f = n, d(g, n) && (f /= 40)), d(g, n) && (j /= 40, l /= 40, m /= 40), j = Math[j >= 1 ? "floor" : "ceil"](j / f), l = Math[l >= 1 ? "floor" : "ceil"](l / f), m = Math[m >= 1 ? "floor" : "ceil"](m / f), k.settings.normalizeOffset && this.getBoundingClientRect) { var s = this.getBoundingClientRect(); o = b.clientX - s.left, p = b.clientY - s.top } return b.deltaX = l, b.deltaY = m, b.deltaFactor = f, b.offsetX = o, b.offsetY = p, b.deltaMode = 0, h.unshift(b, j, l, m), e && clearTimeout(e), e = setTimeout(c, 200), (a.event.dispatch || a.event.handle).apply(this, h) } } function c() { f = null } function d(a, b) { return k.settings.adjustOldDeltas && "mousewheel" === a.type && b % 120 === 0 } var e, f, g = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"], h = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"], i = Array.prototype.slice; if (a.event.fixHooks) for (var j = g.length; j;)a.event.fixHooks[g[--j]] = a.event.mouseHooks; var k = a.event.special.mousewheel = { version: "3.1.12", setup: function () { if (this.addEventListener) for (var c = h.length; c;)this.addEventListener(h[--c], b, !1); else this.onmousewheel = b; a.data(this, "mousewheel-line-height", k.getLineHeight(this)), a.data(this, "mousewheel-page-height", k.getPageHeight(this)) }, teardown: function () { if (this.removeEventListener) for (var c = h.length; c;)this.removeEventListener(h[--c], b, !1); else this.onmousewheel = null; a.removeData(this, "mousewheel-line-height"), a.removeData(this, "mousewheel-page-height") }, getLineHeight: function (b) { var c = a(b), d = c["offsetParent" in a.fn ? "offsetParent" : "parent"](); return d.length || (d = a("body")), parseInt(d.css("fontSize"), 10) || parseInt(c.css("fontSize"), 10) || 16 }, getPageHeight: function (b) { return a(b).height() }, settings: { adjustOldDeltas: !0, normalizeOffset: !0 } }; a.fn.extend({ mousewheel: function (a) { return a ? this.bind("mousewheel", a) : this.trigger("mousewheel") }, unmousewheel: function (a) { return this.unbind("mousewheel", a) } }) });
/* == malihu jquery custom scrollbar plugin == Version: 3.1.5, License: MIT License (MIT) */
!function (e) { "function" == typeof define && define.amd ? define(["jquery"], e) : "undefined" != typeof module && module.exports ? module.exports = e : e(jQuery, window, document) }(function (e) {
    !function (t) { var o = "function" == typeof define && define.amd, a = "undefined" != typeof module && module.exports, n = "https:" == document.location.protocol ? "https:" : "http:", i = "cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min.js"; o || (a ? require("jquery-mousewheel")(e) : e.event.special.mousewheel || e("head").append(decodeURI("%3Cscript src=" + n + "//" + i + "%3E%3C/script%3E"))), t() }(function () {
        var t, o = "mCustomScrollbar", a = "mCS", n = ".mCustomScrollbar", i = { setTop: 0, setLeft: 0, axis: "y", scrollbarPosition: "inside", scrollInertia: 950, autoDraggerLength: !0, alwaysShowScrollbar: 0, snapOffset: 0, mouseWheel: { enable: !0, scrollAmount: "auto", axis: "y", deltaFactor: "auto", disableOver: ["select", "option", "keygen", "datalist", "textarea"] }, scrollButtons: { scrollType: "stepless", scrollAmount: "auto" }, keyboard: { enable: !0, scrollType: "stepless", scrollAmount: "auto" }, contentTouchScroll: 25, documentTouchScroll: !0, advanced: { autoScrollOnFocus: "input,textarea,select,button,datalist,keygen,a[tabindex],area,object,[contenteditable='true']", updateOnContentResize: !0, updateOnImageLoad: "auto", autoUpdateTimeout: 60 }, theme: "light", callbacks: { onTotalScrollOffset: 0, onTotalScrollBackOffset: 0, alwaysTriggerOffsets: !0 } }, r = 0, l = {}, s = window.attachEvent && !window.addEventListener ? 1 : 0, c = !1, d = ["mCSB_dragger_onDrag", "mCSB_scrollTools_onDrag", "mCS_img_loaded", "mCS_disabled", "mCS_destroyed", "mCS_no_scrollbar", "mCS-autoHide", "mCS-dir-rtl", "mCS_no_scrollbar_y", "mCS_no_scrollbar_x", "mCS_y_hidden", "mCS_x_hidden", "mCSB_draggerContainer", "mCSB_buttonUp", "mCSB_buttonDown", "mCSB_buttonLeft", "mCSB_buttonRight"], u = { init: function (t) { var t = e.extend(!0, {}, i, t), o = f.call(this); if (t.live) { var s = t.liveSelector || this.selector || n, c = e(s); if ("off" === t.live) return void m(s); l[s] = setTimeout(function () { c.mCustomScrollbar(t), "once" === t.live && c.length && m(s) }, 500) } else m(s); return t.setWidth = t.set_width ? t.set_width : t.setWidth, t.setHeight = t.set_height ? t.set_height : t.setHeight, t.axis = t.horizontalScroll ? "x" : p(t.axis), t.scrollInertia = t.scrollInertia > 0 && t.scrollInertia < 17 ? 17 : t.scrollInertia, "object" != typeof t.mouseWheel && 1 == t.mouseWheel && (t.mouseWheel = { enable: !0, scrollAmount: "auto", axis: "y", preventDefault: !1, deltaFactor: "auto", normalizeDelta: !1, invert: !1 }), t.mouseWheel.scrollAmount = t.mouseWheelPixels ? t.mouseWheelPixels : t.mouseWheel.scrollAmount, t.mouseWheel.normalizeDelta = t.advanced.normalizeMouseWheelDelta ? t.advanced.normalizeMouseWheelDelta : t.mouseWheel.normalizeDelta, t.scrollButtons.scrollType = g(t.scrollButtons.scrollType), h(t), e(o).each(function () { var o = e(this); if (!o.data(a)) { o.data(a, { idx: ++r, opt: t, scrollRatio: { y: null, x: null }, overflowed: null, contentReset: { y: null, x: null }, bindEvents: !1, tweenRunning: !1, sequential: {}, langDir: o.css("direction"), cbOffsets: null, trigger: null, poll: { size: { o: 0, n: 0 }, img: { o: 0, n: 0 }, change: { o: 0, n: 0 } } }); var n = o.data(a), i = n.opt, l = o.data("mcs-axis"), s = o.data("mcs-scrollbar-position"), c = o.data("mcs-theme"); l && (i.axis = l), s && (i.scrollbarPosition = s), c && (i.theme = c, h(i)), v.call(this), n && i.callbacks.onCreate && "function" == typeof i.callbacks.onCreate && i.callbacks.onCreate.call(this), e("#mCSB_" + n.idx + "_container img:not(." + d[2] + ")").addClass(d[2]), u.update.call(null, o) } }) }, update: function (t, o) { var n = t || f.call(this); return e(n).each(function () { var t = e(this); if (t.data(a)) { var n = t.data(a), i = n.opt, r = e("#mCSB_" + n.idx + "_container"), l = e("#mCSB_" + n.idx), s = [e("#mCSB_" + n.idx + "_dragger_vertical"), e("#mCSB_" + n.idx + "_dragger_horizontal")]; if (!r.length) return; n.tweenRunning && Q(t), o && n && i.callbacks.onBeforeUpdate && "function" == typeof i.callbacks.onBeforeUpdate && i.callbacks.onBeforeUpdate.call(this), t.hasClass(d[3]) && t.removeClass(d[3]), t.hasClass(d[4]) && t.removeClass(d[4]), l.css("max-height", "none"), l.height() !== t.height() && l.css("max-height", t.height()), _.call(this), "y" === i.axis || i.advanced.autoExpandHorizontalScroll || r.css("width", x(r)), n.overflowed = y.call(this), M.call(this), i.autoDraggerLength && S.call(this), b.call(this), T.call(this); var c = [Math.abs(r[0].offsetTop), Math.abs(r[0].offsetLeft)]; "x" !== i.axis && (n.overflowed[0] ? s[0].height() > s[0].parent().height() ? B.call(this) : (G(t, c[0].toString(), { dir: "y", dur: 0, overwrite: "none" }), n.contentReset.y = null) : (B.call(this), "y" === i.axis ? k.call(this) : "yx" === i.axis && n.overflowed[1] && G(t, c[1].toString(), { dir: "x", dur: 0, overwrite: "none" }))), "y" !== i.axis && (n.overflowed[1] ? s[1].width() > s[1].parent().width() ? B.call(this) : (G(t, c[1].toString(), { dir: "x", dur: 0, overwrite: "none" }), n.contentReset.x = null) : (B.call(this), "x" === i.axis ? k.call(this) : "yx" === i.axis && n.overflowed[0] && G(t, c[0].toString(), { dir: "y", dur: 0, overwrite: "none" }))), o && n && (2 === o && i.callbacks.onImageLoad && "function" == typeof i.callbacks.onImageLoad ? i.callbacks.onImageLoad.call(this) : 3 === o && i.callbacks.onSelectorChange && "function" == typeof i.callbacks.onSelectorChange ? i.callbacks.onSelectorChange.call(this) : i.callbacks.onUpdate && "function" == typeof i.callbacks.onUpdate && i.callbacks.onUpdate.call(this)), N.call(this) } }) }, scrollTo: function (t, o) { if ("undefined" != typeof t && null != t) { var n = f.call(this); return e(n).each(function () { var n = e(this); if (n.data(a)) { var i = n.data(a), r = i.opt, l = { trigger: "external", scrollInertia: r.scrollInertia, scrollEasing: "mcsEaseInOut", moveDragger: !1, timeout: 60, callbacks: !0, onStart: !0, onUpdate: !0, onComplete: !0 }, s = e.extend(!0, {}, l, o), c = Y.call(this, t), d = s.scrollInertia > 0 && s.scrollInertia < 17 ? 17 : s.scrollInertia; c[0] = X.call(this, c[0], "y"), c[1] = X.call(this, c[1], "x"), s.moveDragger && (c[0] *= i.scrollRatio.y, c[1] *= i.scrollRatio.x), s.dur = ne() ? 0 : d, setTimeout(function () { null !== c[0] && "undefined" != typeof c[0] && "x" !== r.axis && i.overflowed[0] && (s.dir = "y", s.overwrite = "all", G(n, c[0].toString(), s)), null !== c[1] && "undefined" != typeof c[1] && "y" !== r.axis && i.overflowed[1] && (s.dir = "x", s.overwrite = "none", G(n, c[1].toString(), s)) }, s.timeout) } }) } }, stop: function () { var t = f.call(this); return e(t).each(function () { var t = e(this); t.data(a) && Q(t) }) }, disable: function (t) { var o = f.call(this); return e(o).each(function () { var o = e(this); if (o.data(a)) { o.data(a); N.call(this, "remove"), k.call(this), t && B.call(this), M.call(this, !0), o.addClass(d[3]) } }) }, destroy: function () { var t = f.call(this); return e(t).each(function () { var n = e(this); if (n.data(a)) { var i = n.data(a), r = i.opt, l = e("#mCSB_" + i.idx), s = e("#mCSB_" + i.idx + "_container"), c = e(".mCSB_" + i.idx + "_scrollbar"); r.live && m(r.liveSelector || e(t).selector), N.call(this, "remove"), k.call(this), B.call(this), n.removeData(a), $(this, "mcs"), c.remove(), s.find("img." + d[2]).removeClass(d[2]), l.replaceWith(s.contents()), n.removeClass(o + " _" + a + "_" + i.idx + " " + d[6] + " " + d[7] + " " + d[5] + " " + d[3]).addClass(d[4]) } }) } }, f = function () { return "object" != typeof e(this) || e(this).length < 1 ? n : this }, h = function (t) { var o = ["rounded", "rounded-dark", "rounded-dots", "rounded-dots-dark"], a = ["rounded-dots", "rounded-dots-dark", "3d", "3d-dark", "3d-thick", "3d-thick-dark", "inset", "inset-dark", "inset-2", "inset-2-dark", "inset-3", "inset-3-dark"], n = ["minimal", "minimal-dark"], i = ["minimal", "minimal-dark"], r = ["minimal", "minimal-dark"]; t.autoDraggerLength = e.inArray(t.theme, o) > -1 ? !1 : t.autoDraggerLength, t.autoExpandScrollbar = e.inArray(t.theme, a) > -1 ? !1 : t.autoExpandScrollbar, t.scrollButtons.enable = e.inArray(t.theme, n) > -1 ? !1 : t.scrollButtons.enable, t.autoHideScrollbar = e.inArray(t.theme, i) > -1 ? !0 : t.autoHideScrollbar, t.scrollbarPosition = e.inArray(t.theme, r) > -1 ? "outside" : t.scrollbarPosition }, m = function (e) { l[e] && (clearTimeout(l[e]), $(l, e)) }, p = function (e) { return "yx" === e || "xy" === e || "auto" === e ? "yx" : "x" === e || "horizontal" === e ? "x" : "y" }, g = function (e) { return "stepped" === e || "pixels" === e || "step" === e || "click" === e ? "stepped" : "stepless" }, v = function () { var t = e(this), n = t.data(a), i = n.opt, r = i.autoExpandScrollbar ? " " + d[1] + "_expand" : "", l = ["<div id='mCSB_" + n.idx + "_scrollbar_vertical' class='mCSB_scrollTools mCSB_" + n.idx + "_scrollbar mCS-" + i.theme + " mCSB_scrollTools_vertical" + r + "'><div class='" + d[12] + "'><div id='mCSB_" + n.idx + "_dragger_vertical' class='mCSB_dragger' style='position:absolute;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>", "<div id='mCSB_" + n.idx + "_scrollbar_horizontal' class='mCSB_scrollTools mCSB_" + n.idx + "_scrollbar mCS-" + i.theme + " mCSB_scrollTools_horizontal" + r + "'><div class='" + d[12] + "'><div id='mCSB_" + n.idx + "_dragger_horizontal' class='mCSB_dragger' style='position:absolute;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>"], s = "yx" === i.axis ? "mCSB_vertical_horizontal" : "x" === i.axis ? "mCSB_horizontal" : "mCSB_vertical", c = "yx" === i.axis ? l[0] + l[1] : "x" === i.axis ? l[1] : l[0], u = "yx" === i.axis ? "<div id='mCSB_" + n.idx + "_container_wrapper' class='mCSB_container_wrapper' />" : "", f = i.autoHideScrollbar ? " " + d[6] : "", h = "x" !== i.axis && "rtl" === n.langDir ? " " + d[7] : ""; i.setWidth && t.css("width", i.setWidth), i.setHeight && t.css("height", i.setHeight), i.setLeft = "y" !== i.axis && "rtl" === n.langDir ? "989999px" : i.setLeft, t.addClass(o + " _" + a + "_" + n.idx + f + h).wrapInner("<div id='mCSB_" + n.idx + "' class='mCustomScrollBox mCS-" + i.theme + " " + s + "'><div id='mCSB_" + n.idx + "_container' class='mCSB_container' style='position:relative; top:" + i.setTop + "; left:" + i.setLeft + ";' dir='" + n.langDir + "' /></div>"); var m = e("#mCSB_" + n.idx), p = e("#mCSB_" + n.idx + "_container"); "y" === i.axis || i.advanced.autoExpandHorizontalScroll || p.css("width", x(p)), "outside" === i.scrollbarPosition ? ("static" === t.css("position") && t.css("position", "relative"), t.css("overflow", "visible"), m.addClass("mCSB_outside").after(c)) : (m.addClass("mCSB_inside").append(c), p.wrap(u)), w.call(this); var g = [e("#mCSB_" + n.idx + "_dragger_vertical"), e("#mCSB_" + n.idx + "_dragger_horizontal")]; g[0].css("min-height", g[0].height()), g[1].css("min-width", g[1].width()) }, x = function (t) { var o = [t[0].scrollWidth, Math.max.apply(Math, t.children().map(function () { return e(this).outerWidth(!0) }).get())], a = t.parent().width(); return o[0] > a ? o[0] : o[1] > a ? o[1] : "100%" }, _ = function () { var t = e(this), o = t.data(a), n = o.opt, i = e("#mCSB_" + o.idx + "_container"); if (n.advanced.autoExpandHorizontalScroll && "y" !== n.axis) { i.css({ width: "auto", "min-width": 0, "overflow-x": "scroll" }); var r = Math.ceil(i[0].scrollWidth); 3 === n.advanced.autoExpandHorizontalScroll || 2 !== n.advanced.autoExpandHorizontalScroll && r > i.parent().width() ? i.css({ width: r, "min-width": "100%", "overflow-x": "inherit" }) : i.css({ "overflow-x": "inherit", position: "absolute" }).wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />").css({ width: Math.ceil(i[0].getBoundingClientRect().right + .4) - Math.floor(i[0].getBoundingClientRect().left), "min-width": "100%", position: "relative" }).unwrap() } }, w = function () { var t = e(this), o = t.data(a), n = o.opt, i = e(".mCSB_" + o.idx + "_scrollbar:first"), r = oe(n.scrollButtons.tabindex) ? "tabindex='" + n.scrollButtons.tabindex + "'" : "", l = ["<a href='#' class='" + d[13] + "' " + r + " />", "<a href='#' class='" + d[14] + "' " + r + " />", "<a href='#' class='" + d[15] + "' " + r + " />", "<a href='#' class='" + d[16] + "' " + r + " />"], s = ["x" === n.axis ? l[2] : l[0], "x" === n.axis ? l[3] : l[1], l[2], l[3]]; n.scrollButtons.enable && i.prepend(s[0]).append(s[1]).next(".mCSB_scrollTools").prepend(s[2]).append(s[3]) }, S = function () { var t = e(this), o = t.data(a), n = e("#mCSB_" + o.idx), i = e("#mCSB_" + o.idx + "_container"), r = [e("#mCSB_" + o.idx + "_dragger_vertical"), e("#mCSB_" + o.idx + "_dragger_horizontal")], l = [n.height() / i.outerHeight(!1), n.width() / i.outerWidth(!1)], c = [parseInt(r[0].css("min-height")), Math.round(l[0] * r[0].parent().height()), parseInt(r[1].css("min-width")), Math.round(l[1] * r[1].parent().width())], d = s && c[1] < c[0] ? c[0] : c[1], u = s && c[3] < c[2] ? c[2] : c[3]; r[0].css({ height: d, "max-height": r[0].parent().height() - 10 }).find(".mCSB_dragger_bar").css({ "line-height": c[0] + "px" }), r[1].css({ width: u, "max-width": r[1].parent().width() - 10 }) }, b = function () { var t = e(this), o = t.data(a), n = e("#mCSB_" + o.idx), i = e("#mCSB_" + o.idx + "_container"), r = [e("#mCSB_" + o.idx + "_dragger_vertical"), e("#mCSB_" + o.idx + "_dragger_horizontal")], l = [i.outerHeight(!1) - n.height(), i.outerWidth(!1) - n.width()], s = [l[0] / (r[0].parent().height() - r[0].height()), l[1] / (r[1].parent().width() - r[1].width())]; o.scrollRatio = { y: s[0], x: s[1] } }, C = function (e, t, o) { var a = o ? d[0] + "_expanded" : "", n = e.closest(".mCSB_scrollTools"); "active" === t ? (e.toggleClass(d[0] + " " + a), n.toggleClass(d[1]), e[0]._draggable = e[0]._draggable ? 0 : 1) : e[0]._draggable || ("hide" === t ? (e.removeClass(d[0]), n.removeClass(d[1])) : (e.addClass(d[0]), n.addClass(d[1]))) }, y = function () { var t = e(this), o = t.data(a), n = e("#mCSB_" + o.idx), i = e("#mCSB_" + o.idx + "_container"), r = null == o.overflowed ? i.height() : i.outerHeight(!1), l = null == o.overflowed ? i.width() : i.outerWidth(!1), s = i[0].scrollHeight, c = i[0].scrollWidth; return s > r && (r = s), c > l && (l = c), [r > n.height(), l > n.width()] }, B = function () { var t = e(this), o = t.data(a), n = o.opt, i = e("#mCSB_" + o.idx), r = e("#mCSB_" + o.idx + "_container"), l = [e("#mCSB_" + o.idx + "_dragger_vertical"), e("#mCSB_" + o.idx + "_dragger_horizontal")]; if (Q(t), ("x" !== n.axis && !o.overflowed[0] || "y" === n.axis && o.overflowed[0]) && (l[0].add(r).css("top", 0), G(t, "_resetY")), "y" !== n.axis && !o.overflowed[1] || "x" === n.axis && o.overflowed[1]) { var s = dx = 0; "rtl" === o.langDir && (s = i.width() - r.outerWidth(!1), dx = Math.abs(s / o.scrollRatio.x)), r.css("left", s), l[1].css("left", dx), G(t, "_resetX") } }, T = function () { function t() { r = setTimeout(function () { e.event.special.mousewheel ? (clearTimeout(r), W.call(o[0])) : t() }, 100) } var o = e(this), n = o.data(a), i = n.opt; if (!n.bindEvents) { if (I.call(this), i.contentTouchScroll && D.call(this), E.call(this), i.mouseWheel.enable) { var r; t() } P.call(this), U.call(this), i.advanced.autoScrollOnFocus && H.call(this), i.scrollButtons.enable && F.call(this), i.keyboard.enable && q.call(this), n.bindEvents = !0 } }, k = function () { var t = e(this), o = t.data(a), n = o.opt, i = a + "_" + o.idx, r = ".mCSB_" + o.idx + "_scrollbar", l = e("#mCSB_" + o.idx + ",#mCSB_" + o.idx + "_container,#mCSB_" + o.idx + "_container_wrapper," + r + " ." + d[12] + ",#mCSB_" + o.idx + "_dragger_vertical,#mCSB_" + o.idx + "_dragger_horizontal," + r + ">a"), s = e("#mCSB_" + o.idx + "_container"); n.advanced.releaseDraggableSelectors && l.add(e(n.advanced.releaseDraggableSelectors)), n.advanced.extraDraggableSelectors && l.add(e(n.advanced.extraDraggableSelectors)), o.bindEvents && (e(document).add(e(!A() || top.document)).unbind("." + i), l.each(function () { e(this).unbind("." + i) }), clearTimeout(t[0]._focusTimeout), $(t[0], "_focusTimeout"), clearTimeout(o.sequential.step), $(o.sequential, "step"), clearTimeout(s[0].onCompleteTimeout), $(s[0], "onCompleteTimeout"), o.bindEvents = !1) }, M = function (t) { var o = e(this), n = o.data(a), i = n.opt, r = e("#mCSB_" + n.idx + "_container_wrapper"), l = r.length ? r : e("#mCSB_" + n.idx + "_container"), s = [e("#mCSB_" + n.idx + "_scrollbar_vertical"), e("#mCSB_" + n.idx + "_scrollbar_horizontal")], c = [s[0].find(".mCSB_dragger"), s[1].find(".mCSB_dragger")]; "x" !== i.axis && (n.overflowed[0] && !t ? (s[0].add(c[0]).add(s[0].children("a")).css("display", "block"), l.removeClass(d[8] + " " + d[10])) : (i.alwaysShowScrollbar ? (2 !== i.alwaysShowScrollbar && c[0].css("display", "none"), l.removeClass(d[10])) : (s[0].css("display", "none"), l.addClass(d[10])), l.addClass(d[8]))), "y" !== i.axis && (n.overflowed[1] && !t ? (s[1].add(c[1]).add(s[1].children("a")).css("display", "block"), l.removeClass(d[9] + " " + d[11])) : (i.alwaysShowScrollbar ? (2 !== i.alwaysShowScrollbar && c[1].css("display", "none"), l.removeClass(d[11])) : (s[1].css("display", "none"), l.addClass(d[11])), l.addClass(d[9]))), n.overflowed[0] || n.overflowed[1] ? o.removeClass(d[5]) : o.addClass(d[5]) }, O = function (t) { var o = t.type, a = t.target.ownerDocument !== document && null !== frameElement ? [e(frameElement).offset().top, e(frameElement).offset().left] : null, n = A() && t.target.ownerDocument !== top.document && null !== frameElement ? [e(t.view.frameElement).offset().top, e(t.view.frameElement).offset().left] : [0, 0]; switch (o) { case "pointerdown": case "MSPointerDown": case "pointermove": case "MSPointerMove": case "pointerup": case "MSPointerUp": return a ? [t.originalEvent.pageY - a[0] + n[0], t.originalEvent.pageX - a[1] + n[1], !1] : [t.originalEvent.pageY, t.originalEvent.pageX, !1]; case "touchstart": case "touchmove": case "touchend": var i = t.originalEvent.touches[0] || t.originalEvent.changedTouches[0], r = t.originalEvent.touches.length || t.originalEvent.changedTouches.length; return t.target.ownerDocument !== document ? [i.screenY, i.screenX, r > 1] : [i.pageY, i.pageX, r > 1]; default: return a ? [t.pageY - a[0] + n[0], t.pageX - a[1] + n[1], !1] : [t.pageY, t.pageX, !1] } }, I = function () { function t(e, t, a, n) { if (h[0].idleTimer = d.scrollInertia < 233 ? 250 : 0, o.attr("id") === f[1]) var i = "x", s = (o[0].offsetLeft - t + n) * l.scrollRatio.x; else var i = "y", s = (o[0].offsetTop - e + a) * l.scrollRatio.y; G(r, s.toString(), { dir: i, drag: !0 }) } var o, n, i, r = e(this), l = r.data(a), d = l.opt, u = a + "_" + l.idx, f = ["mCSB_" + l.idx + "_dragger_vertical", "mCSB_" + l.idx + "_dragger_horizontal"], h = e("#mCSB_" + l.idx + "_container"), m = e("#" + f[0] + ",#" + f[1]), p = d.advanced.releaseDraggableSelectors ? m.add(e(d.advanced.releaseDraggableSelectors)) : m, g = d.advanced.extraDraggableSelectors ? e(!A() || top.document).add(e(d.advanced.extraDraggableSelectors)) : e(!A() || top.document); m.bind("contextmenu." + u, function (e) { e.preventDefault() }).bind("mousedown." + u + " touchstart." + u + " pointerdown." + u + " MSPointerDown." + u, function (t) { if (t.stopImmediatePropagation(), t.preventDefault(), ee(t)) { c = !0, s && (document.onselectstart = function () { return !1 }), L.call(h, !1), Q(r), o = e(this); var a = o.offset(), l = O(t)[0] - a.top, u = O(t)[1] - a.left, f = o.height() + a.top, m = o.width() + a.left; f > l && l > 0 && m > u && u > 0 && (n = l, i = u), C(o, "active", d.autoExpandScrollbar) } }).bind("touchmove." + u, function (e) { e.stopImmediatePropagation(), e.preventDefault(); var a = o.offset(), r = O(e)[0] - a.top, l = O(e)[1] - a.left; t(n, i, r, l) }), e(document).add(g).bind("mousemove." + u + " pointermove." + u + " MSPointerMove." + u, function (e) { if (o) { var a = o.offset(), r = O(e)[0] - a.top, l = O(e)[1] - a.left; if (n === r && i === l) return; t(n, i, r, l) } }).add(p).bind("mouseup." + u + " touchend." + u + " pointerup." + u + " MSPointerUp." + u, function () { o && (C(o, "active", d.autoExpandScrollbar), o = null), c = !1, s && (document.onselectstart = null), L.call(h, !0) }) }, D = function () { function o(e) { if (!te(e) || c || O(e)[2]) return void (t = 0); t = 1, b = 0, C = 0, d = 1, y.removeClass("mCS_touch_action"); var o = I.offset(); u = O(e)[0] - o.top, f = O(e)[1] - o.left, z = [O(e)[0], O(e)[1]] } function n(e) { if (te(e) && !c && !O(e)[2] && (T.documentTouchScroll || e.preventDefault(), e.stopImmediatePropagation(), (!C || b) && d)) { g = K(); var t = M.offset(), o = O(e)[0] - t.top, a = O(e)[1] - t.left, n = "mcsLinearOut"; if (E.push(o), W.push(a), z[2] = Math.abs(O(e)[0] - z[0]), z[3] = Math.abs(O(e)[1] - z[1]), B.overflowed[0]) var i = D[0].parent().height() - D[0].height(), r = u - o > 0 && o - u > -(i * B.scrollRatio.y) && (2 * z[3] < z[2] || "yx" === T.axis); if (B.overflowed[1]) var l = D[1].parent().width() - D[1].width(), h = f - a > 0 && a - f > -(l * B.scrollRatio.x) && (2 * z[2] < z[3] || "yx" === T.axis); r || h ? (U || e.preventDefault(), b = 1) : (C = 1, y.addClass("mCS_touch_action")), U && e.preventDefault(), w = "yx" === T.axis ? [u - o, f - a] : "x" === T.axis ? [null, f - a] : [u - o, null], I[0].idleTimer = 250, B.overflowed[0] && s(w[0], R, n, "y", "all", !0), B.overflowed[1] && s(w[1], R, n, "x", L, !0) } } function i(e) { if (!te(e) || c || O(e)[2]) return void (t = 0); t = 1, e.stopImmediatePropagation(), Q(y), p = K(); var o = M.offset(); h = O(e)[0] - o.top, m = O(e)[1] - o.left, E = [], W = [] } function r(e) { if (te(e) && !c && !O(e)[2]) { d = 0, e.stopImmediatePropagation(), b = 0, C = 0, v = K(); var t = M.offset(), o = O(e)[0] - t.top, a = O(e)[1] - t.left; if (!(v - g > 30)) { _ = 1e3 / (v - p); var n = "mcsEaseOut", i = 2.5 > _, r = i ? [E[E.length - 2], W[W.length - 2]] : [0, 0]; x = i ? [o - r[0], a - r[1]] : [o - h, a - m]; var u = [Math.abs(x[0]), Math.abs(x[1])]; _ = i ? [Math.abs(x[0] / 4), Math.abs(x[1] / 4)] : [_, _]; var f = [Math.abs(I[0].offsetTop) - x[0] * l(u[0] / _[0], _[0]), Math.abs(I[0].offsetLeft) - x[1] * l(u[1] / _[1], _[1])]; w = "yx" === T.axis ? [f[0], f[1]] : "x" === T.axis ? [null, f[1]] : [f[0], null], S = [4 * u[0] + T.scrollInertia, 4 * u[1] + T.scrollInertia]; var y = parseInt(T.contentTouchScroll) || 0; w[0] = u[0] > y ? w[0] : 0, w[1] = u[1] > y ? w[1] : 0, B.overflowed[0] && s(w[0], S[0], n, "y", L, !1), B.overflowed[1] && s(w[1], S[1], n, "x", L, !1) } } } function l(e, t) { var o = [1.5 * t, 2 * t, t / 1.5, t / 2]; return e > 90 ? t > 4 ? o[0] : o[3] : e > 60 ? t > 3 ? o[3] : o[2] : e > 30 ? t > 8 ? o[1] : t > 6 ? o[0] : t > 4 ? t : o[2] : t > 8 ? t : o[3] } function s(e, t, o, a, n, i) { e && G(y, e.toString(), { dur: t, scrollEasing: o, dir: a, overwrite: n, drag: i }) } var d, u, f, h, m, p, g, v, x, _, w, S, b, C, y = e(this), B = y.data(a), T = B.opt, k = a + "_" + B.idx, M = e("#mCSB_" + B.idx), I = e("#mCSB_" + B.idx + "_container"), D = [e("#mCSB_" + B.idx + "_dragger_vertical"), e("#mCSB_" + B.idx + "_dragger_horizontal")], E = [], W = [], R = 0, L = "yx" === T.axis ? "none" : "all", z = [], P = I.find("iframe"), H = ["touchstart." + k + " pointerdown." + k + " MSPointerDown." + k, "touchmove." + k + " pointermove." + k + " MSPointerMove." + k, "touchend." + k + " pointerup." + k + " MSPointerUp." + k], U = void 0 !== document.body.style.touchAction && "" !== document.body.style.touchAction; I.bind(H[0], function (e) { o(e) }).bind(H[1], function (e) { n(e) }), M.bind(H[0], function (e) { i(e) }).bind(H[2], function (e) { r(e) }), P.length && P.each(function () { e(this).bind("load", function () { A(this) && e(this.contentDocument || this.contentWindow.document).bind(H[0], function (e) { o(e), i(e) }).bind(H[1], function (e) { n(e) }).bind(H[2], function (e) { r(e) }) }) }) }, E = function () { function o() { return window.getSelection ? window.getSelection().toString() : document.selection && "Control" != document.selection.type ? document.selection.createRange().text : 0 } function n(e, t, o) { d.type = o && i ? "stepped" : "stepless", d.scrollAmount = 10, j(r, e, t, "mcsLinearOut", o ? 60 : null) } var i, r = e(this), l = r.data(a), s = l.opt, d = l.sequential, u = a + "_" + l.idx, f = e("#mCSB_" + l.idx + "_container"), h = f.parent(); f.bind("mousedown." + u, function () { t || i || (i = 1, c = !0) }).add(document).bind("mousemove." + u, function (e) { if (!t && i && o()) { var a = f.offset(), r = O(e)[0] - a.top + f[0].offsetTop, c = O(e)[1] - a.left + f[0].offsetLeft; r > 0 && r < h.height() && c > 0 && c < h.width() ? d.step && n("off", null, "stepped") : ("x" !== s.axis && l.overflowed[0] && (0 > r ? n("on", 38) : r > h.height() && n("on", 40)), "y" !== s.axis && l.overflowed[1] && (0 > c ? n("on", 37) : c > h.width() && n("on", 39))) } }).bind("mouseup." + u + " dragend." + u, function () { t || (i && (i = 0, n("off", null)), c = !1) }) }, W = function () { function t(t, a) { if (Q(o), !z(o, t.target)) { var r = "auto" !== i.mouseWheel.deltaFactor ? parseInt(i.mouseWheel.deltaFactor) : s && t.deltaFactor < 100 ? 100 : t.deltaFactor || 100, d = i.scrollInertia; if ("x" === i.axis || "x" === i.mouseWheel.axis) var u = "x", f = [Math.round(r * n.scrollRatio.x), parseInt(i.mouseWheel.scrollAmount)], h = "auto" !== i.mouseWheel.scrollAmount ? f[1] : f[0] >= l.width() ? .9 * l.width() : f[0], m = Math.abs(e("#mCSB_" + n.idx + "_container")[0].offsetLeft), p = c[1][0].offsetLeft, g = c[1].parent().width() - c[1].width(), v = "y" === i.mouseWheel.axis ? t.deltaY || a : t.deltaX; else var u = "y", f = [Math.round(r * n.scrollRatio.y), parseInt(i.mouseWheel.scrollAmount)], h = "auto" !== i.mouseWheel.scrollAmount ? f[1] : f[0] >= l.height() ? .9 * l.height() : f[0], m = Math.abs(e("#mCSB_" + n.idx + "_container")[0].offsetTop), p = c[0][0].offsetTop, g = c[0].parent().height() - c[0].height(), v = t.deltaY || a; "y" === u && !n.overflowed[0] || "x" === u && !n.overflowed[1] || ((i.mouseWheel.invert || t.webkitDirectionInvertedFromDevice) && (v = -v), i.mouseWheel.normalizeDelta && (v = 0 > v ? -1 : 1), (v > 0 && 0 !== p || 0 > v && p !== g || i.mouseWheel.preventDefault) && (t.stopImmediatePropagation(), t.preventDefault()), t.deltaFactor < 5 && !i.mouseWheel.normalizeDelta && (h = t.deltaFactor, d = 17), G(o, (m - v * h).toString(), { dir: u, dur: d })) } } if (e(this).data(a)) { var o = e(this), n = o.data(a), i = n.opt, r = a + "_" + n.idx, l = e("#mCSB_" + n.idx), c = [e("#mCSB_" + n.idx + "_dragger_vertical"), e("#mCSB_" + n.idx + "_dragger_horizontal")], d = e("#mCSB_" + n.idx + "_container").find("iframe"); d.length && d.each(function () { e(this).bind("load", function () { A(this) && e(this.contentDocument || this.contentWindow.document).bind("mousewheel." + r, function (e, o) { t(e, o) }) }) }), l.bind("mousewheel." + r, function (e, o) { t(e, o) }) } }, R = new Object, A = function (t) { var o = !1, a = !1, n = null; if (void 0 === t ? a = "#empty" : void 0 !== e(t).attr("id") && (a = e(t).attr("id")), a !== !1 && void 0 !== R[a]) return R[a]; if (t) { try { var i = t.contentDocument || t.contentWindow.document; n = i.body.innerHTML } catch (r) { } o = null !== n } else { try { var i = top.document; n = i.body.innerHTML } catch (r) { } o = null !== n } return a !== !1 && (R[a] = o), o }, L = function (e) { var t = this.find("iframe"); if (t.length) { var o = e ? "auto" : "none"; t.css("pointer-events", o) } }, z = function (t, o) { var n = o.nodeName.toLowerCase(), i = t.data(a).opt.mouseWheel.disableOver, r = ["select", "textarea"]; return e.inArray(n, i) > -1 && !(e.inArray(n, r) > -1 && !e(o).is(":focus")) }, P = function () { var t, o = e(this), n = o.data(a), i = a + "_" + n.idx, r = e("#mCSB_" + n.idx + "_container"), l = r.parent(), s = e(".mCSB_" + n.idx + "_scrollbar ." + d[12]); s.bind("mousedown." + i + " touchstart." + i + " pointerdown." + i + " MSPointerDown." + i, function (o) { c = !0, e(o.target).hasClass("mCSB_dragger") || (t = 1) }).bind("touchend." + i + " pointerup." + i + " MSPointerUp." + i, function () { c = !1 }).bind("click." + i, function (a) { if (t && (t = 0, e(a.target).hasClass(d[12]) || e(a.target).hasClass("mCSB_draggerRail"))) { Q(o); var i = e(this), s = i.find(".mCSB_dragger"); if (i.parent(".mCSB_scrollTools_horizontal").length > 0) { if (!n.overflowed[1]) return; var c = "x", u = a.pageX > s.offset().left ? -1 : 1, f = Math.abs(r[0].offsetLeft) - u * (.9 * l.width()) } else { if (!n.overflowed[0]) return; var c = "y", u = a.pageY > s.offset().top ? -1 : 1, f = Math.abs(r[0].offsetTop) - u * (.9 * l.height()) } G(o, f.toString(), { dir: c, scrollEasing: "mcsEaseInOut" }) } }) }, H = function () { var t = e(this), o = t.data(a), n = o.opt, i = a + "_" + o.idx, r = e("#mCSB_" + o.idx + "_container"), l = r.parent(); r.bind("focusin." + i, function () { var o = e(document.activeElement), a = r.find(".mCustomScrollBox").length, i = 0; o.is(n.advanced.autoScrollOnFocus) && (Q(t), clearTimeout(t[0]._focusTimeout), t[0]._focusTimer = a ? (i + 17) * a : 0, t[0]._focusTimeout = setTimeout(function () { var e = [ae(o)[0], ae(o)[1]], a = [r[0].offsetTop, r[0].offsetLeft], s = [a[0] + e[0] >= 0 && a[0] + e[0] < l.height() - o.outerHeight(!1), a[1] + e[1] >= 0 && a[0] + e[1] < l.width() - o.outerWidth(!1)], c = "yx" !== n.axis || s[0] || s[1] ? "all" : "none"; "x" === n.axis || s[0] || G(t, e[0].toString(), { dir: "y", scrollEasing: "mcsEaseInOut", overwrite: c, dur: i }), "y" === n.axis || s[1] || G(t, e[1].toString(), { dir: "x", scrollEasing: "mcsEaseInOut", overwrite: c, dur: i }) }, t[0]._focusTimer)) }) }, U = function () { var t = e(this), o = t.data(a), n = a + "_" + o.idx, i = e("#mCSB_" + o.idx + "_container").parent(); i.bind("scroll." + n, function () { 0 === i.scrollTop() && 0 === i.scrollLeft() || e(".mCSB_" + o.idx + "_scrollbar").css("visibility", "hidden") }) }, F = function () { var t = e(this), o = t.data(a), n = o.opt, i = o.sequential, r = a + "_" + o.idx, l = ".mCSB_" + o.idx + "_scrollbar", s = e(l + ">a"); s.bind("contextmenu." + r, function (e) { e.preventDefault() }).bind("mousedown." + r + " touchstart." + r + " pointerdown." + r + " MSPointerDown." + r + " mouseup." + r + " touchend." + r + " pointerup." + r + " MSPointerUp." + r + " mouseout." + r + " pointerout." + r + " MSPointerOut." + r + " click." + r, function (a) { function r(e, o) { i.scrollAmount = n.scrollButtons.scrollAmount, j(t, e, o) } if (a.preventDefault(), ee(a)) { var l = e(this).attr("class"); switch (i.type = n.scrollButtons.scrollType, a.type) { case "mousedown": case "touchstart": case "pointerdown": case "MSPointerDown": if ("stepped" === i.type) return; c = !0, o.tweenRunning = !1, r("on", l); break; case "mouseup": case "touchend": case "pointerup": case "MSPointerUp": case "mouseout": case "pointerout": case "MSPointerOut": if ("stepped" === i.type) return; c = !1, i.dir && r("off", l); break; case "click": if ("stepped" !== i.type || o.tweenRunning) return; r("on", l) } } }) }, q = function () { function t(t) { function a(e, t) { r.type = i.keyboard.scrollType, r.scrollAmount = i.keyboard.scrollAmount, "stepped" === r.type && n.tweenRunning || j(o, e, t) } switch (t.type) { case "blur": n.tweenRunning && r.dir && a("off", null); break; case "keydown": case "keyup": var l = t.keyCode ? t.keyCode : t.which, s = "on"; if ("x" !== i.axis && (38 === l || 40 === l) || "y" !== i.axis && (37 === l || 39 === l)) { if ((38 === l || 40 === l) && !n.overflowed[0] || (37 === l || 39 === l) && !n.overflowed[1]) return; "keyup" === t.type && (s = "off"), e(document.activeElement).is(u) || (t.preventDefault(), t.stopImmediatePropagation(), a(s, l)) } else if (33 === l || 34 === l) { if ((n.overflowed[0] || n.overflowed[1]) && (t.preventDefault(), t.stopImmediatePropagation()), "keyup" === t.type) { Q(o); var f = 34 === l ? -1 : 1; if ("x" === i.axis || "yx" === i.axis && n.overflowed[1] && !n.overflowed[0]) var h = "x", m = Math.abs(c[0].offsetLeft) - f * (.9 * d.width()); else var h = "y", m = Math.abs(c[0].offsetTop) - f * (.9 * d.height()); G(o, m.toString(), { dir: h, scrollEasing: "mcsEaseInOut" }) } } else if ((35 === l || 36 === l) && !e(document.activeElement).is(u) && ((n.overflowed[0] || n.overflowed[1]) && (t.preventDefault(), t.stopImmediatePropagation()), "keyup" === t.type)) { if ("x" === i.axis || "yx" === i.axis && n.overflowed[1] && !n.overflowed[0]) var h = "x", m = 35 === l ? Math.abs(d.width() - c.outerWidth(!1)) : 0; else var h = "y", m = 35 === l ? Math.abs(d.height() - c.outerHeight(!1)) : 0; G(o, m.toString(), { dir: h, scrollEasing: "mcsEaseInOut" }) } } } var o = e(this), n = o.data(a), i = n.opt, r = n.sequential, l = a + "_" + n.idx, s = e("#mCSB_" + n.idx), c = e("#mCSB_" + n.idx + "_container"), d = c.parent(), u = "input,textarea,select,datalist,keygen,[contenteditable='true']", f = c.find("iframe"), h = ["blur." + l + " keydown." + l + " keyup." + l]; f.length && f.each(function () { e(this).bind("load", function () { A(this) && e(this.contentDocument || this.contentWindow.document).bind(h[0], function (e) { t(e) }) }) }), s.attr("tabindex", "0").bind(h[0], function (e) { t(e) }) }, j = function (t, o, n, i, r) { function l(e) { u.snapAmount && (f.scrollAmount = u.snapAmount instanceof Array ? "x" === f.dir[0] ? u.snapAmount[1] : u.snapAmount[0] : u.snapAmount); var o = "stepped" !== f.type, a = r ? r : e ? o ? p / 1.5 : g : 1e3 / 60, n = e ? o ? 7.5 : 40 : 2.5, s = [Math.abs(h[0].offsetTop), Math.abs(h[0].offsetLeft)], d = [c.scrollRatio.y > 10 ? 10 : c.scrollRatio.y, c.scrollRatio.x > 10 ? 10 : c.scrollRatio.x], m = "x" === f.dir[0] ? s[1] + f.dir[1] * (d[1] * n) : s[0] + f.dir[1] * (d[0] * n), v = "x" === f.dir[0] ? s[1] + f.dir[1] * parseInt(f.scrollAmount) : s[0] + f.dir[1] * parseInt(f.scrollAmount), x = "auto" !== f.scrollAmount ? v : m, _ = i ? i : e ? o ? "mcsLinearOut" : "mcsEaseInOut" : "mcsLinear", w = !!e; return e && 17 > a && (x = "x" === f.dir[0] ? s[1] : s[0]), G(t, x.toString(), { dir: f.dir[0], scrollEasing: _, dur: a, onComplete: w }), e ? void (f.dir = !1) : (clearTimeout(f.step), void (f.step = setTimeout(function () { l() }, a))) } function s() { clearTimeout(f.step), $(f, "step"), Q(t) } var c = t.data(a), u = c.opt, f = c.sequential, h = e("#mCSB_" + c.idx + "_container"), m = "stepped" === f.type, p = u.scrollInertia < 26 ? 26 : u.scrollInertia, g = u.scrollInertia < 1 ? 17 : u.scrollInertia; switch (o) { case "on": if (f.dir = [n === d[16] || n === d[15] || 39 === n || 37 === n ? "x" : "y", n === d[13] || n === d[15] || 38 === n || 37 === n ? -1 : 1], Q(t), oe(n) && "stepped" === f.type) return; l(m); break; case "off": s(), (m || c.tweenRunning && f.dir) && l(!0) } }, Y = function (t) { var o = e(this).data(a).opt, n = []; return "function" == typeof t && (t = t()), t instanceof Array ? n = t.length > 1 ? [t[0], t[1]] : "x" === o.axis ? [null, t[0]] : [t[0], null] : (n[0] = t.y ? t.y : t.x || "x" === o.axis ? null : t, n[1] = t.x ? t.x : t.y || "y" === o.axis ? null : t), "function" == typeof n[0] && (n[0] = n[0]()), "function" == typeof n[1] && (n[1] = n[1]()), n }, X = function (t, o) { if (null != t && "undefined" != typeof t) { var n = e(this), i = n.data(a), r = i.opt, l = e("#mCSB_" + i.idx + "_container"), s = l.parent(), c = typeof t; o || (o = "x" === r.axis ? "x" : "y"); var d = "x" === o ? l.outerWidth(!1) - s.width() : l.outerHeight(!1) - s.height(), f = "x" === o ? l[0].offsetLeft : l[0].offsetTop, h = "x" === o ? "left" : "top"; switch (c) { case "function": return t(); case "object": var m = t.jquery ? t : e(t); if (!m.length) return; return "x" === o ? ae(m)[1] : ae(m)[0]; case "string": case "number": if (oe(t)) return Math.abs(t); if (-1 !== t.indexOf("%")) return Math.abs(d * parseInt(t) / 100); if (-1 !== t.indexOf("-=")) return Math.abs(f - parseInt(t.split("-=")[1])); if (-1 !== t.indexOf("+=")) { var p = f + parseInt(t.split("+=")[1]); return p >= 0 ? 0 : Math.abs(p) } if (-1 !== t.indexOf("px") && oe(t.split("px")[0])) return Math.abs(t.split("px")[0]); if ("top" === t || "left" === t) return 0; if ("bottom" === t) return Math.abs(s.height() - l.outerHeight(!1)); if ("right" === t) return Math.abs(s.width() - l.outerWidth(!1)); if ("first" === t || "last" === t) { var m = l.find(":" + t); return "x" === o ? ae(m)[1] : ae(m)[0] } return e(t).length ? "x" === o ? ae(e(t))[1] : ae(e(t))[0] : (l.css(h, t), void u.update.call(null, n[0])) } } }, N = function (t) {
            function o() { return clearTimeout(f[0].autoUpdate), 0 === l.parents("html").length ? void (l = null) : void (f[0].autoUpdate = setTimeout(function () { return c.advanced.updateOnSelectorChange && (s.poll.change.n = i(), s.poll.change.n !== s.poll.change.o) ? (s.poll.change.o = s.poll.change.n, void r(3)) : c.advanced.updateOnContentResize && (s.poll.size.n = l[0].scrollHeight + l[0].scrollWidth + f[0].offsetHeight + l[0].offsetHeight + l[0].offsetWidth, s.poll.size.n !== s.poll.size.o) ? (s.poll.size.o = s.poll.size.n, void r(1)) : !c.advanced.updateOnImageLoad || "auto" === c.advanced.updateOnImageLoad && "y" === c.axis || (s.poll.img.n = f.find("img").length, s.poll.img.n === s.poll.img.o) ? void ((c.advanced.updateOnSelectorChange || c.advanced.updateOnContentResize || c.advanced.updateOnImageLoad) && o()) : (s.poll.img.o = s.poll.img.n, void f.find("img").each(function () { n(this) })) }, c.advanced.autoUpdateTimeout)) } function n(t) {
                function o(e, t) {
                    return function () {
                        return t.apply(e, arguments)
                    }
                } function a() { this.onload = null, e(t).addClass(d[2]), r(2) } if (e(t).hasClass(d[2])) return void r(); var n = new Image; n.onload = o(n, a), n.src = t.src
            } function i() { c.advanced.updateOnSelectorChange === !0 && (c.advanced.updateOnSelectorChange = "*"); var e = 0, t = f.find(c.advanced.updateOnSelectorChange); return c.advanced.updateOnSelectorChange && t.length > 0 && t.each(function () { e += this.offsetHeight + this.offsetWidth }), e } function r(e) { clearTimeout(f[0].autoUpdate), u.update.call(null, l[0], e) } var l = e(this), s = l.data(a), c = s.opt, f = e("#mCSB_" + s.idx + "_container"); return t ? (clearTimeout(f[0].autoUpdate), void $(f[0], "autoUpdate")) : void o()
        }, V = function (e, t, o) { return Math.round(e / t) * t - o }, Q = function (t) { var o = t.data(a), n = e("#mCSB_" + o.idx + "_container,#mCSB_" + o.idx + "_container_wrapper,#mCSB_" + o.idx + "_dragger_vertical,#mCSB_" + o.idx + "_dragger_horizontal"); n.each(function () { Z.call(this) }) }, G = function (t, o, n) { function i(e) { return s && c.callbacks[e] && "function" == typeof c.callbacks[e] } function r() { return [c.callbacks.alwaysTriggerOffsets || w >= S[0] + y, c.callbacks.alwaysTriggerOffsets || -B >= w] } function l() { var e = [h[0].offsetTop, h[0].offsetLeft], o = [x[0].offsetTop, x[0].offsetLeft], a = [h.outerHeight(!1), h.outerWidth(!1)], i = [f.height(), f.width()]; t[0].mcs = { content: h, top: e[0], left: e[1], draggerTop: o[0], draggerLeft: o[1], topPct: Math.round(100 * Math.abs(e[0]) / (Math.abs(a[0]) - i[0])), leftPct: Math.round(100 * Math.abs(e[1]) / (Math.abs(a[1]) - i[1])), direction: n.dir } } var s = t.data(a), c = s.opt, d = { trigger: "internal", dir: "y", scrollEasing: "mcsEaseOut", drag: !1, dur: c.scrollInertia, overwrite: "all", callbacks: !0, onStart: !0, onUpdate: !0, onComplete: !0 }, n = e.extend(d, n), u = [n.dur, n.drag ? 0 : n.dur], f = e("#mCSB_" + s.idx), h = e("#mCSB_" + s.idx + "_container"), m = h.parent(), p = c.callbacks.onTotalScrollOffset ? Y.call(t, c.callbacks.onTotalScrollOffset) : [0, 0], g = c.callbacks.onTotalScrollBackOffset ? Y.call(t, c.callbacks.onTotalScrollBackOffset) : [0, 0]; if (s.trigger = n.trigger, 0 === m.scrollTop() && 0 === m.scrollLeft() || (e(".mCSB_" + s.idx + "_scrollbar").css("visibility", "visible"), m.scrollTop(0).scrollLeft(0)), "_resetY" !== o || s.contentReset.y || (i("onOverflowYNone") && c.callbacks.onOverflowYNone.call(t[0]), s.contentReset.y = 1), "_resetX" !== o || s.contentReset.x || (i("onOverflowXNone") && c.callbacks.onOverflowXNone.call(t[0]), s.contentReset.x = 1), "_resetY" !== o && "_resetX" !== o) { if (!s.contentReset.y && t[0].mcs || !s.overflowed[0] || (i("onOverflowY") && c.callbacks.onOverflowY.call(t[0]), s.contentReset.x = null), !s.contentReset.x && t[0].mcs || !s.overflowed[1] || (i("onOverflowX") && c.callbacks.onOverflowX.call(t[0]), s.contentReset.x = null), c.snapAmount) { var v = c.snapAmount instanceof Array ? "x" === n.dir ? c.snapAmount[1] : c.snapAmount[0] : c.snapAmount; o = V(o, v, c.snapOffset) } switch (n.dir) { case "x": var x = e("#mCSB_" + s.idx + "_dragger_horizontal"), _ = "left", w = h[0].offsetLeft, S = [f.width() - h.outerWidth(!1), x.parent().width() - x.width()], b = [o, 0 === o ? 0 : o / s.scrollRatio.x], y = p[1], B = g[1], T = y > 0 ? y / s.scrollRatio.x : 0, k = B > 0 ? B / s.scrollRatio.x : 0; break; case "y": var x = e("#mCSB_" + s.idx + "_dragger_vertical"), _ = "top", w = h[0].offsetTop, S = [f.height() - h.outerHeight(!1), x.parent().height() - x.height()], b = [o, 0 === o ? 0 : o / s.scrollRatio.y], y = p[0], B = g[0], T = y > 0 ? y / s.scrollRatio.y : 0, k = B > 0 ? B / s.scrollRatio.y : 0 }b[1] < 0 || 0 === b[0] && 0 === b[1] ? b = [0, 0] : b[1] >= S[1] ? b = [S[0], S[1]] : b[0] = -b[0], t[0].mcs || (l(), i("onInit") && c.callbacks.onInit.call(t[0])), clearTimeout(h[0].onCompleteTimeout), J(x[0], _, Math.round(b[1]), u[1], n.scrollEasing), !s.tweenRunning && (0 === w && b[0] >= 0 || w === S[0] && b[0] <= S[0]) || J(h[0], _, Math.round(b[0]), u[0], n.scrollEasing, n.overwrite, { onStart: function () { n.callbacks && n.onStart && !s.tweenRunning && (i("onScrollStart") && (l(), c.callbacks.onScrollStart.call(t[0])), s.tweenRunning = !0, C(x), s.cbOffsets = r()) }, onUpdate: function () { n.callbacks && n.onUpdate && i("whileScrolling") && (l(), c.callbacks.whileScrolling.call(t[0])) }, onComplete: function () { if (n.callbacks && n.onComplete) { "yx" === c.axis && clearTimeout(h[0].onCompleteTimeout); var e = h[0].idleTimer || 0; h[0].onCompleteTimeout = setTimeout(function () { i("onScroll") && (l(), c.callbacks.onScroll.call(t[0])), i("onTotalScroll") && b[1] >= S[1] - T && s.cbOffsets[0] && (l(), c.callbacks.onTotalScroll.call(t[0])), i("onTotalScrollBack") && b[1] <= k && s.cbOffsets[1] && (l(), c.callbacks.onTotalScrollBack.call(t[0])), s.tweenRunning = !1, h[0].idleTimer = 0, C(x, "hide") }, e) } } }) } }, J = function (e, t, o, a, n, i, r) { function l() { S.stop || (x || m.call(), x = K() - v, s(), x >= S.time && (S.time = x > S.time ? x + f - (x - S.time) : x + f - 1, S.time < x + 1 && (S.time = x + 1)), S.time < a ? S.id = h(l) : g.call()) } function s() { a > 0 ? (S.currVal = u(S.time, _, b, a, n), w[t] = Math.round(S.currVal) + "px") : w[t] = o + "px", p.call() } function c() { f = 1e3 / 60, S.time = x + f, h = window.requestAnimationFrame ? window.requestAnimationFrame : function (e) { return s(), setTimeout(e, .01) }, S.id = h(l) } function d() { null != S.id && (window.requestAnimationFrame ? window.cancelAnimationFrame(S.id) : clearTimeout(S.id), S.id = null) } function u(e, t, o, a, n) { switch (n) { case "linear": case "mcsLinear": return o * e / a + t; case "mcsLinearOut": return e /= a, e-- , o * Math.sqrt(1 - e * e) + t; case "easeInOutSmooth": return e /= a / 2, 1 > e ? o / 2 * e * e + t : (e-- , -o / 2 * (e * (e - 2) - 1) + t); case "easeInOutStrong": return e /= a / 2, 1 > e ? o / 2 * Math.pow(2, 10 * (e - 1)) + t : (e-- , o / 2 * (-Math.pow(2, -10 * e) + 2) + t); case "easeInOut": case "mcsEaseInOut": return e /= a / 2, 1 > e ? o / 2 * e * e * e + t : (e -= 2, o / 2 * (e * e * e + 2) + t); case "easeOutSmooth": return e /= a, e-- , -o * (e * e * e * e - 1) + t; case "easeOutStrong": return o * (-Math.pow(2, -10 * e / a) + 1) + t; case "easeOut": case "mcsEaseOut": default: var i = (e /= a) * e, r = i * e; return t + o * (.499999999999997 * r * i + -2.5 * i * i + 5.5 * r + -6.5 * i + 4 * e) } } e._mTween || (e._mTween = { top: {}, left: {} }); var f, h, r = r || {}, m = r.onStart || function () { }, p = r.onUpdate || function () { }, g = r.onComplete || function () { }, v = K(), x = 0, _ = e.offsetTop, w = e.style, S = e._mTween[t]; "left" === t && (_ = e.offsetLeft); var b = o - _; S.stop = 0, "none" !== i && d(), c() }, K = function () { return window.performance && window.performance.now ? window.performance.now() : window.performance && window.performance.webkitNow ? window.performance.webkitNow() : Date.now ? Date.now() : (new Date).getTime() }, Z = function () { var e = this; e._mTween || (e._mTween = { top: {}, left: {} }); for (var t = ["top", "left"], o = 0; o < t.length; o++) { var a = t[o]; e._mTween[a].id && (window.requestAnimationFrame ? window.cancelAnimationFrame(e._mTween[a].id) : clearTimeout(e._mTween[a].id), e._mTween[a].id = null, e._mTween[a].stop = 1) } }, $ = function (e, t) { try { delete e[t] } catch (o) { e[t] = null } }, ee = function (e) { return !(e.which && 1 !== e.which) }, te = function (e) { var t = e.originalEvent.pointerType; return !(t && "touch" !== t && 2 !== t) }, oe = function (e) { return !isNaN(parseFloat(e)) && isFinite(e) }, ae = function (e) { var t = e.parents(".mCSB_container"); return [e.offset().top - t.offset().top, e.offset().left - t.offset().left] }, ne = function () { function e() { var e = ["webkit", "moz", "ms", "o"]; if ("hidden" in document) return "hidden"; for (var t = 0; t < e.length; t++)if (e[t] + "Hidden" in document) return e[t] + "Hidden"; return null } var t = e(); return t ? document[t] : !1 }; e.fn[o] = function (t) { return u[t] ? u[t].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof t && t ? void e.error("Method " + t + " does not exist") : u.init.apply(this, arguments) }, e[o] = function (t) { return u[t] ? u[t].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof t && t ? void e.error("Method " + t + " does not exist") : u.init.apply(this, arguments) }, e[o].defaults = i, window[o] = !0, e(window).bind("load", function () { e(n)[o](), e.extend(e.expr[":"], { mcsInView: e.expr[":"].mcsInView || function (t) { var o, a, n = e(t), i = n.parents(".mCSB_container"); if (i.length) return o = i.parent(), a = [i[0].offsetTop, i[0].offsetLeft], a[0] + ae(n)[0] >= 0 && a[0] + ae(n)[0] < o.height() - n.outerHeight(!1) && a[1] + ae(n)[1] >= 0 && a[1] + ae(n)[1] < o.width() - n.outerWidth(!1) }, mcsInSight: e.expr[":"].mcsInSight || function (t, o, a) { var n, i, r, l, s = e(t), c = s.parents(".mCSB_container"), d = "exact" === a[3] ? [[1, 0], [1, 0]] : [[.9, .1], [.6, .4]]; if (c.length) return n = [s.outerHeight(!1), s.outerWidth(!1)], r = [c[0].offsetTop + ae(s)[0], c[0].offsetLeft + ae(s)[1]], i = [c.parent()[0].offsetHeight, c.parent()[0].offsetWidth], l = [n[0] < i[0] ? d[0] : d[1], n[1] < i[1] ? d[0] : d[1]], r[0] - i[0] * l[0][0] < 0 && r[0] + n[0] - i[0] * l[0][1] >= 0 && r[1] - i[1] * l[1][0] < 0 && r[1] + n[1] - i[1] * l[1][1] >= 0 }, mcsOverflow: e.expr[":"].mcsOverflow || function (t) { var o = e(t).data(a); if (o) return o.overflowed[0] || o.overflowed[1] } }) })
    })
});
