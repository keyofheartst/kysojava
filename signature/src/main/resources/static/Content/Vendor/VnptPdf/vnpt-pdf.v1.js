/*!
 * =============================================================
 * vnptpdf v1.0.0 - PDF Advanced signature helper.
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
    const $pdfWrapper = $('.pdf-page');

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
            }
        };
        this.wrapper = element;
        this.CallBack = options.Callback;
        this.settings = $.extend(true, defaults, options);
        this.pdfPages = [];
    }

    var $btnSign = null;

    VnptPdf.prototype.initUI = function () {
        this.wrapper.html(pdfWorkingArea);
        $('#dragThis').hide();

        this.signatureBox = $('#dragThis');
        this.changeSignatureVisibleType();

        $btnSign = $('#pdf-complete');
        var self = this;

        $btnSign.click(function () {
            //self.CallBack(self.settings);
            console.log('sign clicked');
        });
    };

    VnptPdf.prototype.initDataBase64 = function (base64) {
        var typedarray = _convertDataURIToBinary(base64);
        this.initData(typedarray);
    };

    VnptPdf.prototype.initDataFile = function (file) {
        var fileReader = new FileReader();
        var self = this;
        fileReader.onload = function () {
            var typedarray = new Uint8Array(this.result);
            self.initData(typedarray);
        };
        fileReader.readAsArrayBuffer(file);
    };

    VnptPdf.prototype.initData = function (typedarrayData) {
        var self = this;
        self.initUI();
        PDFJS.getDocument(typedarrayData).then(function (pdf) {
            if (pdf.numPages < self.settings.sigPage) {
                console.error('[Error] >> options[sigPage] is invalid, total pages is %d', pdf.numPages);
                return;
            }

            if (self.settings.useLastPage) {
                self.settings.sigPage = pdf.numPages;
            }

            // Render all pges, init signature box when complete
            for (let index = 1; index <= pdf.numPages; index++) {
                let canvasId = "pdfPage_" + index;
                var canvasI = canvas.replace("ID_VALUE", canvasId);
                $('.pdf-page').append(canvasI);
                pdf.getPage(index).then(function (page) {
                    _handlePage(page, canvasId, self, index === pdf.numPages).then(function (isRenderComplete) {
                        if (isRenderComplete) {
                            self.initSignatureBox();
                        }
                    });
                });
            }
        });
    };

    VnptPdf.prototype.changeSignatureVisibleType = function () {
        const type = '' + this.settings.visibleType;
        this.signatureBox.empty();
        switch (type) {
            case '1':
                this.signatureBox.html(_textandLogoLeft);
                break;
            case '2':
                this.signatureBox.html(_textandLogoLeft);
                break;
            case '3':
                this.signatureBox.html(_logoOnly);
                break;
            case '4':
                this.signatureBox.html(_textAndLogoTop);
                break;
            case '5':
                this.signatureBox.html(_textAndBackground);
                break;
        }
    };

    function _handlePage(page, canvasId, vnptpdf, isLastPage) {
        const dpi = document.getElementById('dpi').offsetWidth;

        var xview = page.getViewport(1);

        vnptpdf.pdfPages.push({
            width: xview.width,
            height: xview.height
        });

        //Grab the viewport with original scale
        // Pdf using 72 units per inch, while your screen dpi difference ex 96dpi ->>
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
        page.render(renderContext);
        $('#' + canvasId).show();

        return new Promise(function (resolve, reject) {
            resolve(isLastPage);
        });
    }

    VnptPdf.prototype.initSignatureBox = function () {
        const page = this.settings.sigPage;
        const pdfPage = $('#pdfPage_' + page);
        const signBox = this.signatureBox;
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
        signBox.css({ 'top': yPos, 'left': xPos, 'height': h, 'width': w, 'position': 'absolute' });
        signBox.show();
        _setupSignatureBox(signBox, pdfPage, boundX, boundY);
    };

    function _setupSignatureBox(box, pdfPage, boundX, boundY) {
        const dpi = document.getElementById('dpi').offsetWidth;
        box
            .draggable({
                containment: $('#dropHere'),
                drag: function () {
                    var top = box[0].offsetTop;
                    var left = box[0].offsetLeft;
                    
                },
                stop: function () {
                }
            })
            .resizable({
                resize: function (event, ui) {
                    //_changeSignBoxSize($(this));
                },
                stop: function (event, ui) {
                    //_changeSignBoxSize($(this));
                }
            });

        pdfPage.droppable({
            accept: '#dragThis',
            over: function () {
                $('#dragThis').draggable('option', 'containment', $(this));
            }
        });

        // Xử lý sự kiện resize windows làm page viewport thay đổi theo
        //window.addEventListener('resize', function () {
        //    var boundX = _pdfPage[0].offsetLeft;
        //    var boundY = _pdfPage[0].offsetTop;
        //    var h = Math.floor(_signBox[0].offsetHeight / getDpi() * 72);

        //    var left = boundX + _options.x * getDpi() / 72;
        //    var top = (_pageHeight - h - _options.y) * getDpi() / 72 + boundY;
        //    _signBox.css({ "left": left, "top": top });
        //});
    }

    function _convertDataURIToBinary(base64) {
        var raw = window.atob(base64);
        var rawLength = raw.length;
        var array = new Uint8Array(new ArrayBuffer(rawLength));

        for (i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        return array;
    }

    // 
    $.fn[pluginName] = function (options) {
        var vnptPdf;
        if (!$.data(this, pluginName)) {
            vnptPdf = new VnptPdf(this, options);
            $.data(this, pluginName, vnptPdf);
        }
        return vnptPdf;
    };

    var pdfWorkingArea = '<div id="dpi" style="height: 1in; left: -100%; position: absolute; top: -100%; width: 1in;"></div>' +
        '<div class="pdf-working-area">' +
        '    <div class="pdf-action-menu">' +
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
        '                    <input type="radio" name="sign-visible-type" value="2" checked> Hiển thị text và logo bên trái<br />' +
        '                    <input type="radio" name="sign-visible-type" value="3"> Chỉ hiển thị logo<br />' +
        '                    <input type="radio" name="sign-visible-type" value="4" checked> Hiển thị text và logo phía trên<br />' +
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
        '                                ... <input id="select-file" name="SetupFile" type="file"' +
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
        '                                    <td>   </td>' +
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
        '                <tr>' +
        '                    <td>' +
        '                        <button class="pdf-btn" id="pdf-complete">Ký dữ liệu</button>' +
        '                    </td>' +
        '                    <td>' +
        '                        <button class="pdf-btn pdf-btn-error" id="pdf-cancel">Hủy</button>' +
        '                    </td>' +
        '                </tr>' +
        '            </table>' +
        '        </div>' +
        '    </div>' +
        '    <div class="pdf-page">' +
        '        <div id="dragThis">' +
        '        </div>' +
        '    </div>' +
        '</div>';
    var canvas = '<canvas id="ID_VALUE" class="pdf-viewport"></canvas><br/>';

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
        '            <div class="signaturebox-image-left-img">' +
        '            </div>' +
        '        </div>' +
        '    </div>';
    const _logoOnly = 
        '    <div id="" class="signaturebox">' +
        '        <div class="signaturebox-image-only">' +
        '        </div>' +
        '    </div>';
    const _textAndLogoTop = 
        '    <div id="" class="signaturebox">' +
        '        <div class="signaturebox-image-top">' +
        '            <div>' +
        '                <span>Ky boi: Ten chu chung thu</span><br />' +
        '                <span>Ngay ky: 18/03/2019</span>' +
        '            </div>' +
        '            <div class="signaturebox-image-top-img">' +
        '            </div>' +
        '        </div>' +
        '    </div>';
    const _textAndBackground = 
        '    <div id="" class="signaturebox">' +
        '        <div class="signaturebox-textonly">' +
        '            <div>' +
        '                <span>Ky boi: Ten chu chung thu</span><br />' +
        '                <span>Ngay ky: 18/03/2019</span>' +
        '            </div>' +
        '        </div>' +
        '    </div>';

    return VnptPdf;

}));
