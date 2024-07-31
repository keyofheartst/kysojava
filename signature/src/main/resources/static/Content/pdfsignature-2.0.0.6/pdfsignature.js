/*!
 * =============================================================
 * PDF Advanced signature helper.
 *
 * Copyright © 2020 Aragorn
 * Author: TuanBS<tuanbs208@gmail.com>
 * =============================================================
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        root.PdfSignature = factory(root.jQuery);
    }
}(this, function ($) {
    var pluginName = "pdfsignature";
    var $copyRight = "eSignature © 2020";
    var $productVersion = "2.0.0.6";

    /**
     * 
     * @param {any} element Wrapper element
     * @param {any} options Plugin options
     * @param {any} callback Callback function
     */
    function PdfSignature(element, options) {
        let defaults = {
            location: '',
            reason: '',
            signatures: [],
            comments: [],
            pdfFile: {
                file: null,
                totalPages: 0
            },
            fontName: 'Roboto',
            fontSize: 10,
            fontStyle: 0,
            visibleType: 5,
            fontColor: '000000',
            visibleText: 'Ký bởi: _______________\nNgày ký: ' + this.getCurrentDate() + '\nTổ chức xác thực: _ _ _ _ _ _ _ _ _',
            //signatureImg: "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",
            useDefaultText: true,
            readOnly: false,
            penMode: {
                mode: 'pencil',
                penSize: 1,
                penStyle: '#0000FF'
            },
			
			highLightMode: {
                mode: 'highlight',
                penSize: 20,
                penStyle: 'RGBA(255,0,0,0.4)'
            },
			
            signatureImgs: [],
            scale: 1,
            lastScale: 1,
            signTemplate: {},
            onCreateSignatureImg: null,
            onConfirm: null,
            onReject: null,
            commentFistTime: true
        };
        this.pageRendering = false;
        this.pageNumPending = null;

        this.wrapper = element;

        this.onConfirm = options.onConfirm;
        if (typeof options.visibleText !== 'undefined' && options.visibleText !== '') {
            this.settings.useDefaultText = false;
        }
        this.settings = $.extend(true, defaults, options);
        this.pdfPages = {};
        this.currentPage = 1;
        this.totalPages = 0;
        this.show = false;
        this.UseImage = false;
        this.commentTimes = [];
        this.redoTimes = [];
        this.scroll = true;
        this.data = null;

        $('body').append('<div id="dpi" style="height: 1in; left: -100%; position: absolute; top: -100%; width: 1in;"></div>');
        this.dpi = document.getElementById('dpi').offsetWidth;
    }

    /**
     * Reset all settings
     * */
    PdfSignature.prototype.reset = function () {
        this.pdfPages = {};
        this.currentPage = 1;
        this.totalPages = 0;
        this.show = false;
        this.UseImage = false;
        this.commentTimes = [];
        this.redoTimes = [];
        this.settings.comments = [];
        this.settings.signatures = [];
    };

    PdfSignature.prototype.getCurrentDate = function () {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        return dd + '/' + mm + '/' + yyyy;
    };

    /**
     * 
     * */
    PdfSignature.prototype.initUI = function () {
        const self = this;
        // Color picker plugin
        let sigcontainer = '<div id="sig-working-container">' + pdfWorkingArea.replace('SIG-COLOR', '#' + this.settings.fontColor) + '</div>';
        this.wrapper.html(sigcontainer);

        $('#wpaint-color span').click(function () {
            if ($(this).hasClass('active')) {
                return;
            }

            if (self.settings.penMode.mode === "pencil"){
                let color = $(this).data('color');
            self.changePencilColor(color);
            $('#wpaint-color span').removeClass('active');
            $(this).addClass('active');
            } else if(self.settings.penMode.mode === "highlight"){
                let color = $(this).data('color');
                self.changePencilColor(color);
            $('#wpaint-color span').removeClass('active');
            $(this).addClass('active');
            }

            // let color = $(this).data('color');
            // self.changePencilColor(color);
            // $('#wpaint-color span').removeClass('active');
            // $(this).addClass('active');
        });

        // Add comment modal
        $('#sig-working-container').append(_addCommentModal);
        $('#sig-working-container').append(_createSignatureModal);
        $('#sig-working-container').append(_confirmModal);
        $('#sig-working-container').append(_editSignatureModal);

        this.changeSignatureVisibleImg();

        let pageSetupBtn = $('#esign-page-setup-btn');
        self.settings.zoomerInit = false;
        self.alert = $(_esignAlert).appendTo($('#sig-working-container'));
        pageSetupBtn.click(function () {
            $('.esign-page-popup').hide();
            $('.wPaint-menu-icon:not(#esign-page-setup-btn)').removeClass('toggled');
            $('.esign-btn-flat').removeClass('toggled');
            if (!pageSetupBtn.hasClass('toggled')) {
                $('#esign-page-setup-btn').addClass('toggled');
                $('#esign-page-setup').show();
            } else {
                $('#esign-page-setup-btn').removeClass('toggled');
                $('#esign-page-setup').hide();
            }
        });

        let pageSignListBtn = $('#esign-signature-list-btn');
        pageSignListBtn.unbind();
        pageSignListBtn.click(function () {
            $('.esign-page-popup').hide();
            $('.wPaint-menu-icon').removeClass('toggled');
            $('.esign-btn-flat:not(#esign-signature-list-btn)').removeClass('toggled');
            if (!pageSignListBtn.hasClass('toggled')) {
                $('#esign-signature-list-content').empty();
                if (!self.settings.signatureImgs || self.settings.signatureImgs.length < 1) {
                    $('<span>Anh/chị chưa có mẫu chữ ký nào</span>').appendTo($('#esign-signature-list-content'));
                }
                $.each(self.settings.signatureImgs, function (index, img) {
                    let sigTemp = $('<div id="sig-temp-' + index + '" class="esign-sign-template">' +
                        '<div class="esign-signtemp-remove-container">' +
                        '   <button type="button" data-key="' + img.key + '" class="esign-ripple add">Thêm</button>' +
                        '   <button type="button" data-key="' + img.key + '" class="esign-ripple remove esign-btn-default">Xóa</button>' +
                        '</div></div>')
                        .appendTo($('#esign-signature-list-content'));
                    sigTemp.css('background-image', 'url(data:image/png;base64,' + img.img + ')');
                    sigTemp.find('.add').unbind();
                    sigTemp.find('.add').on('click', function () {
                        self.settings.signatureImg = img.img;
                        self.changeSignatureVisibleImg();
                        self.addSignature();
                        $('.esign-page-popup').css('display', 'none');
                        $('.esign-btn-flat').removeClass('toggled');
                    });

                    sigTemp.find('.remove').unbind();
                    sigTemp.find('.remove').on('click', function () {
                        let _this = $(this);
                        confirmDialog('danger', 'Xóa mẫu chữ ký', 'Anh/chị có chắc chắn muốn xóa mẫu chữ ký này', function () {
                            _this.closest('.esign-sign-template').remove();
                            if (self.settings.onRemoveSignatureImg) {
                                self.settings.onRemoveSignatureImg(_this.data('key'));
                            }
                            let temp = [];
                            $.each(self.settings.signatureImgs, function (index, img) {
                                if (img && img.key === _this.data('key')) {
                                    //
                                } else {
                                    temp.push(img);
                                }
                            });
                            self.settings.signatureImgs = temp;
                        });
                    });
                });

                $('#esign-signature-list-btn').addClass('toggled');
                $('#esign-signature-list').show();
            } else {
                $('#esign-signature-list-btn').removeClass('toggled');
                $('#esign-signature-list').hide();
            }
        });

        let pageCommentMenuBtn = $('#esign-comment-menu-btn');
        pageCommentMenuBtn.unbind();
        pageCommentMenuBtn.click(function () {
            $('.esign-page-popup').hide();
            $('.wPaint-menu-icon').removeClass('toggled');
            $('.esign-btn-flat:not(#esign-comment-menu-btn)').removeClass('toggled');
            if (!pageCommentMenuBtn.hasClass('toggled')) {
                $('#esign-comment-menu-btn').addClass('toggled');
                $('#esign-comment-menu').show();
            } else {
                $('#esign-comment-menu-btn').removeClass('toggled');
                $('#esign-comment-menu').hide();
            }
        });

        $('#esign-add-signature-btn').unbind();
        $('#esign-add-signature-btn').click({ msgTarget: this }, this.createSignature);

        if (this.settings.readOnly) {
            $('#pdf-complete').hide();
            $('#pdf-cancel').hide();
            $('.pdf-action-menu').hide();
            $('.fab').hide();
        }

        $('#pdf-next-page').click(function () {
            self.nextPage();
        });

        $('#pdf-prev-page').click(function () {
            self.prevPage();
        });

        $('#pdf-working-curent').keyup({ msgTarget: this }, this.changePagebyInput);

        self.initPencilMenu();

        $(window).unbind('scroll');
        window.onscroll = self.changeBottomMenuPos;
        self.changeBottomMenuPos();
    };

    PdfSignature.prototype.addSignature = function () {
        let self = this;
        const boxHtml = this.getSignatureVisibleElement(this.settings.visibleType);
        let samplebox = $(_signatureBox).appendTo($('#signature_drags'));
        samplebox.find('.pdf_signature_remove').remove();
        let boxContent = samplebox.find('.sign-box-content');
        boxContent.empty();
        boxContent.html(boxHtml);
        self.setFontName();
        self.setFontStyle();
        self.setFontSize();
        self.setFontColor();
        const pageHeight = Math.ceil(self.pdfPages[self.currentPage].pdfContent.getViewport({ scale: 1 }).height);
        const pageWidth = Math.ceil(self.pdfPages[self.currentPage].pdfContent.getViewport({ scale: 1 }).width);
        const dpi = document.getElementById('dpi').offsetWidth;
        let comm = {
            x: Math.floor(pageWidth / 2 / dpi * 72),
            y: pageHeight - Math.ceil(pageHeight / 2 / dpi * 72),
            width: 200,
            height: 76,
            page: self.currentPage,
            element: samplebox
        };

        self.initSignature(comm);
        self.showAlert('info', 'Tips!', 'Kéo khung chữ ký tới vị trí anh/chị cần ký', 5000);
    };

    /**
     * */
    PdfSignature.prototype.changeBottomMenuPos = function () {
        let header = document.getElementById("esign-bottom-menu");
        if (!header) {
            return;
        }
        if ($("#sig-working-container").isInViewport()) {
            header.classList.add("esign-bottom-menu-sticky");
        } else {
            header.classList.remove("esign-bottom-menu-sticky");
        }
    };

    $.fn.isInViewport = function () {
        if (!$(this) || !$(this).offset()) {
            return;
        }
        var elementTop = $(this).offset().top;
        var elementBottom = elementTop + $(this).outerHeight();
        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();
        return elementBottom >= viewportBottom && elementTop + 100 < viewportBottom;
    };

    /**
     * 
     * @param {any} type type
     * @param {any} title title
     * @param {any} mesg mesg
     * @param {any} timeout timeout
     */
    PdfSignature.prototype.showAlert = function (type, title, mesg, timeout) {
        let alert = this.alert;
        alert.removeClass();
        alert.addClass('esign-alert');
        alert.addClass(type);
        alert.find('.esign-alert-msg').text(mesg);
        alert.find('.esign-alert-title').text(title);
        alert.show();

        $('.esign-alert-closebtn').unbind();
        $('.esign-alert-closebtn').off();
        $('.esign-alert-closebtn').click(function () {
            let div = this.parentElement;
            div.style.opacity = "0";
            setTimeout(function () { div.style.display = "none"; }, 100);
        });

        setTimeout(function () { alert.css("display", "none"); }, timeout);
    };

    /**
     * Init pencil menu
     * */
    PdfSignature.prototype.initPencilMenu = function () {
        let self = this;
        $('.pdf-working-area .wPaint-menu-icon-name-undo').addClass('disabled').removeClass('hover');
        $('.pdf-working-area .wPaint-menu-icon-name-redo').addClass('disabled').removeClass('hover');

        // More
        $('#esign-paint-more').find('.esign-btn-content').click(function () {
            if ($('#esign-paint-more').hasClass('active')) {
                $('#esign-paint-more').removeClass('active');
                $('#esign-wpaint-more-menu').css('visibility', 'hidden');
            } else {
                $('#esign-paint-more').addClass('active');
                $('#esign-wpaint-more-menu').css('visibility', 'visible');
            }
        });

        // Undo
        $('#esign-paint-undo').click(function () {
            self.pdfPages[self.currentPage].comment.element.wPaint('undo');
        });

        // Redo
        $('#esign-paint-redo').click(function () {
            self.pdfPages[self.currentPage].comment.element.wPaint('redo');
        });

        // Clear
        $('#esign-paint-clear').click(function () {
            if ($('#sig-working-container .wPaint-menu-icon-name-clear').hasClass('disabled')) {
                return;
            }
            confirmDialog('danger', 'Xóa bút phê',
                'Hủy toàn bộ thao tác bút phê trên trang này?<br />Sau khi hủy sẽ không thể thực hiện Undo.',
                function () {
                    self.pdfPages[self.currentPage].comment.element.wPaint('clear');
                    self.pdfPages[self.currentPage].comment.wPaintPoints = [];
                    self.pdfPages[self.currentPage].comment.wPaintUndoPoints = [];
                    self.pdfPages[self.currentPage].comment.background = null;
                });
        });

        // Pencil mode
        $('#esign-paint-mode-pencil').click(function () {
            if ($('#esign-paint-mode-pencil').hasClass('active')) {
                return;
            }
            if (self.settings.penMode) {
                self.settings.penMode.mode = "pencil";
                self.settings.penMode.penSize = 1;
                // Thêm query màu tại đây
                if (self.settings.penMode.penStyle.length === 9) {
                    self.settings.penMode.penStyle = self.settings.penMode.penStyle.slice(0, 7);
                }
            } else {
                self.settings.penMode = {
                    mode: 'pencil',
                    penSize: 1,
                    penStyle: '#0000FF'
                };
            }               
            
            Object.keys(self.pdfPages).map(function (key, index) {
                if (self.pdfPages[key].comment.element) {
                    self.pdfPages[key].comment.element.wPaint('setMode', self.settings.penMode);
                }
            });

            $('#esign-paint-mode-highlight').removeClass('active');
            $('#esign-paint-mode-pencil').addClass('active');
        });

        // Highlight mode
        $('#esign-paint-mode-highlight').click(function () {
            if ($('#esign-paint-mode-highlight').hasClass('active')) {
                return;
            }
            //const self = this;
            //let color = $(self).data('colorHighlight');

            if (self.settings.penMode) {
                self.settings.penMode.mode = "highlight";
                self.settings.penMode.penSize = 20;
                self.settings.penMode.penStyle += "70";
            } else {
                self.settings.penMode = {
                    mode: 'highlight',
                    penSize: 20,
                    penStyle: '#ffff0070'
                };
            }
                
            
            
            Object.keys(self.pdfPages).map(function (key, index) {
                if (self.pdfPages[key].comment.element) {
                    self.pdfPages[key].comment.element.wPaint('setMode', self.settings.penMode);
                }
            });
            $('#esign-paint-mode-pencil').removeClass('active');
            $('#esign-paint-mode-highlight').addClass('active');
        });

        $('#esign-add-comment-draw-btn, #esign-add-comment-draw-btn-same').unbind();
        $('#esign-add-comment-draw-btn, #esign-add-comment-draw-btn-same').click(function () {
            $('#esign-paint-init').closest('.esign-bottom-menu-content').css('display', 'inline-block');
            initWpaint();
        });

        $('#esign-paint-init').unbind();
        $('#esign-paint-init').click(initWpaint);

        function initWpaint() {
            $('#esign-comment-menu').css('display', 'none');
            $('#esign-signature-list').css('display', 'none');
            $('#esign-comment-menu-btn').removeClass('toggled');
            if (self.settings.paintEnable) {
                $('#esign-paint-init').find('.esign-tooltiptext').text('Chuyển chế độ bút phê');
                $('#esign-paint-init').closest('.esign-bottom-menu-content').removeClass('esign-bottom-right-menu');
                $('#esign-paint-init').closest('.esign-bottom-menu-content').addClass('esign-bottom-center-menu');
                self.settings.paintEnable = false;
            } else {
                $('#esign-paint-init').find('.esign-tooltiptext').text('Chuyển chế độ đọc');
                $('#esign-paint-init').closest('.esign-bottom-menu-content').addClass('esign-bottom-right-menu');
                $('#esign-paint-init').closest('.esign-bottom-menu-content').removeClass('esign-bottom-center-menu');
                self.settings.paintEnable = true;
            }
            $('#esign-paint-init').find('.esign-bottom-menu-btn-icon').removeClass('esign-pencil-init');
            $('#esign-paint-init').find('.esign-bottom-menu-btn-icon').addClass('esign-drag');
            $('.esign-bottom-left-menu.wpaint-menu').css('width', 'auto');
            $('.esign-bottom-left-menu.wpaint-menu').css('display', 'inline-block');

            let page = self.pdfPages[self.currentPage];
            //let innerFabs = document.getElementsByClassName('inner-fabs')[0];
            let comment = page.comment;
            if (!comment.element) {
                self.initPencilComment(comment);
                if (self.settings.commentFistTime && !localStorage.getItem('showInitPdfMessage')) {
                    self.settings.commentFistTime = false;
                    localStorage.setItem('showInitPdfMessage', 'false');
                    self.showAlert('info', 'Tips!', 'Đặt trang hiển thị ở kích thước 100% để có chất lượng bút phê tốt nhất.', 5000);
                }
            } else if (!comment.enable) {
                comment.enable = true;
                comment.element.show();
            } else {
                $('#esign-paint-init').find('.esign-bottom-menu-btn-icon').removeClass('esign-drag');
                $('#esign-paint-init').find('.esign-bottom-menu-btn-icon').addClass('esign-pencil-init');
                $('.esign-bottom-left-menu.wpaint-menu').css('width', '0px');
                $('.esign-bottom-left-menu.wpaint-menu').css('display', 'none');
                comment.enable = false;
                comment.element.hide();
            }
        }

        //$('#esign-page-add-sign').click(function () {
        //    self.addSignature();
        //});

        $('#esign-add-comment-type-btn').click({ msgTarget: self }, self.addComment);
    };

    /**
     * Init pencil comment 
     * @param {any} comment comment
     */
    PdfSignature.prototype.initPencilComment = function (comment) {
        let self = this;
        let page = self.pdfPages[self.currentPage];
        let innerFabs = document.getElementsByClassName('inner-fabs')[0];
        let com = _comment.replace('COMMENT', ' ').replace('comcom', 'comment-element-' + page.index);
        if (self.wrapper.find('#pdfPage_container_' + page.index).find('#comment-element-' + page.index)) {
            self.wrapper.find('#pdfPage_container_' + page.index).find('#comment-element-' + page.index).remove();
        }
        let commentElement = $(com).appendTo(self.wrapper.find('#pdfPage_container_' + page.index));
        commentElement.find('.comment-text').remove();
        commentElement.find('.pdf-comment-remove-container').remove();
        let pdfPage = $('#pdfPage_container_' + page.index);
        let boundX = pdfPage[0].offsetLeft;
        let boundY = pdfPage[0].offsetTop;

        const dpi = document.getElementById('dpi').offsetWidth;

        let pageHeight = Math.ceil(page.pdfContent.getViewport({ scale: 1 }).height);
        let pageWidth = Math.ceil(page.pdfContent.getViewport({ scale: 1 }).width);

        let x = comment.x || 10;
        let y = comment.y || 10;
        let width = comment.width || pageWidth - 20;
        let height = comment.height || pageHeight - 20;
        comment.x = 10; comment.y = 10; comment.width = width; comment.height = height;
        comment.enable = true;

        let scale = self.settings.scale;

        //let yPos = (pageHeight - y - height) * dpi / 72 + 9 - 14 + boundY;
        //let xPos = boundX + 9 + Math.floor(x * dpi / 72);
        let yPos = Math.ceil(comment.y * dpi * scale / 72);
        let xPos = Math.ceil(comment.x * dpi * scale / 72);
        let h = Math.floor(height * dpi * scale / 72);
        let w = Math.floor(width * dpi * scale / 72);
        commentElement.css({ 'top': yPos, 'left': xPos, 'height': h, 'width': w, 'position': 'absolute' });
        commentElement.show();
        comment.element = commentElement;
        //commentElement.find('.pdf_signature_remove').remove();
        let color = $('#pdf-menu-color').val();
        if (!color) {
            color = '0000FF';
        }
        color = '#' + color;
        comment.scale = self.settings.scale;

        comment.wPaint = commentElement.wPaint({
            menuOffsetLeft: 0,
            menuOffsetTop: -50,
            lineWidth: '2',
            ratio: self.settings.scale,
            path: '/Content/wPaint-master/',
            theme: 'standard classic',
            strokeStyle: color,
            onShapeUp: function (e) {
                comment.background = this.getImage(false).replace('data:image/png;base64,', '');
                comment.scale = self.settings.scale;
                commentElement.wPaint('getwPaintState', function (points, undoPoints, mode) {
                    comment.wPaintPoints = points;
                    comment.wPaintUndoPoints = undoPoints;
                });
            },
            menuDragCallbak: function (left, top) {
                console.log("Left: " + left + ", top: " + top);
            },
            name: '' + comment.page
        });


        //innerFabs.classList.toggle('show');
        //$('#paint-init').addClass('disabled');
        //$('#paint-init').css('cursor', 'not-allowed');
        commentElement.wPaint('setStrokeStyle', color);
        if (!self.settings.mode) {
            self.settings.mode = self.settings.penMode;
        }
        commentElement.wPaint('setMode', self.settings.mode);

        let d = {
            arrayPoints: comment.wPaintPoints,
            undoArrayPoints: comment.wPaintUndoPoints
        };
        commentElement.wPaint('setwPaintState', d);
    };

    /**
     * Init pdf data from base64 encode
     * @param {any} base64 pdf data with base64 encoded
     */
    PdfSignature.prototype.initDataBase64 = function (base64) {
        if (!base64) {
            return;
        }
        if (base64.indexOf('base64') < 0) {
            console.error('Data invalid encoded');
            return;
        }
        
        base64 = base64.substr(base64.indexOf('base64') + 7);
        let typedarray = this.convertDataURIToBinary(base64);
        this.base64 = base64;
        this.initData(typedarray);
    };

    PdfSignature.prototype.initDataJson = function (json) {
        this.UseImage = true;
        this.data = json;
    };

    /**
     * Init pdf data from file
     * @param {any} file Pdf data file
     */
    PdfSignature.prototype.initDataFile = function (file) {
        const self = this;
        return new Promise(resolve => {
            let fileReader = new FileReader();
            //fileReader.onload = function () {
            //    var typedarray = new Uint8Array(this.result);
            //    self.initData(typedarray);
            //};
            //fileReader.readAsArrayBuffer(file);
            fileReader.onload = function () {
                self.initDataBase64(this.result);
                resolve(true);
            };
            fileReader.readAsDataURL(file);
        });
    };

    /**
     * Init pdf data from byte array
     * @param {any} typedarrayData byte[] array pdf data
     */
    PdfSignature.prototype.initData = function (typedarrayData) {
        this.data = typedarrayData;
    };

    PdfSignature.prototype.getDataBased64 = function () {
        return this.base64;
    };


    PdfSignature.prototype.showBlankPages = function (w, h) {
        let self = this;
        for (i = 1; i <= self.totalPages; i++) {
            let canvasId = "pdfPage_container_" + i;
            let canvas = document.getElementById(canvasId);
            if (!canvas) {
                let canvasI = _divPdf.replace("ID_VALUE", canvasId);
                $('.pdf-page').append(canvasI);
                canvas = document.getElementById(canvasId);
                canvas.style.width = w + 'px';
                canvas.style.height = h + 'px';
            }
        }
    };

    /**
     * Start plugin
     * */
    PdfSignature.prototype.start = function () {
        var self = this;
        self.maxLoadThumbnails = 7;
        self.initUI();
        self.settings.comments = [];

        if (self.UseImage) {
            self.renderPdfImage(self.data.Pages[0], self.data.TotalPage);
        } else {
            let loadingTask = pdfjsLib.getDocument({
                data: self.data
            });
            loadingTask.promise.then(function (pdf) {
                pdf.getMetadata().then(function (stuff) {
                    let d = new Date(stuff.info.CreationDate);
                    $('#esign-doc-author').text(stuff.info.Author);
                    $('#esign-doc-creator').text(stuff.info.Creator);
                    if (stuff.metadata && stuff.metadata._metadata) {
                        $('#esign-doc-creationdate').text(stuff.metadata._metadata['xmp:createdate']);
                    }

                    $('#esign-doc-producer').text(stuff.info.Producer);
                    $('#esign-doc-version').text(stuff.info.PDFFormatVersion);
                    $('#esign-doc-pages').text(pdf.numPages);
                }).catch(function (err) {
                    console.log('Error getting meta data');
                    console.log(err);
                });
                self.pdf = pdf;
                self.previousPage = self.currentPage;
                self.currentPage = 1;
                self.totalPages = pdf.numPages;
                $('#pdf-prev-page').addClass('disabled');
                $('#pdf-current-page-head-devider').text('of ' + self.totalPages);
                self.pdfPages = {};

                $('#pdf-action-menu-right').css('width', '0px');

                pdf.getPage(1).then(function (page) {
                    let windowHeight = document.getElementById('sig-working-container').offsetHeight - 36;
                    let windowWidth = document.getElementById('sig-working-container').offsetWidth - 60;
                    const dpi = document.getElementById('dpi').offsetWidth;
                    let scale = 1 / 72 * dpi;
                    let viewport = page.getViewport({ scale: scale });
                    self.settings.defaultHeight = viewport.height / scale;
                    self.settings.defaultWidth = viewport.width / scale;
                    let hRatio = parseFloat((windowHeight / viewport.height).toFixed(1));
                    let wRatio = parseFloat(((windowWidth - 120) / viewport.width).toFixed(1));
                    self.settings.scale = Math.max(hRatio, wRatio);
                    self.settings.scale = Math.min(self.settings.scale, 1.5);

                    self.settings.scale = Math.max(self.settings.scale, 0.2);
                    $('#esign-bottom-menu-text').text((self.settings.scale * 100).toFixed(0) + '%');

                    self.showBlankPages(viewport.width * self.settings.scale, viewport.height * self.settings.scale);
                    self.renderPage(self.currentPage).then(function () {
                        self.pageScroller = new Dragdealer('esign-page-scroller', {
                            horizontal: false,
                            vertical: true,
                            callback: function (x, y) {
                                //console.log(y);
                            },
                            dragStartCallback: function (x, y) {
                                self.scroll = false;
                            },
                            dragStopCallback: function (x, y) {
                                self.scroll = true;
                            },
                            animationCallback: function (x, y) {
                                // gọi ngay cả khi setValue (đúng điên)
                                $('#esign-page-scroller').find('.handle').text(self.currentPage);
                                if (!self.scroll) {
                                    let p = 1 + Math.round(y * (self.totalPages - 1));
                                    let availHeight = $('.pdf-page').outerHeight() -
                                        $('.pdf-working-area').outerHeight();
                                    document.getElementsByClassName('pdf-working-area')[0].scrollTop = y * availHeight;
                                }
                            }
                        });

                        $('#esign-page-zoomin').click(function () {
                            self.zoomIn();
                        });

                        $('#esign-page-zoomout').click(function () {
                            self.zoomOut();
                        });

                        if (self.currentPage + 1 <= self.totalPages) {
                            self.renderPage(self.currentPage + 1);
                        }
                    });
                });


                $('#pdf-cancel').show();
                self.btnCancel = $('#pdf-cancel');
                self.btnCancel.click({ msgTarget: self }, self.reject);
                if (!self.settings.readOnly) {
                    $('#pdf-complete').show();
                    self.btnSign = $('#pdf-complete');
                    self.btnSign.click({ msgTarget: self }, self.complete);

                }
            });
        }

    };

    /**
     * 
     * @param {any} scale scale
     */
    PdfSignature.prototype.zoomIn = function (scale) {
        $('#esign-page-zoomout').removeClass('disabled');
        let self = this;
        if (this.settings.scale >= 1.9) {
            $('#esign-page-zoomin').addClass('disabled');
            return;
        }

        this.settings.lastScale = this.settings.scale;
        this.settings.scale += 0.1;
        this.settings.scale = parseFloat(this.settings.scale.toFixed(1));

        this.zoom();
    };

    /**
     * 
     * @param {any} scale scale
     */
    PdfSignature.prototype.zoomOut = function (scale) {
        $('#esign-page-zoomin').removeClass('disabled');
        let self = this;
        if (this.settings.scale <= 0.3) {
            $('#esign-page-zoomout').addClass('disabled');
            return;
        }
        this.settings.lastScale = this.settings.scale;
        this.settings.scale -= 0.1;
        this.settings.scale = parseFloat(this.settings.scale.toFixed(1));
        this.zoom();
    };

    PdfSignature.prototype.zoom = function () {
        let self = this;

        let s = this.settings.scale / this.settings.lastScale;
        for (i = 1; i <= this.totalPages; i++) {
            let page = this.pdfPages[i];
            if (i === this.currentPage) {
                continue;
            }
            let xx = $('#pdfPage_container_' + i)[0];
            $('#pdfPage_container_' + i).css({
                'width': Math.ceil(xx.offsetWidth * s - 18),
                'height': Math.ceil(xx.offsetHeight * s - 18)
            });
        }


        $('#esign-bottom-menu-text').text((this.settings.scale * 100).toFixed(0) + '%');
        let prevP = this.pdfPages[this.currentPage];
        if (prevP && prevP.comment && prevP.comment.element) {
            prevP.comment.element.wPaint('getwPaintState', function (points, undoPoints, mode) {
                self.settings.mode = mode;
            });
            prevP.comment.element.remove();
        }
        $('#pdfPage_container_' + this.currentPage).empty();

        this.changePage();
    };

    PdfSignature.prototype.nextPage = function () {
        if (this.currentPage === this.totalPages) {
            return;
        }
        $('#comment-element-' + this.currentPage).hide();
        this.previousPage = this.currentPage;
        this.currentPage += 1;
        let t = document.getElementById('pdfPage_container_' + this.currentPage).offsetTop;
        document.getElementsByClassName('pdf-working-area')[0].scrollTop = t - 48;
        self.scroll = true;
        this.pageScroller.setValue(0, (this.currentPage - 1) / (this.totalPages - 1), true);
        if (this.currentPage === this.totalPages) {
            $('#pdf-next-page').addClass('disabled');
        }
        $('#pdf-prev-page').removeClass('disabled');
        this.changePage();
    };

    PdfSignature.prototype.changePagebyInput = function (evt) {
        if (evt.keyCode === 13) {
            let self = evt.data.msgTarget;
            let inputPage = Number(evt.target.value);

            if (isNaN(inputPage)) {
                self.showAlert('danger', 'Error!', 'Số trang không hợp lệ.', 5000);
                evt.target.value = self.currentPage;
                return;
            }
            if (inputPage < 1 || inputPage > self.totalPages) {
                self.showAlert('danger', 'Error!', 'Số trang không hợp lệ.', 5000);
                evt.target.value = self.currentPage;
                return;
            }

            self.changePagebyNumber(inputPage);
        }
    };

    PdfSignature.prototype.changePagebyNumber = async function (inputPage) {
        let self = this;
        $('#comment-element-' + self.currentPage).hide();
        self.previousPage = self.currentPage;
        self.currentPage = inputPage;
        self.scroll = true;
        self.pageScroller.setValue(0, (self.currentPage - 1) / (self.totalPages - 1), true);

        let t = document.getElementById('pdfPage_container_' + inputPage).offsetTop;
        document.getElementsByClassName('pdf-working-area')[0].scrollTop = t - 48;
        $('#pdf-next-page').removeClass('disabled');
        $('#pdf-prev-page').removeClass('disabled');
        if (self.currentPage === 1) {
            $('#pdf-prev-page').addClass('disabled');
        } else if (self.currentPage === self.totalPages) {
            $('#pdf-next-page').addClass('disabled');
        }

        await self.changePage();
    }

    /**
     * 
     * */
    PdfSignature.prototype.prevPage = function () {
        if (this.currentPage === 1) {
            return;
        }
        $('#comment-element-' + this.currentPage).hide();
        this.previousPage = this.currentPage;
        this.currentPage -= 1;
        let t = document.getElementById('pdfPage_container_' + this.currentPage).offsetTop;
        document.getElementsByClassName('pdf-working-area')[0].scrollTop = t - 48;
        self.scroll = true;
        this.pageScroller.setValue(0, (this.currentPage - 1) / (this.totalPages - 1), true);
        if (this.currentPage === 1) {
            $('#pdf-prev-page').addClass('disabled');
        }
        $('#pdf-next-page').removeClass('disabled');
        this.changePage();
    };

    /**
     * Render lại hình ảnh chữ ký khi chuyển page
     * */
    PdfSignature.prototype.reRenderSignatureView = function () {
        let self = this;

        const pageHeight = Math.ceil(self.pdfPages[self.currentPage].pdfContent.getViewport({ scale: 1 }).height);
        const dpi = document.getElementById('dpi').offsetWidth;


        $('.pdf-page .signature-view').hide();
        let signatures = self.pdfPages[self.currentPage].signatures;
        if (signatures) {
            signatures.forEach(function (box) {
                const pdfPage = $('#pdfPage_container_' + box.page);
                const boundX = pdfPage[0].offsetLeft;
                const boundY = pdfPage[0].offsetTop;
                const x = box.x;
                const y = box.y;
                const height = box.height;
                const width = box.width;

                var yPos = Math.floor((pageHeight - y - height) * self.settings.scale * dpi / 72) + 9 - 4 + boundY;
                var xPos = boundX + 9 + Math.floor(x * self.settings.scale * dpi / 72);
                var h = Math.floor(height * self.settings.scale * dpi / 72);
                var w = Math.floor(width * self.settings.scale * dpi / 72);
                box.element.css({ 'top': yPos, 'left': xPos, 'height': h, 'width': w, 'position': 'absolute' });


                document.getElementById(box.elementId).style.display === 'unset';
                box.element.show();
                box.element.css('display', 'unset');
            });
        }
    };

    PdfSignature.prototype.changePage = async function () {
        let self = this;
        return new Promise(resolve => {
            if (self.currentPage < 1) {
                return;
            }
            let prevP = this.pdfPages[this.previousPage];
            if (prevP && prevP.comment && prevP.comment.element) {
                prevP.comment.element.wPaint('getwPaintState', function (points, undoPoints, mode) {
                    self.settings.mode = mode;
                });
                prevP.comment.element.remove();
                prevP.comment.element = null;
                prevP.comment.enable = false;
            }

            self.hidePageTask(self.currentPage);
            $('#esign-page-scroller').find('.handle').text(self.currentPage);

            if (this.currentPage === this.totalPages) {
                $('#pdf-next-page').addClass('disabled');
            } else {
                $('#pdf-next-page').removeClass('disabled');
            }
            if (this.currentPage === 1) {
                $('#pdf-prev-page').addClass('disabled');
            } else {
                $('#pdf-prev-page').removeClass('disabled');
            }
            let page = this.pdfPages[this.currentPage];

            self.renderPage(self.currentPage).then(function () {
                page = self.pdfPages[self.currentPage];
                if (self.currentPage + 1 <= self.totalPages) {
                    self.renderPage(self.currentPage + 1).then(resolve('resolved'));
                }
                if (page && page.comment && self.settings.paintEnable) {
                    self.initPencilComment(page.comment);
                } else {
                    // donothing
                }
                resolve('resolved');
            });
        });
    };

    /**
     * Render lại hình ảnh chữ ký khi chuyển page`
     * */
    PdfSignature.prototype.reRenderTextCommentView = function () {
        let self = this;


        const pageHeight = Math.ceil(self.pdfPages[self.currentPage].pdfContent.getViewport({ scale: 1 }).height);
        const dpi = document.getElementById('dpi').offsetWidth;

        let comments = self.settings.comments;
        if (comments) {
            comments.forEach(function (box) {
                if (box.page !== self.currentPage) {
                    box.element.hide();
                } else {
                    const pdfPage = $('#pdfPage_container_' + box.page);
                    const boundX = pdfPage[0].offsetLeft;
                    const boundY = pdfPage[0].offsetTop;
                    const x = box.x;
                    const y = box.y;
                    const height = box.height;
                    const width = box.width;

                    var yPos = Math.floor((pageHeight - y - height) * self.settings.scale * dpi / 72) + 9 - 4 + boundY;
                    var xPos = boundX + 9 + Math.floor(x * self.settings.scale * dpi / 72); var h = Math.floor(height * self.settings.scale * dpi / 72);
                    var w = Math.floor(width * self.settings.scale * dpi / 72);
                    box.element.css({ 'top': yPos, 'left': xPos, 'height': h, 'width': w, 'position': 'absolute' });

                    box.element.show();
                }
            });
        }
    };

    /**
     * 
     * @param {any} index index
     * @return {any} promise
     */
    PdfSignature.prototype.renderPage = function (index) {
        let self = this;
        if (self.pageRendering) {
            return;
        }
        let $deferred = new $.Deferred();
        self.pageRendering = true;
        let pdfPage = self.pdfPages[index];
        $('#pdf-working-curent').val(self.currentPage);
        if (!pdfPage) {
            self.pdf.getPage(index).then(
                function (page) {
                    self.pdfPages[index] = {
                        index: index,
                        pdfContent: page,
                        comment: {
                            page: index,
                            wPaintPoints: [],
                            wPaintUndoPoints: []
                        },
                        signatures: [],
                        show: true
                    };
                    self.viewPageTask(page, index).then(function () {
                        $deferred.resolve();
                    });
                }
            );
        } else {
            let page = pdfPage.pdfContent;
            pdfPage.show = true;
            this.viewPageTask(page, index).then(function () {
                $deferred.resolve();
            });
        }

        return $deferred.promise();
    };

    PdfSignature.prototype.getCurrentPage = function (currentTop, wiewportHeight) {
        let self = this;
        let x = currentTop + wiewportHeight / 2;
        let index = 1;

        while (index <= self.totalPages) {
            let page = document.getElementById('pdfPage_container_' + index);
            if (page.offsetTop > x) {
                break;
            }
            index++;
        }
        return index - 1;
    };

    PdfSignature.prototype.hidePageTask = function (index) {
        let self = this;

        for (i = 1; i <= index - 1; i++) {
            let page = this.pdfPages[i];
            if (page && page.show) {
                page.show = false;
                $('#pdfPage_container_' + i).empty();
                $('#pdfPage_container_' + i).append(_divPdfLoading);
            }
        }

        for (i = index + 1; i <= this.totalPages; i++) {
            let page = this.pdfPages[i];
            if (page && page.show) {
                page.show = false;
                $('#pdfPage_container_' + i).empty();
                $('#pdfPage_container_' + i).append(_divPdfLoading);
            }
        }
    };

    /**
     * 
     * @param {any} page page
     * @param {any} pageIndex pageIndex
     * @returns {any} promise
     */
    PdfSignature.prototype.viewPageTask = function (page, pageIndex) {
        var deferred = new $.Deferred();
        let self = this;
        const dpi = document.getElementById('dpi').offsetWidth;
        let scale = self.settings.scale / 72 * dpi;
        let viewport = page.getViewport({ scale: scale });
        //let canvas = document.getElementById(canvasId);
        let canvasId = "pdfPage_" + pageIndex;
        let canvas = document.getElementById(canvasId);
        if (!canvas) {
            let canvasI = _canvasPdf.replace("ID_VALUE", canvasId);
            $('#pdfPage_container_' + pageIndex).empty();
            $('#pdfPage_container_' + pageIndex).append(canvasI);
            canvas = document.getElementById(canvasId);
        }
        console.log(self.currentPage);
        let context = canvas.getContext('2d');
        canvas.height = viewport.height * window.devicePixelRatio;
        canvas.width = viewport.width * window.devicePixelRatio;
        canvas.style.width = viewport.width + 'px';
        $('#pdfPage_container_' + pageIndex).css('width', viewport.width + 'px');
        $('#pdfPage_container_' + pageIndex).css('height', viewport.height + 'px');

        // Render PDF page into canvas context.
        let renderContext = {
            canvasContext: context,
            viewport: viewport,
            transform: [window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0]
        };
        let renderTask = page.render(renderContext);

        renderTask.promise.then(function () {
            self.pageRendering = false;
            $('#' + canvasId).show();
            //$('.pdf-working-area').animate({ scrollTop: 0 }, "fast");
            if (pageIndex === self.currentPage) {
                self.reRenderSignatureView();
                self.reRenderTextCommentView();
            }
            if (!self.show) {
                self.show = true;
                window.removeEventListener("orientationchange", self.windowResizeEventHandle);
                $(window).unbind("resize", self.windowResizeEventHandle);

                window.addEventListener("orientationchange", self.windowResizeEventHandle.bind(self), false);
                $(window).resize(self.windowResizeEventHandle.bind(self));

                // Xử lý scroll
                let ele = $('.pdf-working-area')[0];
                window.removeEventListener('wheel', self.changePageOnscroll);
                $('.pdf-working-area').unbind('scroll', self.changePageOnscroll);

                $('.pdf-working-area').scroll(self.changePageOnscroll.bind(self));
                window.addEventListener('wheel', self.changePageOnscroll.bind(self));

                self.addSignature();
            }
            deferred.resolve();
        })
            .catch(error => console.error(error));

        return deferred.promise();
    };

    /**
     * */
    PdfSignature.prototype.changePageOnscroll = function () {
        let self = this;
        if (self.pageRendering) {
            console.log('rendering');
            return;
        }
        let ele = $('.pdf-working-area')[0];
        let curP = self.getCurrentPage(ele.scrollTop, ele.offsetHeight);
        if (curP !== self.currentPage) {
            self.previousPage = self.currentPage;
            $('#pdf-working-curent').val(curP);
            self.currentPage = curP;
            if (self.scroll) {
                self.pageScroller.setValue(0, (self.currentPage - 1) / (self.totalPages - 1), true);
            }
            self.changePage();
        }
    };

    /**
     * 
     * @param {any} evt event
     */
    PdfSignature.prototype.updateSignatureTextEvent = function (evt) {
        const self = evt.data.msgTarget;
        self.settings.visibleText = evt.target.value;
        self.settings.useDefaultText = false;
        self.setVisibleText();
    };

    PdfSignature.prototype.setVisibleText = function () {
        let htmlInner = '<span>' + this.settings.visibleText.replace(/(?:\r\n|\r|\n)/g, '<br>') + '</span>';
        $('.sig-text').html(htmlInner);
        if (!this.settings.useDefaultText) {
            $('#useDefaultText').prop('checked', false);
        }
    };

    PdfSignature.prototype.changeVisibleTextDefault = function (evt) {
        const self = evt.data.msgTarget;
        self.settings.useDefaultText = evt.target.checked;
    };

    PdfSignature.prototype.changeSignatureFontNameEvent = function (evt) {
        const self = evt.data.msgTarget;
        self.settings.fontName = evt.target.value;
        self.setFontName();
    };

    PdfSignature.prototype.setFontName = function () {
        $('.signaturebox').css('font-family', this.getFontFamily(this.settings.fontName));
        //$('.pdf-comment span').css('font-family', this.getFontFamily());
    };

    PdfSignature.prototype.getFontFamily = function (family) {
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

    PdfSignature.prototype.changeFontStyleEvent = function (evt) {
        const self = evt.data.msgTarget;
        self.settings.fontStyle = evt.target.value;
        self.setFontStyle(self.settings.fontStyle);
    };

    /**
     * */
    PdfSignature.prototype.setFontStyle = function () {
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
    PdfSignature.prototype.changeFontColorEvent = function (evt) {
        const self = evt.data.msgTarget;
        self.settings.fontColor = evt.target.value;
        self.setFontColor();
    };

    /**
     * */
    PdfSignature.prototype.setFontColor = function () {
        $('.signaturebox').css('color', '#' + this.settings.fontColor);
        //$('.pdf-comment span').css('color', '#' + this.settings.fontColor);
    };

    /**
     * Handle change visible type radio button checked
     * @param {any} evt Radio button checked event
     */
    PdfSignature.prototype.changeSignatureVisibleTypeEvent = function (evt) {
        const self = evt.data.msgTarget;
        self.settings.visibleType = parseInt('' + evt.target.value);
        self.changeSignatureVisibleType();
    };

    /**
     * Change signature visible type
     * */
    PdfSignature.prototype.changeSignatureVisibleType = function () {
        const boxHtml = this.getSignatureVisibleElement(this.settings.visibleType);
        const self = this;

        let drag = $('#signature_drags').find('.sign-box-content');
        drag.empty();
        drag.html(boxHtml);

        Object.keys(self.pdfPages).map(function (key, index) {
            let signatures = self.pdfPages[key].signatures;
            if (signatures) {
                signatures.forEach(function (box) {
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
                }
                );
            }
        });

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

    PdfSignature.prototype.setFontSize = function () {
        const dpi = document.getElementById('dpi').offsetWidth;
        const size = Math.ceil(this.settings.fontSize * dpi / 72);
        $('.signaturebox').css('font-size', size + 'px');
        //$('.pdf-comment span').css('font-size', size + 'px');
    };

    /**
     * 
     * @param {any} evt Select file event
     */
    PdfSignature.prototype.changeSignatureImageEvent = function (evt) {
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
    PdfSignature.prototype.changeSignatureVisibleImg = function () {
        const style = $('#PdfSignature-style');
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
    PdfSignature.prototype.initSignature = function (sig, index) {
        let self = this;
        const sigHtml = this.getSignatureVisibleElement(this.settings.visibleType).replace('signature_', 'signature_' + index);
        let b = _signatureBox.replace('signature_', 'signature_' + self.pdfPages[self.currentPage].signatures.length);
        const sigElement = $(b).appendTo(this.wrapper.find('.pdf-page'));
        sig.element = sigElement;
        sig.elementId = 'signature_' + self.pdfPages[self.currentPage].signatures.length;
        self.pdfPages[self.currentPage].signatures.push(sig);
        sigElement.find('.sign-box-content').empty();
        sigElement.find('.sign-box-content').html(sigHtml);
        //sigElement.find('.pdf_signature_remove.remove').click({ msgTarget: this, elmentTarget: sig }, this.removeSignature);
        sigElement.find('.pdf_signature_remove.edit').click({ msgTarget: this, elmentTarget: sig }, this.editSignature);
        sig.element = sigElement;

        const sigRow = $('<tr></tr>').appendTo('#pdf-signatures-table>tbody');
        sig.signatureRow = sigRow;
        sigRow.append('<td>' + (this.settings.signatures.indexOf(sig) + 1) + '</td>');
        sigRow.append('<td class="sig-rectangle">[' + sig.x + ',' + sig.y + ',' + sig.width + ',' + sig.height + ']</td >');
        sigRow.append('<td>' + sig.page + '</td>');

        const actionCell = $('<td class="comment-act">' + _trashIcon + '</td>').appendTo(sigRow);
        actionCell.click({ msgTarget: this, elmentTarget: sig }, this.removeSignature);


        const page = sig.page;
        const pdfPage = $('#pdfPage_container_' + page);
        const boundX = pdfPage[0].offsetLeft;
        const boundY = pdfPage[0].offsetTop;
        const pageHeight = Math.ceil(self.pdfPages[self.currentPage].pdfContent.getViewport({ scale: 1 }).height);
        const x = sig.x;
        const y = sig.y;
        const height = sig.height;
        const width = sig.width;
        const dpi = document.getElementById('dpi').offsetWidth;

        var yPos = Math.floor((pageHeight - y - height) * self.settings.scale * dpi / 72) + 9 - 4 + boundY;
        var xPos = boundX + 9 + Math.floor(x * self.settings.scale * dpi / 72);
        var h = Math.floor(height * self.settings.scale * dpi / 72);
        var w = Math.floor(width * self.settings.scale * dpi / 72);
        sig.element.css({ 'top': yPos, 'left': xPos, 'height': h, 'width': w, 'position': 'absolute' });
        sig.element.show();

        sig.element.draggable({
            containment: pdfPage,
            drag: function () {
                const boundX = pdfPage[0].offsetLeft;
                const boundY = pdfPage[0].offsetTop;
                const top = sig.element[0].offsetTop;
                const left = sig.element[0].offsetLeft;
                const xPos = Math.floor((left - boundX - 9) / dpi * 72 / self.settings.scale);
                sig.x = xPos;
                const h = Math.floor(sig.element[0].offsetHeight / dpi * 72 / self.settings.scale);
                const yPos = pageHeight - Math.ceil((top - boundY - 9) / dpi * 72 / self.settings.scale) - h;
                sig.y = yPos;
                sig.signatureRow.find('.sig-rectangle').text('[' + sig.x + ',' + sig.y + ',' + sig.width + ',' + sig.height + ']');
            },
            stop: function () {
            }
        })
            .resizable({
                resize: function (event, ui) {
                    var w = Math.floor(sig.element[0].offsetWidth / dpi * 72 / self.settings.scale);
                    var h = Math.floor(sig.element[0].offsetHeight / dpi * 72 / self.settings.scale);
                    sig.width = w;
                    sig.height = h;
                    sig.signatureRow.find('.sig-rectangle').text('[' + sig.x + ',' + sig.y + ',' + sig.width + ',' + sig.height + ']');
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

        window.addEventListener('resize', function () {
            self.windowResizeEventHandle();
        });
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
    PdfSignature.prototype.getSignatureVisibleElement = function (type) {
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
    PdfSignature.prototype.initSignatureBoxEvent = function () {
        const dpi = document.getElementById('dpi').offsetWidth;
        const page = this.settings.sigPage;
        const pageHeight = Math.ceil(this.pdfPages[page - 1].height);
        const pdfPage = $('#pdfPage_container_' + page);
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

    PdfSignature.prototype.initComments = function () {
        const self = this;
        this.settings.comments.forEach(function (comment) {
            if (comment.page > self.pdfPages.length) {
                console.error('[Error] Comment page invalid.');
                $('#pdf-comments-error').text('[Error] Comment page invalid.');
                return;
            }
            self.initComment(comment, false, false);
        });
    };

    /**
     * 
     * @param {any} comment comment
     * @param {any} dragable dragable
     * @param {any} wPaint wPaint
     */
    PdfSignature.prototype.initComment = function (comment, dragable, wPaint) {
        let self = this;
        const com = _comment.replace('COMMENT', comment.text.replace(/[\r\n]/g, "<br />"));
        let commentElement = $(com).appendTo(this.wrapper.find('.pdf-page'));
        commentElement.css('z-index', '+2');
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
        commentRow.append('<td>' + comment.text.replace(/[\r\n]/g, "<br />") + '</td >');
        commentRow.append('<td>' + comment.page + '</td>');

        const actionEditCell = $('<td class="comment-act">' + _editIcon + '</td>').appendTo(commentRow);
        actionEditCell.click({ msgTarget: this, elmentTarget: comment }, this.editComment);

        const actionCell = $('<td class="comment-act">' + _trashIcon + '</td>').appendTo(commentRow);
        actionCell.click({ msgTarget: this, elmentTarget: comment }, this.removeComment);

        const pdfPage = $('#pdfPage_container_' + comment.page);
        const boundX = pdfPage[0].offsetLeft;
        const boundY = pdfPage[0].offsetTop;
        const pageHeight = Math.ceil(self.pdfPages[self.currentPage].pdfContent.getViewport({ scale: 1 }).height);
        const pageWidth = Math.ceil(self.pdfPages[self.currentPage].pdfContent.getViewport({ scale: 1 }).width);
        const dpi = document.getElementById('dpi').offsetWidth;
        const x = comment.x || 50;
        const y = comment.y || 50;
        const width = comment.width || pageWidth - 100;
        const height = comment.height || pageHeight - 100;
        comment.x = x; comment.y = y; comment.width = width; comment.height = height;

        var yPos = (pageHeight - y - height) * self.settings.scale * dpi / 72 + 9 - 4 + boundY;
        var xPos = boundX + 9 + Math.floor(x * self.settings.scale * dpi / 72);
        var h = Math.floor(height * self.settings.scale * dpi / 72);
        var w = Math.floor(width * self.settings.scale * dpi / 72);
        commentElement.css({ 'top': yPos, 'left': xPos, 'height': h, 'width': w, 'position': 'absolute' });
        commentElement.css({ 'border': 'solid 1px #ffa200' });
        commentElement.show();
        if (dragable) {
            commentElement.draggable({
                containment: pdfPage,
                drag: function () {
                    const boundX = pdfPage[0].offsetLeft;
                    const boundY = pdfPage[0].offsetTop;
                    const top = comment.element[0].offsetTop;
                    const left = comment.element[0].offsetLeft;
                    const xPos = Math.floor((left - boundX - 9) / dpi * 72 / self.settings.scale);
                    comment.x = xPos;
                    const h = Math.floor(comment.element[0].offsetHeight / dpi * 72 / self.settings.scale);
                    const yPos = pageHeight - Math.ceil((top - boundY - 9) / dpi * 72 / self.settings.scale) - h;
                    comment.y = yPos;
                },
                stop: function () {
                }
            })
                .resizable({
                    resize: function (event, ui) {
                        var changeWidth = ui.size.width - ui.originalSize.width; // find change in width
                        var newWidth = ui.originalSize.width + changeWidth / self.settings.scale; // adjust new width by our zoomScale

                        var changeHeight = ui.size.height - ui.originalSize.height; // find change in height
                        var newHeight = ui.originalSize.height + changeHeight / self.settings.scale; // adjust new height by our zoomScale

                        ui.size.width = newWidth;
                        ui.size.height = newHeight;

                        var w = Math.floor(comment.element[0].offsetWidth / dpi * 72 / self.settings.scale);
                        var h = Math.floor(comment.element[0].offsetHeight / dpi * 72 / self.settings.scale);
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
        }
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
        const size = Math.round(comment.fontSize * self.settings.scale * dpi / 72);
        commentTextElement.css({
            'font-family': this.getFontFamily(comment.fontName),
            'font-size': size,
            'color': '#' + comment.fontColor
        });
        commentElement.css({
            'font-style': s,
            'font-weight': w3
        });

        comment.element = commentElement;

        let boundX2 = pdfPage[0].offsetLeft;
        let boundY2 = pdfPage[0].offsetTop;
        let top2 = comment.element[0].offsetTop;
        let left2 = comment.element[0].offsetLeft;
        let xPos2 = Math.floor((left2 - boundX2 - 9) / dpi * 72 / self.settings.scale);
        comment.x = xPos2;
        let comH = comment.element[0].offsetHeight + 80;
        let h2 = Math.floor(comH / dpi * 72 / self.settings.scale);
        let yPos2 = pageHeight - Math.ceil((top2 - boundY2 - 9) / dpi * 72 / self.settings.scale) - h2;
        comment.y = yPos2;
        let w1 = Math.floor(comment.element[0].offsetWidth / dpi * 72 / self.settings.scale);
        comment.width = w1;
        comment.height = h2;
        commentElement.find('.pdf_signature_remove.remove').click({ msgTarget: self, elmentTarget: comment }, self.removeComment);
        commentElement.find('.pdf_signature_remove.edit').click({ msgTarget: self, elmentTarget: comment }, self.editComment);
    };

    PdfSignature.prototype.initPaint = function (comment) {
        let self = this;
        if (comment.wPaint) {
            return;
        }
        comment.wPaint = comment.element.wPaint({
            menuOffsetLeft: 0,
            menuOffsetTop: -50,
            lineWidth: '2',
            path: '/Content/wPaint-master/',
            theme: 'standard classic',
            strokeStyle: '#000000',
            onShapeUp: function (e) {
                self.commentTimes.push(comment.index);
                $('.pdf-working-area .wPaint-menu-icon-name-undo').removeClass('disabled');
                $('.pdf-working-area .wPaint-menu-icon-name-clear').removeClass('disabled');
                document.getElementById('pdf-menu-color').jscolor.hide();
            },
            name: '' + comment.page,
            image: comment.background
        });
        $('#pdf-wPaint-show').hide();
        $('#pdf-wPaint-menu').css('display', 'flex');
    };

    /**
     * Change pencil color event
     * @param {any} evt jcolor picker event
     */
    PdfSignature.prototype.changePencilColorEvent = function (evt) {
        const self = evt.data.msgTarget;
        document.getElementById('pdf-menu-color').jscolor.hide();
        let color = '#' + $('#pdf-menu-color').val();
        self.changePencilColor(color);
    };

    PdfSignature.prototype.changePencilColor = function (color) {
        let self = this;
        if (self.settings.penMode.mode === "pencil") {
            self.settings.penMode.penStyle = color;
        }
        else if (self.settings.penMode.mode === "highlight") {
            color += "70";
            self.settings.penMode.penStyle = color;
        }   

        Object.keys(self.pdfPages).map(function (key, index) {
            if (self.pdfPages[key].comment.element) {
                //self.pdfPages[key].comment.element.wPaint('setStrokeStyle', color);
                self.pdfPages[key].comment.element.wPaint('setMode', self.settings.penMode);
            }
        });
    };

    /* Thử màu highlight color*/
    PdfSignature.prototype.changeHighlightColorEvent = function (evt) {
        const self = evt.data.msgTarget;
        document.getElementById('pdf-menu-color').jscolor.hide();
        let color = '#' + $('#pdf-menu-color').val();
        self.changeHighlightColor(color);
    };

	PdfSignature.prototype.changeHighlightColor = function (color) {
        let self = this;
        
        self.settings.penMode.penStyle = color;

        Object.keys(self.pdfPages).map(function (key, index) {
            if (self.pdfPages[key].comment.element) {
                self.pdfPages[key].comment.element.wPaint('setStrokeStyle', color);
            }
        });
    };

    PdfSignature.prototype.uriToImageData = function (uri) {
        return new Promise(function (resolve, reject) {
            if (uri === null) return reject();
            var canvas = document.createElement('canvas'),
                context = canvas.getContext('2d'),
                image = new Image();
            image.addEventListener('load', function () {
                canvas.width = image.width;
                canvas.height = image.height;
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
                resolve(context.getImageData(0, 0, canvas.width, canvas.height));
            }, false);
            image.src = uri;
        });
    };

    PdfSignature.prototype.editComment = function (evt) {
        const self = evt.data.msgTarget;
        const comment = evt.data.elmentTarget;

        let addCommentModal = document.getElementById('add-comment-modal');
        $('#add-comment-modal').find('#com-add').text('Cập nhật');
        $('#com-font-name').val(comment.fontName);
        $('#com-font-style').val(comment.fontStyle);
        $("#comment-type-color").find('.esign-color').removeClass('active');
        $("#comment-type-color").find(`[data-color='${comment.fontColor}']`).addClass('active');
        $('#comment-text').val(comment.text);

        $('#com-font-size').val(comment.fontSize);
        $('#com-font-size').asRange();
        $('#com-font-size').asRange('set', '' + comment.fontSize);
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

    PdfSignature.prototype.editCommentHandle = function (comment) {
        const dpi = document.getElementById('dpi').offsetWidth;
        const text = $('#comment-text').val();
        if ('' === text) {
            this.showAlert('warning', 'Warning!', 'Nội dung comment không được để trống.', 3000);
            return;
        }
        comment.text = text;
        comment.fontSize = $('#com-font-size').asRange('get');
        comment.fontName = $('#com-font-name').val();
        comment.fontStyle = $('#com-font-style').val();
        //comment.fontColor = $('#comment-font-color').val();
        //comment.fontColor = $('#comment-type-color').val();
        let color = $('#comment-type-color').find('.esign-color .active').data('color');
        if (!color) {
            color = "#0000FF";
        }
        comment.fontColor = color;
        //comment.fontColor = $('#comment-type-color').find('.esign-color.active').data('color');

        let self = this;
        let commentTextElement = comment.element.find('span.comment-text');
        commentTextElement.html(text.replace(/[\r\n]/g, "<br />"));
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
        const size = Math.ceil(comment.fontSize * self.settings.scale * dpi / 72);
        commentTextElement.css({
            'font-family': this.getFontFamily(comment.fontName),
            'font-size': size,
            'color': '#' + comment.fontColor
        });
        comment.element.css({
            'font-style': s,
            'font-weight': w3
        });
        let pdfPage = $('#pdfPage_container_' + comment.page);
        const pageHeight = Math.ceil(self.pdfPages[self.currentPage].pdfContent.getViewport({ scale: 1 }).height);
        const pageWidth = Math.ceil(self.pdfPages[self.currentPage].pdfContent.getViewport({ scale: 1 }).width);
        let boundX2 = pdfPage[0].offsetLeft;
        let boundY2 = pdfPage[0].offsetTop;
        let top2 = comment.element[0].offsetTop;
        let left2 = comment.element[0].offsetLeft;
        let xPos2 = Math.floor((left2 - boundX2 - 9) / dpi * 72 / self.settings.scale);
        comment.x = xPos2;
        let comH = comment.element[0].offsetHeight + 80;
        let h2 = Math.floor(comH / dpi * 72 / self.settings.scale);
        let yPos2 = pageHeight - Math.ceil((top2 - boundY2 - 9) / dpi * 72 / self.settings.scale) - h2;
        comment.y = yPos2;
        let w1 = Math.floor(comment.element[0].offsetWidth / dpi * 72 / self.settings.scale);
        comment.width = w1;
        comment.height = h2;
        $("#add-comment-modal").find('#com-add').off("click");
        document.getElementById('add-comment-modal').style.display = "none";
    };

    PdfSignature.prototype.removeComment = function (evt) {
        const self = evt.data.msgTarget;
        const comment = evt.data.elmentTarget;

        confirmDialog('danger', 'Xóa nội dung bút phê', 'Anh/chị chắc chắn muốn xóa nội dung bút phê này?', function () {
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
        });
    };

    PdfSignature.prototype.removeSignature = function (evt) {
        const self = evt.data.msgTarget;
        const sig = evt.data.elmentTarget;
        confirmDialog('danger', 'Xóa hình ảnh chữ ký', 'Anh/chị chắc chắn muốn xóa ảnh chữ ký này?', function () {
            let temp = [];
            self.pdfPages[sig.page].signatures.forEach(function (comm) {
                if (comm === sig) {
                    comm.element.remove();
                    comm.signatureRow.remove();
                    comm.element = null;
                } else {
                    temp.push(comm);
                }
            });
            self.pdfPages[sig.page].signatures = temp;
        });
    };

    PdfSignature.prototype.editSignature = function (evt) {
        const self = evt.data.msgTarget;
        const sig = evt.data.elmentTarget;
        $('#sign-visible-type-ed').val(self.settings.visibleType);
        $('#sign-visible-type-ed').unbind();
        $('#sign-visible-type-ed').change(function () {
            self.settings.visibleType = parseInt($(this).val());
            self.changeSignatureVisibleType();
        });
        $('#sign-page-ed').val(self.currentPage);
        $('#sign-font-color-ed').find('.esign-color').unbind();
        $('#sign-font-color-ed').find('.esign-color').click(function () {
            $('#sign-font-color-ed').find('.esign-color').removeClass('active');
            $(this).addClass('active');
            let color = $(this).data('color');
            self.settings.fontColor = color.replace('#', '');
            self.setFontColor();
        });
        $("#sign-font-color-ed").find('.esign-color').removeClass('active');
        $("#sign-font-color-ed").find(`[data-color='#${self.settings.fontColor}']`).addClass('active');

        let editSignatureModal = document.getElementById('edit-signature-modal');
        editSignatureModal.style.display = "block";
        $('#edit-signature-modal').find('#com-add').click(function () {
            self.editSignatureConfirm(sig);
        });
        $('#edit-signature-modal').find('#com-close').click(function () {
            $("#edit-signature-modal").find('#com-add').off("click");
            editSignatureModal.style.display = "none";
        });

        $('#signature-img-btn').unbind();
        $('#signature-img-btn').click({ msgTarget: self }, self.changeSignatureImageEvent);



        let _esignUpload = function () {
            let mode = {
                mode: 'upload',
                penSize: 1,
                penStyle: $('.esign-color.active').data('color')
            };
            $('#esign-template-canvas-ed').wPaint('clearRect');
            $('#esign-template-canvas-ed').wPaint('setMode', mode);

            $('#esign-upload-ed').unbind();
            $('#esign-upload-ed').change(function (event) {
                let file = event.target.files[0];
                let fileReader = new FileReader();
                fileReader.onload = function () {
                    let img = {
                        img: this.result,
                        ctx: '',
                        resize: true,
                        undo: true,
                    };
                    $('#esign-template-canvas-ed').wPaint('setImageNew', img);
                };
                if (file && file.size > 0) {
                    fileReader.readAsDataURL(file);
                }
            });
        };


        $('<div id="esign-template-canvas-ed"></div>').appendTo($('#esign-sign-template-ed'));
        $('#esign-template-canvas-ed').wPaint({
            menuOffsetLeft: 0,
            menuOffsetTop: -50,
            lineWidth: '2',
            ratio: 1,
            path: '/Content/wPaint-master/',
            theme: 'standard classic',
            strokeStyle: 'FF0000',
            mode: 'pencil',
            onTextUp: function (e) {
                self.settings.signatureImg = this.getImage(false).replace('data:image/png;base64,', '');
                self.changeSignatureVisibleImg();
            },
            onShapeUp: function (e) {
                self.settings.signatureImg = this.getImage(false).replace('data:image/png;base64,', '');
                self.changeSignatureVisibleImg();
            },
            onSetImg: function (e) {
                self.settings.signatureImg = this.getImage(false).replace('data:image/png;base64,', '');
                self.changeSignatureVisibleImg();
            },
            name: 'sign-template-ed'
        });
        _esignUpload();
        let d = {
            arrayPoints: [],
            undoArrayPoints: []
        };
        $('#esign-template-canvas-ed').wPaint('setwPaintState', d);

        let img = {
            img: self.settings.signatureImg,
            ctx: '',
            resize: true,
            undo: true,
        };
        $('#esign-template-canvas-ed').wPaint('setImageNew', img);
    }

    PdfSignature.prototype.editSignatureConfirm = async function (sig) {
        let p = $('#sign-page-ed').val();
        let self = this;
        if (!p) {
            self.showAlert('error', 'Notice!', 'Trang đặt chữ ký không hợp lệ', 5000);
            return;
        }
        let pInt = parseInt(p);
        if (!pInt) {
            self.showAlert('error', 'Notice!', 'Trang đặt chữ ký không hợp lệ', 5000);
            return;
        }

        if (pInt < 1 || pInt > self.totalPages) {
            self.showAlert('error', 'Notice!', 'Trang đặt chữ ký không hợp lệ', 5000);
            return;
        }

        let editSignatureModal = document.getElementById('edit-signature-modal');
        editSignatureModal.style.display = "none";
        self.pdfPages[self.currentPage].signatures.pop(sig);
        await this.changePagebyNumber(pInt);
        //if (!self.pdfPages[pInt].signatures) {
        //    self.pdfPages[pInt].signatures = [];
        //}
        self.pdfPages[pInt].signatures.push(sig);
        sig.page = pInt;
        self.initSignature(sig);
    }

    /**
     * 
     * @param {any} evt Add signature comment event
     */
    PdfSignature.prototype.addComment = function (evt) {
        $('#esign-comment-menu').css('display', 'none');
        $('#esign-comment-menu-btn').removeClass('toggled');
        let addCommentModal = document.getElementById('add-comment-modal');
        $('#add-comment-modal').find('#com-add').text('Thêm comment');
        const self = evt.data.msgTarget;
        $('#add-comment-modal').find('#com-add').unbind();
        $('#add-comment-modal').find('#com-add').click(function () {
            self.addCommentHandle();
        });
        $('#comment-type-color').find('.esign-color').unbind();
        $('#comment-type-color').find('.esign-color').click(function () {
            $('#comment-type-color').find('.esign-color').removeClass('active');
            $(this).addClass('active');
        });

        $('#add-comment-modal').find('#com-close').click(function () {
            $("#add-comment-modal").find('#com-add').off("click");
            addCommentModal.style.display = "none";
        });
        addCommentModal.style.display = "block";
        $('#com-font-size').asRange();
        $('#com-font-size').asRange('set', '13');

        const span = addCommentModal.getElementsByClassName("pdf-modal-close")[0];
        span.onclick = function () {
            $("#add-comment-modal").find('#com-add').off("click");
            addCommentModal.style.display = "none";
        };
    };

    PdfSignature.prototype.createSignature = function (evt) {
        const self = evt.data.msgTarget;
        let modal = document.getElementById('create-signature-modal');
        $('#create-signature-modal').find('.pdf-modal-close').unbind();
        $('#create-signature-modal').find('.pdf-modal-close').click(function () {
            $('#create-signature-modal').css('display', 'none');
            $('#esign-template-canvas').wPaint('destroy');
            $('#esign-template-canvas').remove();
            $('#esign-sign-temp-type-input').val('');
            self.changePage();
        });

        $('#create-signature-modal').find('#com-close').unbind();
        $('#create-signature-modal').find('#com-close').click(function () {
            $('#create-signature-modal').css('display', 'none');
            $('#esign-template-canvas').wPaint('destroy');
            $('#esign-template-canvas').remove();
            $('#esign-sign-temp-type-input').val('');
            self.changePage();
        });
        modal.style.display = `block`;
        $('.esign-page-popup').hide();
        $('.esign-btn-flat').removeClass('toggled');

        let barOuter = document.querySelector(".esign-bar-outer");
        barOuter.className = "esign-bar-outer";
        let options = document.querySelectorAll(".esign-bar-grey .esign-option");
        $('.esign-bar-grey .esign-option').unbind();
        let current = 1;
        options.forEach((option, i) => option.index = i + 1);
        options.forEach(option => {
            option.addEventListener("click", function () {
                barOuter.className = "esign-bar-outer";
                barOuter.classList.add(`pos${option.index}`);
                if (option.index > current) {
                    barOuter.classList.add("esign-right");
                } else if (option.index < current) {
                    barOuter.classList.add("esign-left");
                }
                current = option.index;
                switch (current) {
                    case 1:
                        _esignType();
                        break;
                    case 2:
                        _esignDraw();
                        break;
                    case 3:
                        _esignUpload();
                        break;
                }
            });
        });

        let _esignType = function () {
            $('.esign-create-sign-content').hide();
            $('#esign-create-sign-type').css('display', 'flex');
            $('#esign-create-sign-color').css('display', 'flex');
            $('#esign-create-sign-color').find('#clear').hide();
            let mode = {
                mode: 'text',
                penSize: 1,
                penStyle: $('.esign-color.active').data('color')
            };
            $('#esign-template-canvas').wPaint('clearRect');
            $('#esign-template-canvas').wPaint('setMode', mode);
            $('#esign-template-canvas').wPaint('drawText', $('#esign-sign-temp-type-input').val());
        };

        let _esignDraw = function () {
            $('.esign-create-sign-content').hide();
            $('#esign-create-sign-color').find('#clear').show();
            $('#esign-create-sign-draw').css('display', 'flex');
            $('#esign-create-sign-color').css('display', 'flex');
            let mode = {
                mode: 'pencil',
                penSize: 1,
                penStyle: $('.esign-color.active').data('color')
            };
            $('#esign-template-canvas').wPaint('clearRect');
            $('#esign-template-canvas').wPaint('setMode', mode);

            $('#esign-create-sign-color').find('#clear').unbind();
            $('#esign-create-sign-color').find('#clear').click(function () {
                $('#esign-template-canvas').wPaint('clear');
                self.settings.signTemplate.img = null;
                self.settings.signTemplate.wPaintPoints = [];
                self.settings.signTemplate.wPaintUndoPoints = [];
            });

            if (self.settings.signTemplate.wPaintPoints && self.settings.signTemplate.wPaintPoints.length > 0) {
                let d = {
                    arrayPoints: self.settings.signTemplate.wPaintPoints,
                    undoArrayPoints: self.settings.signTemplate.wPaintUndoPoints
                };
                $('#esign-template-canvas').wPaint('setwPaintState', d);
            }
        };

        let _esignUpload = function () {
            $('.esign-create-sign-content').hide();
            $('#esign-create-sign-upload').show();
            let mode = {
                mode: 'upload',
                penSize: 1,
                penStyle: $('.esign-color.active').data('color')
            };
            $('#esign-template-canvas').wPaint('clearRect');
            $('#esign-template-canvas').wPaint('setMode', mode);

            $('#esign-upload').unbind();
            $('#esign-upload').change(function (event) {
                let file = event.target.files[0];
                let fileReader = new FileReader();
                fileReader.onload = function () {
                    let img = {
                        img: this.result,
                        ctx: '',
                        resize: true,
                        undo: true,
                    };
                    $('#esign-template-canvas').wPaint('setImageNew', img);
                };
                if (file && file.size > 0) {
                    fileReader.readAsDataURL(file);
                }
            });
        };

        $('<div id="esign-template-canvas"></div>').appendTo($('#esign-sign-template'));
        $('#create-signature-modal').find('#esign-sign-temp-type-input').unbind();
        $('#create-signature-modal').find('#esign-sign-temp-type-input').keyup(function () {
            $('#esign-template-canvas').wPaint('drawText', $(this).val());
        });

        $('#esign-template-canvas').wPaint({
            menuOffsetLeft: 0,
            menuOffsetTop: -50,
            lineWidth: '2',
            ratio: 1,
            path: '/Content/wPaint-master/',
            theme: 'standard classic',
            strokeStyle: 'FF0000',
            mode: 'pencil',
            onTextUp: function (e) {
                self.settings.signTemplate.img = this.getImage(false).replace('data:image/png;base64,', '');
            },
            onShapeUp: function (e) {
                self.settings.signTemplate.img = this.getImage(false).replace('data:image/png;base64,', '');
                $('#esign-template-canvas').wPaint('getwPaintState', function (points, undoPoints, mode) {
                    self.settings.signTemplate.wPaintPoints = points;
                    self.settings.signTemplate.wPaintUndoPoints = undoPoints;
                });
            },
            onSetImg: function (e) {
                self.settings.signTemplate.img = this.getImage(false).replace('data:image/png;base64,', '');
            },
            name: 'sign-template'
        });

        $('.esign-color').unbind();
        $('.esign-color').click(function () {
            $('.esign-color').removeClass('active');
            $(this).addClass('active');
            $('#esign-template-canvas').wPaint('setStrokeStyle', $(this).data('color'));
            $('#esign-template-canvas').wPaint('drawText', $('#esign-sign-temp-type-input').val());
        });


        $('.template-sign-type').unbind();
        $('.template-sign-type').click(function () {
            $('.template-sign-type').removeClass('active');
            $(this).addClass('active');
            $('#esign-template-canvas').wPaint('drawText', $('#esign-sign-temp-type-input').val());
        });

        _esignType();

        let d = {
            arrayPoints: [],
            undoArrayPoints: []
        };
        $('#esign-template-canvas').wPaint('setwPaintState', d);
        $('#esign-create-sign-temp').unbind();
        $('#esign-create-sign-temp').click(function () {
            if (self.settings.signTemplate.img) {
                let x = {
                    key: uuidv4(),
                    img: self.settings.signTemplate.img
                };
                self.settings.signatureImgs.push(x);
                if (self.settings.onCreateSignatureImg) {
                    self.settings.onCreateSignatureImg(x);
                }
                self.settings.signatureImg = x.img;
                self.changeSignatureVisibleImg();
                //self.addSignature();
                self.showAlert('info', 'Notice!', 'Ảnh chữ ký đã được thêm vào danh sách', 5000);
            }
            $('#create-signature-modal').css('display', 'none');
            $('#esign-template-canvas').wPaint('destroy');
            $('#esign-template-canvas').remove();
            $('#esign-sign-temp-type-input').val('');
            self.changePage();
        });
    };

    let uuidv4 = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    PdfSignature.prototype.addCommentHandle = function () {
        const self = this;
        const text = $('#comment-text').val();
        if ('' === text) {
            this.showAlert('warning', 'Warning!', 'Nội dung comment không được để trống.', 5000);
            return;
        }

        const pageHeight = Math.ceil(self.pdfPages[self.currentPage].pdfContent.getViewport({ scale: 1 }).height);
        const pageWidth = Math.ceil(self.pdfPages[self.currentPage].pdfContent.getViewport({ scale: 1 }).width);
        const dpi = document.getElementById('dpi').offsetWidth;

        let color = $('#comment-type-color').find('.esign-color.active').data('color');
        let comm = {
            x: Math.floor(pageWidth / 2 / dpi * 72),
            y: pageHeight - Math.ceil(pageHeight / 2 / dpi * 72),
            width: 200,
            height: 50,
            page: self.currentPage,
            text: text,
            fontColor: color,
            fontSize: $('#com-font-size').asRange('get'),
            fontName: $('#com-font-name').val(),
            fontStyle: $('#com-font-style').val()
        };

        self.settings.comments.push(comm);
        self.initComment(comm, true);
        $('#comment-text').val('');
        $("#add-comment-modal").find('#com-add').off("click");
        document.getElementById('add-comment-modal').style.display = "none";
        self.showAlert('info', 'Tips!', 'Kéo khung comment trên màn hình tới nơi anh/chị muốn comment', 5000);
    };

    /**
     * Window resize handle
     * */
    PdfSignature.prototype.windowResizeEventHandle = function () {
        if (!this.show) {
            return;
        }
        let self = this;
        self.changeBottomMenuPos();
        let ele = $('.pdf-working-area')[0];
        let curP = self.getCurrentPage(ele.scrollTop, ele.offsetHeight);
        $('#pdf-working-curent').val(curP);
        self.currentPage = curP;
        self.scroll = true;
        self.pageScroller.setValue(0, (self.currentPage - 1) / (self.totalPages - 1), true);
        $('#esign-page-scroller').find('.handle').text(self.currentPage);

        Object.keys(self.pdfPages).map(function (key, index) {
            let page = self.pdfPages[key];
            let comment = page.comment;
            let pdfPage = $('#pdfPage_container_' + page.index);
            if (page && page.comment && page.comment.element && !page.comment.wPaint) {
                let boundX = pdfPage[0].offsetLeft;
                let boundY = pdfPage[0].offsetTop;
                let pageHeight = Math.ceil(page.pdfContent.getViewport({ scale: 1 }).height);
                let pageWidth = Math.ceil(page.pdfContent.getViewport({ scale: 1 }).width);
                let dpi = document.getElementById('dpi').offsetWidth;

                let x = comment.x || 10;
                let y = comment.y || 10;
                let width = comment.width || pageWidth - 20;
                let height = comment.height || pageHeight - 20;
                comment.x = 10; comment.y = 10; comment.width = width; comment.height = height;

                let yPos = (pageHeight - y - height) * dpi / 72 + 9 - 4 + boundY;
                let xPos = boundX + 9 + Math.floor(x * dpi / 72);
                let h = Math.floor(height * dpi * self.settings.scale / 72);
                let w = Math.floor(width * dpi * self.settings.scale / 72);
                comment.element.css({ 'top': yPos, 'left': xPos, 'height': h, 'width': w, 'position': 'absolute' });
            }
        });

        $.each(self.settings.comments, function (index, comment) {
            if (comment.page === self.currentPage) {
                let page = self.pdfPages[self.currentPage];
                let pdfPage = $('#pdfPage_container_' + self.currentPage);
                let boundX = pdfPage[0].offsetLeft;
                let boundY = pdfPage[0].offsetTop;
                let pageHeight = Math.ceil(page.pdfContent.getViewport({ scale: 1 }).height);
                let pageWidth = Math.ceil(page.pdfContent.getViewport({ scale: 1 }).width);
                let dpi = document.getElementById('dpi').offsetWidth;

                let x = comment.x;
                let y = comment.y;
                let width = comment.width;
                let height = comment.height;

                let yPos = (pageHeight - y - height) * self.settings.scale * dpi / 72 + 9 - 4 + boundY;
                let xPos = boundX + 9 + Math.floor(x * self.settings.scale * dpi / 72);
                let h = Math.floor(height * dpi * self.settings.scale / 72);
                let w = Math.floor(width * dpi * self.settings.scale / 72);
                comment.element.css({ 'top': yPos, 'left': xPos, 'height': h, 'width': w, 'position': 'absolute' });
            }
        });

        if (self.pdfPages[self.currentPage] && self.pdfPages[self.currentPage].signatures) {
            $.each(self.pdfPages[self.currentPage].signatures, function (index, comment) {
                if (comment.page === self.currentPage) {
                    let page = self.pdfPages[self.currentPage];
                    let pdfPage = $('#pdfPage_container_' + self.currentPage);
                    let boundX = pdfPage[0].offsetLeft;
                    let boundY = pdfPage[0].offsetTop;
                    let pageHeight = Math.ceil(page.pdfContent.getViewport({ scale: 1 }).height);
                    let pageWidth = Math.ceil(page.pdfContent.getViewport({ scale: 1 }).width);
                    let dpi = document.getElementById('dpi').offsetWidth;

                    let x = comment.x;
                    let y = comment.y;
                    let width = comment.width;
                    let height = comment.height;

                    let yPos = (pageHeight - y - height) * self.settings.scale * dpi / 72 + 9 - 4 + boundY;
                    let xPos = boundX + 9 + Math.floor(x * self.settings.scale * dpi / 72);
                    let h = Math.floor(height * dpi * self.settings.scale / 72);
                    let w = Math.floor(width * dpi * self.settings.scale / 72);
                    comment.element.css({ 'top': yPos, 'left': xPos, 'height': h, 'width': w, 'position': 'absolute' });
                }
            });
        }
    };

    /**
     * 
     * @param {any} evt Final function
     */
    PdfSignature.prototype.complete = function (evt) {
        const self = evt.data.msgTarget;
        //Object.keys(self.pdfPages).map(function (key, index) {
        //    if (self.pdfPages[key].comment.element) {
        //        self.pdfPages[key].comment.element.wPaint('getCommentBg', function (img) {
        //            self.pdfPages[key].comment.background = img.replace('data:image/png;base64,', '');
        //        });
        //    }
        //});

        //self.clear();
        //self.wrapper.empty();
        self.commentsProcess(1, self.onConfirm);
    };

    /**
     * clear
     * */
    PdfSignature.prototype.clear = function () {
        let self = this;
        $('.pdf-working-area').unbind();
        $('.pdf-working-area').off();

        $('.pdf-working-area').unbind();
        $('.pdf-working-area').off();
        window.removeEventListener('wheel');
        $('.pdf-working-area').unbind('scroll');

        window.removeEventListener("orientationchange", self.windowResizeEventHandle.bind(self));
        $(window).unbind("resize");
        $(window).off("resize");

    };

    /**
     * 
     * @param {any} evt evt
     */
    PdfSignature.prototype.reject = function (evt) {
        let self = evt.data.msgTarget;
        if (self.settings.onReject) {
            self.settings.onReject();
        }
        //self.show = false;
        //self.wrapper.empty();
        //self.reset();
        //self = null;
    };

    /**
     * 
     * @param {any} ind ind
     * @param {any} callback callback
     */
    PdfSignature.prototype.commentsProcess = function (ind, callback) {
        let self = this;
        let x = Object.getOwnPropertyNames(self.pdfPages).length;
        if (ind > x) {
            if (callback) {
                callback(self.getPdfSignatureOptions());
                //self.showAlert('info', 'Notice!', 'Anh/chị đã đồng ý ký văn bản này, văn bản sẽ được chuyển xử lý.', 5000);
            }
        } else {
            let y = Object.getOwnPropertyNames(self.pdfPages)[ind - 1];
            let ccc = self.pdfPages[y].comment;
            if (self.pdfPages[y].comment.background) {
                self.trimCommentImg(self.pdfPages[y].comment).then(function (x) {
                    const dpi = document.getElementById('dpi').offsetWidth;

                    x.top = Math.ceil(x.top * 72 / dpi);
                    x.left = Math.ceil(x.left * 72 / dpi);
                    x.right = Math.floor(x.right * 72 / dpi);
                    x.bottom = Math.floor(x.bottom * 72 / dpi);
                    self.pdfPages[y].comment.trimX = self.pdfPages[y].comment.x + x.left;
                    self.pdfPages[y].comment.trimY = self.pdfPages[y].comment.y + self.pdfPages[y].comment.height - x.bottom;
                    self.pdfPages[y].comment.trimWidth = x.right - x.left;
                    self.pdfPages[y].comment.trimHeight = x.bottom - x.top;
                    if (x.img) {
                        self.pdfPages[y].comment.trimBackground = x.img.replace('data:image/png;base64,', '');
                    }
                    //else {
                    //    self.pdfPages[y].comment.element = null;
                    //}
                    ind++;
                    self.commentsProcess(ind, callback);
                });
            } else {
                ind++;
                self.commentsProcess(ind, callback);
            }
        }
    };

    PdfSignature.prototype.trimCommentImg = function (comment) {
        var deferred = new $.Deferred();
        if (!comment.background) {
            let x = {
                left: 0,
                right: 0,
                bottom: 0,
                top: 0,
                img: ''
            };
            deferred.resolve(x);
            return deferred.promise();
        }
        let self = this;
        let trimCanvas = document.createElement('canvas');
        let ctx = trimCanvas.getContext('2d');

        let image = new Image();
        image.src = "data:image/png;base64," + comment.background;
        image.onload = function () {
            trimCanvas.width = image.width / comment.scale;
            trimCanvas.height = image.height / comment.scale;
            ctx.drawImage(image, 0, 0, trimCanvas.width, trimCanvas.height);
            let x = self.trimCanvas(trimCanvas);
            if (x.img) {
                x.img = x.img.toDataURL();
            }
            deferred.resolve(x);
        };

        return deferred.promise();
    };

    /**
     * @return {any} json object
     * */
    PdfSignature.prototype.getPdfSignatureOptions = function () {
        let self = this;
        let comments = [];
        let signatures = [];

        let rect = "20,20,220,120";
        let page = 1;
        Object.keys(self.pdfPages).map(function (key, index) {
            let comment = self.pdfPages[key].comment;
            if (comment.background && comment.trimWidth > 0) {
                comments.push({
                    text: comment.text,
                    rectangle: "" + comment.trimX + "," + comment.trimY + "," + Math.floor(comment.trimX + comment.trimWidth) +
                        "," + Math.floor(comment.trimY + comment.trimHeight),
                    page: comment.page,
                    background: comment.trimBackground,
                    type: 1
                });
            }
            let signs = self.pdfPages[key].signatures;
            if (signs) {
                signs.forEach(function (sig) {
                    rect = "" + sig.x + "," + sig.y + "," + Math.floor(sig.x + sig.width) + "," + Math.floor(sig.y + sig.height);
                    page = sig.page;
                    signatures.push({
                        rectangle: rect,
                        page: sig.page
                    });
                });
            }
        });
        this.settings.comments.forEach(function (comment) {
            if (comment.width > 0) {
                comments.push({
                    text: comment.text,
                    rectangle: "" + comment.x + "," + comment.y + "," + Math.floor(comment.x + comment.width) + "," + Math.floor(comment.y + comment.height),
                    page: comment.page,
                    fontName: comment.fontName,
                    fontStyle: comment.fontStyle,
                    fontSize: comment.fontSize,
                    fontColor: comment.fontColor,
                    type: 2
                });
            }
        });

        //self.pdfPages = {};

        let color = this.settings.fontColor;
        if (!color) {
            color = "#000000";
        }
        if (!color.startsWith('#')) {
            color = '#' + color;
        }
        let res = {
            //fontName: this.settings.fontName,
            //fontSize: this.settings.fontSize,
            fontColor: color,
            //fontStyle: this.settings.fontStyle,
            imageSrc: this.settings.signatureImg,
            visibleType: this.settings.visibleType,
            rectangle: rect,
            page: page
            //comment: JSON.stringify(comments),
            //signatures: Base64.encode(JSON.stringify(signatures))
        };
        if (!this.settings.useDefaultText) {
            res = $.extend(true, { signatureText: this.settings.visibleText.replace(/\n/g, "\\n") }, res);
        }

        //self.reset();
        return res;
    };

    /**
     * 
     * @param {any} base64 base64 encoded
     * @return {any} byte array
     */
    PdfSignature.prototype.convertDataURIToBinary = function (base64) {
        var raw = window.atob(base64);
        var rawLength = raw.length;
        var array = new Uint8Array(new ArrayBuffer(rawLength));

        for (i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        return array;
    };


    PdfSignature.prototype.trimCanvas = function (c) {
        let trimCanvas = document.createElement('canvas');
        let ctx = c.getContext('2d'),
            copy = trimCanvas.getContext('2d'),
            pixels = ctx.getImageData(0, 0, c.width, c.height),
            l = pixels.data.length,
            i,
            bound = {
                top: null,
                left: null,
                right: null,
                bottom: null
            },
            x, y;
        // Iterate over every pixel to find the highest
        // and where it ends on every axis ()
        for (i = 0; i < l; i += 4) {
            if (pixels.data[i + 3] !== 0) {
                x = (i / 4) % c.width;
                y = ~~((i / 4) / c.width);

                if (bound.top === null) {
                    bound.top = y;
                }

                if (bound.left === null) {
                    bound.left = x;
                } else if (x < bound.left) {
                    bound.left = x;
                }

                if (bound.right === null) {
                    bound.right = x;
                } else if (bound.right < x) {
                    bound.right = x;
                }

                if (bound.bottom === null) {
                    bound.bottom = y;
                } else if (bound.bottom < y) {
                    bound.bottom = y;
                }
                //let j = i;
                //for (j = i; j < 10 * c.width; j+= 4) {
                //    pixels.data[j + 3] !== 0;
                //}
            }
        }

        // Calculate the height and width of the content
        var trimHeight = bound.bottom - bound.top,
            trimWidth = bound.right - bound.left;
        if (trimWidth > 0 && trimHeight > 0) {
            trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);
            copy.canvas.width = trimWidth;
            copy.canvas.height = trimHeight;
            copy.putImageData(trimmed, 0, 0);

            bound.img = copy.canvas;
        }
        trimCanvas.remove();
        // Return trimmed canvas
        return bound;
    };

    function confirmDialog(type, title, message, callback) {

        let modalClass = 'esign-modal-danger';
        $('#confirm-modal').removeClass();
        switch (type) {
            case 'danger':
                modalClass = 'esign-modal-danger';
                break;
            case 'primary':
                modalClass = 'esign-modal-primary';
                break;
            case 'info':
                modalClass = 'esign-modal-info';
                break;
            case 'success':
                modalClass = 'esign-modal-success';
                break;
        }
        $('#esign-confirm-modal').addClass('esign-modal');
        $('#esign-confirm-modal').addClass(modalClass);
        $('#esign-confirm-modal-title').text(title);
        $('#esign-confirm-modal-message').empty();
        $('#esign-confirm-modal-message').html(message);

        let $modal = document.getElementById("esign-confirm-modal");
        $modal.style.display = "block";

        $('#esign-modal-cancel').click(function () {
            $('#esign-modal-yes').unbind();
            $modal.style.display = "none";
        });

        $('#esign-modal-yes').click(function () {
            $modal.style.display = "none";
            $('#esign-modal-yes').click(function () { return false; });
            $('#esign-modal-yes').off('click');
            callback();
        });
    }

    // 
    $.fn[pluginName] = function (options) {
        var pdfSignature;
        if (!$.data(this, pluginName)) {
            pdfSignature = new PdfSignature(this, options);
            $.data(this, pluginName, pdfSignature);
        }
        return pdfSignature;
    };

    const _esignAlert = '<div class="esign-alert">' +
        '  <span class="esign-alert-closebtn">&times;</span>  ' +
        '  <strong class="esign-alert-title">Danger!</strong> <span class="esign-alert-msg">Indicates a dangerous or potentially negative action.</span>' +
        '</div>';

    const pdfWorkingArea =
        //'<div id="esign-page-scroller" style="height:200px;"></div>' +
        //'       <div class="esign-zoom-border"></div>' + 
        '       <div id="esign-page-zoomin" class="esign-zoom-btn esign-zoom-in esign-bottom-menu-btn">' +
        '           <div class="esign-bottom-menu-btn-icon esign-plus">' +
        '           </div>' +
        '       </div>' +
        '       <div class="esign-zoom-btn esign-zoom-text esign-bottom-menu-btn">' +
        '           <div id="esign-bottom-menu-text" class="esign-bottom-menu-btn-icon">50%' +
        '           </div>' +
        '       </div>' +
        '       <div id="esign-page-zoomout" class="esign-zoom-btn esign-zoom-out esign-bottom-menu-btn">' +
        '           <div class="esign-bottom-menu-btn-icon esign-minus">' +
        '           </div>' +
        '       </div>' +
        '   <div id="esign-page-scroller" class="dragdealer">' +
        '       <div class="handle red-bar">1</div>' +
        '   </div>' +

        '<div class="esign-pager-menu" style="position:fixed;"> ' +
        '<ul id="" class="esign-pager-nav esign-pager-nav-left">' +
        '<li><div id="pdf-prev-page" class="wPaint-menu-icon wPaint-menu-icon-name-prev" title="Previous page"><div class="wPaint-menu-icon-img"></div></div></li>' +
        '<li><div id="pdf-next-page" class="wPaint-menu-icon wPaint-menu-icon-name-next" title="Next page"><div class="wPaint-menu-icon-img"></div></div></li>' +
        '<li><div id="pdf-current-page-head" class="wPaint-menu-icon wPaint-menu-icon-name-curent-page" title="Curent page"><input id="pdf-working-curent" type="text" /></div></li>' +
        '<li><div id="pdf-current-page-head-devider" class="wPaint-menu-icon wPaint-menu-icon-name-curent-" style="width:100px;text-align:left;" title="Curent page">of 0</div></li>' +
        '</ul>' +

        '<ul id="" class="esign-pager-nav esign-pager-nav-right">' +
        '<li><div id="esign-page-setup-btn" class="wPaint-menu-icon wPaint-menu-icon-name-page-setup" title="Document information"><div class="wPaint-menu-icon-img"></div></div></li>' +
        '</ul>' +

        '<ul id="" class="esign-pager-nav esign-pager-nav-center">' +
        //'<li><div id="esign-signature-list-btn" class="esign-btn-flat" title="Danh sách chữ ký"><div class="esign-btn-flat-content">Chữ ký</div></div></li>' +
        //'<li><div id="esign-comment-menu-btn" class="esign-btn-flat" title="Thêm bút phê"><div class="esign-btn-flat-content">Bút phê</div></div></li>' +
        '</ul>' +

        '</div>' +

        '<div id="pdf-pager-menu-container">' +
        '   <button type="button" id="pdf-complete" class="esign-ripple">Đồng ý ký</button>' +
        '   <button type="button" id="pdf-cancel" class="esign-ripple esign-btn-default">Không đồng ý</button>' +
        '</div>' +


        '<div id="esign-bottom-menu" class="esign-bottom-menu esign-bottom-menu-sticky">' +
        '   <div class="esign-bottom-menu-content esign-bottom-left-menu wpaint-menu">' +
        '       <div id="esign-paint-undo" class="esign-bottom-menu-btn esign-tooltip esign-tooltip-top wPaint-menu-icon-name-undo">' +
        '           <div class="esign-bottom-menu-btn-icon esign-pencil-undo">' +
        '           </div>' +
        '           <span class="esign-tooltiptext">Undo</span>' +
        '       </div>' +
        '       <div id="esign-paint-clear" class="esign-bottom-menu-btn esign-tooltip esign-tooltip-top wPaint-menu-icon-name-clear">' +
        '           <div class="esign-bottom-menu-btn-icon esign-pencil-clear">' +
        '           </div>' +
        '           <span class="esign-tooltiptext">Clear</span>' +
        '       </div>' +
        '       <div id="esign-paint-redo" class="esign-bottom-menu-btn esign-tooltip esign-tooltip-top wPaint-menu-icon-name-redo">' +
        '           <div class="esign-bottom-menu-btn-icon esign-pencil-redo">' +
        '           </div>' +
        '           <span class="esign-tooltiptext">Redo</span>' +
        '       </div>' +
        '       <div id="esign-paint-more" class="esign-bottom-menu-btn">' +
        '           <div class="esign-bottom-menu-btn-icon esign-pencil-more">' +
        '           </div>' +
        '           <div class="esign-btn-content"></div>' +
        '<div id="esign-wpaint-more-menu">' +
        '   <div class="esign-separator esign-page-setup-separator" style="margin-top: 30px;"></div>' +
        '   <div id="esign-paint-mode-pencil" class="esign-wpaint-more-select wPaint-menu-icon-name-pencil active">' +
        '       <span>Bút phê</span>' +
        '   </div>' +
		
		'   <div class="esign-separator esign-page-setup-separator-separate"></div>' +
        '   <div id="esign-paint-mode-highlight" class="esign-wpaint-more-select wPaint-menu-icon-name-highlight">' +
        '       <span>Đánh dấu</span>' +
        '   </div>' +
        '   <div class="esign-separator esign-page-setup-separator"></div>' +
        '   <div>' +
        '       <table class="esign-doc-meta">' +
        '           <tr><td id="wpaint-color">' +
        '                   <span class="esign-color black" data-color="#000000"></span>' +
        '                   <span class="esign-color blue active" data-color="#0000FF"></span>' +
        '                   <span class="esign-color red" data-color="#FF0000"></span>' +
        '                   <span class="esign-color yellow" data-color="#FFFF00"></span>' +
        '                   <span class="esign-color green" data-color="#4fa12c"></span>' +
        '                   <span class="esign-color pink" data-color="#e91e63"></span>' +
        '               </td ></tr > ' +
        '       </table>' +
        '   </div>' +
        '</div > ' +
        '       </div>' +
        '   </div>' +
        '   <div class="esign-bottom-menu-content esign-bottom-center-menu">' +
        '       <div id="esign-paint-init" class="esign-bottom-menu-btn esign-tooltip esign-tooltip-top">' +
        '           <div class="esign-bottom-menu-btn-icon esign-pencil-init">' +
        '           </div>' +
        '           <span class="esign-tooltiptext">Bật chế độ bút phê</span>' +
        '       </div>' +
        '   </div>' +
        '</div>' +


        '<div id="esign-page-setup" class="esign-page-popup">' +
        '   <div class="esign-separator esign-page-setup-separator" style="margin-top: 30px;"></div>' +
        '   <div>' +
        '       <table class="esign-doc-meta">' +
        '           <tr><td class="esign-meta-t">Title:</td><td id="esign-doc-author">_</td></tr>' +
        '           <tr><td class="esign-meta-t">Author:</td><td id="esign-doc-author">_</td></tr>' +
        '           <tr><td class="esign-meta-t">Creator:</td><td id="esign-doc-creator">_</td></tr>' +
        '           <tr><td class="esign-meta-t">Creation date:</td><td id="esign-doc-creationdate">_</td></tr>' +
        '       </table>' +
        '   </div>' +
        '   <div class="esign-separator esign-page-setup-separator"></div>' +
        '   <div>' +
        '       <table class="esign-doc-meta">' +
        '           <tr><td class="esign-meta-t">PDF Producer:</td><td id="esign-doc-producer">_</td></tr>' +
        '           <tr><td class="esign-meta-t">PDF Version:</td><td id="esign-doc-version">_</td></tr>' +
        '           <tr><td class="esign-meta-t">Page Count:</td><td id="esign-doc-pages">_</td></tr>' +
        '       </table>' +
        '   </div>' +
        '   <div class="esign-separator esign-page-setup-separator"></div>' +
        '   <div>' +
        '       <table class="esign-doc-meta">' +
        `           <tr><td class="esign-meta-t">Product:</td><td id="esign-doc-">${$copyRight}</td></tr>` +
        `           <tr><td class="esign-meta-t">Version:</td><td id="esign-doc-">${$productVersion}</td></tr>` +
        '       </table>' +
        '   </div>' +
        '</div > ' +


        '<div id="esign-signature-list" class="esign-page-popup">' +
        '   <div id="esign-signature-list-content">' +
        '   </div>' +
        '   <div class="esign-separator esign-page-setup-separator"></div>' +
        '   <div style="width:200px;margin:0px auto;padding:10px 0px">' +
        '       <button type="button" id="esign-add-signature-btn" class="esign-ripple esign-btn-block">Thêm mẫu chữ ký</button>' +
        '   </div>' +
        //'   <div style="width:200px;margin:0px auto;padding:10px 0px">' +
        //'       <button type="button" id="esign-add-comment-draw-btn-same" class="esign-ripple esign-btn-block">Sử dụng bút/trỏ</button>' +
        //'   </div>' +
        '</div > ' +


        '<div id="esign-comment-menu" class="esign-page-popup">' +
        '   <div id="" style="text-align:center;padding: 10px 0px;">' +
        '       <button type="button" id="esign-add-comment-draw-btn" class="esign-ripple esign-btn-block">Sử dụng bút/trỏ</button>' +
        '   </div>' +
        '   <div id="" style="text-align:center;padding: 10px 0px;">' +
        '       <button type="button" id="esign-add-comment-type-btn" class="esign-ripple esign-btn-block">Nhập nội dung</button>' +
        '   </div>' +
        '</div > ' +


        '<div class="pdf-working-area">' +
        '    <div class="pdf-page">' +
        '    </div>' +

        '</div>';
    var _canvasPdf = '<canvas id="ID_VALUE" class="pdf-viewport"></canvas>';
    var _divPdf = '<div id="ID_VALUE" class="pdf-page-container"></div>';
    var _divPdfLoading = '<div class="esign-loader"></div>';

    const _menuSwitch =
        '<div class="page-aside-switch">' +
        '</div>';

    const _closeIcon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 348.333 348.334" style="enable-background:new 0 0 348.333 348.334;" xml:space="preserve" class=""><g><g>	<path d="M336.559,68.611L231.016,174.165l105.543,105.549c15.699,15.705,15.699,41.145,0,56.85   c-7.844,7.844-18.128,11.769-28.407,11.769c-10.296,0-20.581-3.919-28.419-11.769L174.167,231.003L68.609,336.563   c-7.843,7.844-18.128,11.769-28.416,11.769c-10.285,0-20.563-3.919-28.413-11.769c-15.699-15.698-15.699-41.139,0-56.85   l105.54-105.549L11.774,68.611c-15.699-15.699-15.699-41.145,0-56.844c15.696-15.687,41.127-15.687,56.829,0l105.563,105.554   L279.721,11.767c15.705-15.687,41.139-15.687,56.832,0C352.258,27.466,352.258,52.912,336.559,68.611z" data-original="#000000" class="active-path" data-old_color="#000000" fill="#FFFFFF"/></g></g> </svg>';

    const _signatureBox =
        '        <div id="signature_" class="signature-view font-style canvasPaint" style="z-index:+1;">' +
        '<div class="pdf-comment-remove-container">' +
        //'           <div class="pdf_signature_remove remove" id="signature_remove_"></div>' +
        '           <div class="pdf_signature_remove edit" style="right:-1px;" id="signature_edit_"></div>' +
        '</div>' +
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
        '            <div class="signature-img signaturebox-image-left-img">' +
        '            </div>' +
        '             </div > ' +
        '            <div class="sig-text">' +
        '                <span>Ky boi: Ten chu chung thu</span><br />' +
        '                <span>Ngay ky: 18/03/2019</span>' +
        '            </div>' +
        '        </div>';
    const _logoOnly =
        '                 <div id="" class="signaturebox">' +
        '        <div class="signature-img signaturebox-image-only">' +
        '        </div>' +
        '        </div>';
    const _textAndLogoTop =
        '    <div id="" class="signaturebox">' +
        '        <div class="signaturebox-image-top">' +
        '            <div class="signature-img signaturebox-image-top-img">' +
        '            </div>' +
        '        </div>' +
        '            <div class="sig-text" style="text-align:center;">' +
        '                <span>Ky boi: Ten chu chung thu</span><br />' +
        '                <span>Ngay ky: 18/03/2019</span>' +
        '            </div>' +
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
        '                    <div class="width-100">' +
        '                        <label>Nội dung hiển thị</label>' +
        '                        <textarea id="comment-text" class="form-control pdf-modal-input-text" type="text"></textarea><br>' +
        '                    </div>' +
        '                </div>' +
        '                <div class="pdf-modal-row">' +
        '                    <div class="width-60">' +
        '                        <label>Font chữ</label>' +
        '                        <select id="com-font-name" name="sign-visible-type" class="sign-visible-types" style="width:100%;">' +
        '                            <option value="Time">1. Times New Roman</option>' +
        '                            <option value="Roboto">2. Roboto Condensed</option>' +
        '                            <option value="Arial">3. Arial</option>' +
        '                        </select>' +
        '                    </div>' +
        '                    <div class="width-40">' +
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
        '                    <div class="width-60">' +
        '                        <label>Cỡ chữ</label>' +
        '                        <input id="com-font-size" class="example" type="range" min="5" max="15" name="points" step="1" />' +
        '                    </div>' +
        '                    <div class="width-40">' +
        '                        <label>Màu chữ</label></br>' +
        '                       <div id="comment-type-color">' +
        '                           <span class="esign-color black" data-color="#000000"></span>' +
        '                           <span class="esign-color blue active" data-color="#0000FF"></span>' +
        '                           <span class="esign-color red" data-color="#FF0000"></span>' +
        '                           <span class="esign-color yellow" data-color="#FFFF00"></span>' +
        '                           <span class="esign-color green" data-color="#4fa12c"></span>' +
        //'                           <span class="esign-color pink" data-color="#e91e63"></span>' +
        '                       </div>' +
        '                    </div>' +
        '                </div>' +
        '            </div>' +
        '            <div class="pdf-modal-footer">' +
        '                <button type="button" id="com-close" class="esign-ripple esign-btn-default" style="margin-right:10px;">Hủy</button>' +
        '                <button type="button" id="com-add" class="esign-ripple">Thêm comment</button>' +
        '            </div>' +
        '        </div>' +
        '    </div>';

    const _editSignatureModal =
        '<div id="edit-signature-modal" class="pdf-modal">' +
        '        <div class="pdf-modal-content pdf-modal-dialog">' +
        '            <div class="pdf-modal-header">' +
        '                <span class="pdf-modal-close">×</span>' +
        '                <h4>Thêm comment</h4>' +
        '            </div>' +
        '            <div class="pdf-modal-body">' +
        '                <div class="pdf-modal-row">' +
        '                    <div class="width-40">' +
        '                        <label>Trang hiển thị</label>' +
        '                        <input type="text" id="sign-page-ed" class="form-control pdf-modal-input-text"></input><br>' +
        '                    </div>' +
        '                    <div class="width-60">' +
        '                        <label>Kiểu hiển thị</label>' +
        '                        <select id="sign-visible-type-ed" name="sign-visible-type" class="font-style1 sign-visible-types" style="width:100%;height:32px;">' +
        '                            <option value="1" style="">Chỉ hiển thị mô tả</option>' +
        '                            <option value="2" style="">Hiển thị mô tả và hình ảnh bên trái</option>' +
        '                            <option value="3" style="">Chỉ hiển thị hình ảnh</option>' +
        '                            <option value="5" style="">Hiển thị mô tả và hình nền</option>' +
        '                        </select>' +
        '                    </div>' +
        '                </div>' +
        '                <div class="pdf-modal-row">' +
        '                    <div class="width-100">' +
        '                        <label>Màu chữ</label></br>' +
        '                       <div id="sign-font-color-ed">' +
        '                           <span class="esign-color black" data-color="#000000" style="width:26px;height:26px;"></span>' +
        '                           <span class="esign-color blue active" data-color="#0000FF" style="width:26px;height:26px;"></span>' +
        '                           <span class="esign-color red" data-color="#FF0000" style="width:26px;height:26px;"></span>' +
        '                           <span class="esign-color yellow" data-color="#FFFF00" style="width:26px;height:26px;"></span>' +
        '                           <span class="esign-color green" data-color="#4fa12c" style="width:26px;height:26px;"></span>' +
        '                       </div>' +
        '                    </div>' +
        '                </div>' +
        '                <div class="pdf-modal-row">' +
        '                    <div class="width-60">' +
        '                        <label>Hình nền</label></br>' +
        '                        <div id="esign-sign-template-ed"></div>' +
        '                            <div class="esign-button-wrapper" style="margin-left:10px;margin-top:10px;">' +
        '                                <span class="label">Upload File</span>' +
        '                                <input type="file" name="upload" id="esign-upload-ed" class="upload-box" placeholder="Upload File" accept="image/*">' +
        '                            </div>' +
        '                    </div>' +
        '                    <div class="width-40">' +
        '                    </div>' +
        '                </div>' +
        '            </div>' +
        '            <div class="pdf-modal-footer">' +
        '                <button type="button" id="com-add" class="esign-ripple">Đóng</button>' +
        '            </div>' +
        '        </div>' +
        '    </div>';

    const _createSignatureModal =
        '<div id="create-signature-modal" class="pdf-modal">' +
        '        <div class="pdf-modal-content pdf-modal-dialog">' +
        '            <div class="pdf-modal-header">' +
        '                <span class="pdf-modal-close" data-input="xxx">×</span>' +
        '                <h4>Thêm mẫu chữ ký</h4>' +
        '            </div>' +
        '            <div class="pdf-modal-body">' +
        '                <div class="pdf-modal-row">' +
        '                   <div class="esign-container">' +
        '                       <div class="esign-bar esign-bar-grey">' +
        '                           <div class="esign-option">TYPE</div>' +
        '                           <div class="esign-option">DRAW</div>' +
        '                           <div class="esign-option">UPLOAD</div>' +
        '                       </div>' +
        '                       <div class="esign-bar-outer">' +
        '                           <div class="esign-bar esign-bar-purple">' +
        '                               <div class="esign-option">TYPE</div>' +
        '                               <div class="esign-option">DRAW</div>' +
        '                               <div class="esign-option">UPLOAD</div>' +
        '                           </div>' +
        '                       </div>' +
        '                   </div>' +
        '                </div>' +
        '               <div id="esign-sign-template"></div>' +
        '                <div id="esign-create-sign-type" class="pdf-modal-row esign-create-sign-content">' +
        '                   <div style="width:100%;padding:0px 10px;"><input id="esign-sign-temp-type-input" type="text" placeholder="[Nhập nội dung chữ ký không dấu]" /></div>' +
        '                   <div class="template-sign-type" data-font="CassandraPersonalUseRegular" style="font-family: CassandraPersonalUseRegular;">Adam</div>' +
        '                   <div class="template-sign-type active" data-font="HousttelySignature" style="font-family: HousttelySignature;">Adam</div>' +
        '                   <div class="template-sign-type" data-font="Battalion" style="font-family: Battalion;">Adam</div>' +
        '                   <div class="template-sign-type" data-font="Tomatoes" style="font-family: Tomatoes;">Adam</div>' +
        '                   <div class="template-sign-type" data-font="Vegan" style="font-family: Vegan, \'Vegan\';">Adam</div>' +
        '                   <div class="template-sign-type" data-font="Daniels_Signature" style="font-family: Daniels_Signature;">Adam</div>' +
        '                </div>' +
        '                <div id="esign-create-sign-draw" class="pdf-modal-row esign-create-sign-content">' +
        '                </div>' +
        '                <div id="esign-create-sign-upload" class="pdf-modal-row esign-create-sign-content">' +
        '                   <div class="esign-button-wrapper">' +
        '                       <span class="label">Upload File</span>' +
        '                       <input type="file" name="upload" id="esign-upload" class="upload-box" placeholder="Upload File" accept="image/*">' +
        '                   </div>' +
        '                </div>' +
        '                <div id="esign-create-sign-color" class="pdf-modal-row esign-create-sign-content">' +
        '                   <span class="esign-color black" data-color="#000000"></span>' +
        '                   <span class="esign-color blue active" data-color="#0000FF"></span>' +
        '                   <span class="esign-color red" data-color="#FF0000"></span>' +
        '                   <button type="button" id="clear" class="esign-ripple" style="margin: -3px 0px 0px 10px;">Clear</button>' +
        '                </div>' +
        '            </div>' +
        '            <div class="pdf-modal-footer">' +
        '                <button type="button" id="com-close" class="esign-ripple esign-btn-default" style="margin-right:10px;">Hủy</button>' +
        '                <button type="button" id="esign-create-sign-temp" class="esign-ripple">Thêm chữ ký</button>' +
        '            </div>' +
        '        </div>' +
        '    </div>';

    const _confirmModal = '<div id="esign-confirm-modal" class="esign-modal esign-modal-primary">' +
        '  <div class="esign-modal-content">' +
        '    <div class="esign-modal-header">' +
        '      <span class="esign-modal-close">&times;</span>' +
        '      <h4 id="esign-confirm-modal-title">Xác nhận</h4>' +
        '    </div>' +
        '    <div class="esign-modal-body">' +
        '      <p id="esign-confirm-modal-message"></p>' +
        '    </div>' +
        '    <div class="pdf-modal-footer">' +
        '                <button type="button" id="esign-modal-cancel" class="esign-ripple esign-btn-default" style="margin-right:10px;">Hủy</button>' +
        '                <button type="button" id="esign-modal-yes" class="esign-ripple">Đồng ý</button>' +
        '    </div>' +
        '  </div>' +
        '</div>';


    const _comment = '<div id="comcom" class="pdf-comment">' +
        '<div class="pdf-comment-remove-container">' +
        '           <div class="pdf_signature_remove remove" id="signature_remove_"></div>' +
        '           <div class="pdf_signature_remove edit" id="signature_edit_"></div>' +
        '</div>' +
        '<span class="comment-text">COMMENT</span></div>';
    const _trashIcon = '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="trash-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-trash-alt fa-w-14 fa-2x"><path fill="currentColor" d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z" class=""></path></svg>';
    const _editIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -1 401.52289 401"class=""><g><path d="m370.589844 250.972656c-5.523438 0-10 4.476563-10 10v88.789063c-.019532 16.5625-13.4375 29.984375-30 30h-280.589844c-16.5625-.015625-29.980469-13.4375-30-30v-260.589844c.019531-16.558594 13.4375-29.980469 30-30h88.789062c5.523438 0 10-4.476563 10-10 0-5.519531-4.476562-10-10-10h-88.789062c-27.601562.03125-49.96875 22.398437-50 50v260.59375c.03125 27.601563 22.398438 49.96875 50 50h280.589844c27.601562-.03125 49.96875-22.398437 50-50v-88.792969c0-5.523437-4.476563-10-10-10zm0 0" data-original="#000000" class="active-path" data-old_color="#494949" fill="#464646"/><path d="m376.628906 13.441406c-17.574218-17.574218-46.066406-17.574218-63.640625 0l-178.40625 178.40625c-1.222656 1.222656-2.105469 2.738282-2.566406 4.402344l-23.460937 84.699219c-.964844 3.472656.015624 7.191406 2.5625 9.742187 2.550781 2.546875 6.269531 3.527344 9.742187 2.566406l84.699219-23.464843c1.664062-.460938 3.179687-1.34375 4.402344-2.566407l178.402343-178.410156c17.546875-17.585937 17.546875-46.054687 0-63.640625zm-220.257812 184.90625 146.011718-146.015625 47.089844 47.089844-146.015625 146.015625zm-9.40625 18.875 37.621094 37.625-52.039063 14.417969zm227.257812-142.546875-10.605468 10.605469-47.09375-47.09375 10.609374-10.605469c9.761719-9.761719 25.589844-9.761719 35.351563 0l11.738281 11.734375c9.746094 9.773438 9.746094 25.589844 0 35.359375zm0 0" data-original="#000000" class="active-path" data-old_color="#494949" fill="#464646"/></g> </svg>';
    const Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9+/=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/rn/g, "n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }
    return PdfSignature;

}));

// Dragdealer plugin
!function (a, b) { "function" == typeof define && define.amd ? define(b) : a.Dragdealer = b() }(this, function () { function j(a) { var b = "Webkit Moz ms O".split(" "), c = document.documentElement.style; if (void 0 !== c[a]) return a; a = a.charAt(0).toUpperCase() + a.substr(1); for (var d = 0; d < b.length; d++)if (void 0 !== c[b[d] + a]) return b[d] + a } function k(a) { i.backfaceVisibility && i.perspective && (a.style[i.perspective] = "1000px", a.style[i.backfaceVisibility] = "hidden") } var a = function (a, b) { this.options = this.applyDefaults(b || {}), this.bindMethods(), this.wrapper = this.getWrapperElement(a), this.wrapper && (this.handle = this.getHandleElement(this.wrapper, this.options.handleClass), this.handle && (this.init(), this.bindEventListeners())) }; a.prototype = { defaults: { disabled: !1, horizontal: !0, vertical: !1, slide: !0, steps: 0, snap: !1, loose: !1, speed: .1, xPrecision: 0, yPrecision: 0, handleClass: "handle", css3: !0, activeClass: "active", tapping: !0 }, init: function () { this.options.css3 && k(this.handle), this.value = { prev: [-1, -1], current: [this.options.x || 0, this.options.y || 0], target: [this.options.x || 0, this.options.y || 0] }, this.offset = { wrapper: [0, 0], mouse: [0, 0], prev: [-999999, -999999], current: [0, 0], target: [0, 0] }, this.change = [0, 0], this.stepRatios = this.calculateStepRatios(), this.activity = !1, this.dragging = !1, this.tapping = !1, this.reflow(), this.options.disabled && this.disable() }, applyDefaults: function (a) { for (var b in this.defaults) a.hasOwnProperty(b) || (a[b] = this.defaults[b]); return a }, getWrapperElement: function (a) { return "string" == typeof a ? document.getElementById(a) : a }, getHandleElement: function (a, b) { var c, d, e; if (a.getElementsByClassName) { if (c = a.getElementsByClassName(b), c.length > 0) return c[0] } else for (d = new RegExp("(^|\\s)" + b + "(\\s|$)"), c = a.getElementsByTagName("*"), e = 0; e < c.length; e++)if (d.test(c[e].className)) return c[e] }, calculateStepRatios: function () { var a = []; if (this.options.steps >= 1) for (var b = 0; b <= this.options.steps - 1; b++)a[b] = this.options.steps > 1 ? b / (this.options.steps - 1) : 0; return a }, setWrapperOffset: function () { this.offset.wrapper = h.get(this.wrapper) }, calculateBounds: function () { var a = { top: this.options.top || 0, bottom: -(this.options.bottom || 0) + this.wrapper.offsetHeight, left: this.options.left || 0, right: -(this.options.right || 0) + this.wrapper.offsetWidth }; return a.availWidth = a.right - a.left - this.handle.offsetWidth, a.availHeight = a.bottom - a.top - this.handle.offsetHeight, a }, calculateValuePrecision: function () { var a = this.options.xPrecision || Math.abs(this.bounds.availWidth), b = this.options.yPrecision || Math.abs(this.bounds.availHeight); return [a ? 1 / a : 0, b ? 1 / b : 0] }, bindMethods: function () { this.requestAnimationFrame = "function" == typeof this.options.customRequestAnimationFrame ? b(this.options.customRequestAnimationFrame, window) : b(m, window), this.cancelAnimationFrame = "function" == typeof this.options.customCancelAnimationFrame ? b(this.options.customCancelAnimationFrame, window) : b(n, window), this.animateWithRequestAnimationFrame = b(this.animateWithRequestAnimationFrame, this), this.animate = b(this.animate, this), this.onHandleMouseDown = b(this.onHandleMouseDown, this), this.onHandleTouchStart = b(this.onHandleTouchStart, this), this.onDocumentMouseMove = b(this.onDocumentMouseMove, this), this.onWrapperTouchMove = b(this.onWrapperTouchMove, this), this.onWrapperMouseDown = b(this.onWrapperMouseDown, this), this.onWrapperTouchStart = b(this.onWrapperTouchStart, this), this.onDocumentMouseUp = b(this.onDocumentMouseUp, this), this.onDocumentTouchEnd = b(this.onDocumentTouchEnd, this), this.onHandleClick = b(this.onHandleClick, this), this.onWindowResize = b(this.onWindowResize, this) }, bindEventListeners: function () { c(this.handle, "mousedown", this.onHandleMouseDown), c(this.handle, "touchstart", this.onHandleTouchStart), c(document, "mousemove", this.onDocumentMouseMove), c(this.wrapper, "touchmove", this.onWrapperTouchMove), c(this.wrapper, "mousedown", this.onWrapperMouseDown), c(this.wrapper, "touchstart", this.onWrapperTouchStart), c(document, "mouseup", this.onDocumentMouseUp), c(document, "touchend", this.onDocumentTouchEnd), c(this.handle, "click", this.onHandleClick), c(window, "resize", this.onWindowResize), this.animate(!1, !0), this.interval = this.requestAnimationFrame(this.animateWithRequestAnimationFrame) }, unbindEventListeners: function () { d(this.handle, "mousedown", this.onHandleMouseDown), d(this.handle, "touchstart", this.onHandleTouchStart), d(document, "mousemove", this.onDocumentMouseMove), d(this.wrapper, "touchmove", this.onWrapperTouchMove), d(this.wrapper, "mousedown", this.onWrapperMouseDown), d(this.wrapper, "touchstart", this.onWrapperTouchStart), d(document, "mouseup", this.onDocumentMouseUp), d(document, "touchend", this.onDocumentTouchEnd), d(this.handle, "click", this.onHandleClick), d(window, "resize", this.onWindowResize), this.cancelAnimationFrame(this.interval) }, onHandleMouseDown: function (a) { g.refresh(a), e(a), f(a), this.activity = !1, this.startDrag() }, onHandleTouchStart: function (a) { g.refresh(a), f(a), this.activity = !1, this.startDrag() }, onDocumentMouseMove: function (a) { g.refresh(a), this.dragging && (this.activity = !0, e(a)) }, onWrapperTouchMove: function (a) { return g.refresh(a), !this.activity && this.draggingOnDisabledAxis() ? (this.dragging && this.stopDrag(), void 0) : (e(a), this.activity = !0, void 0) }, onWrapperMouseDown: function (a) { g.refresh(a), e(a), this.startTap() }, onWrapperTouchStart: function (a) { g.refresh(a), e(a), this.startTap() }, onDocumentMouseUp: function () { this.stopDrag(), this.stopTap() }, onDocumentTouchEnd: function () { this.stopDrag(), this.stopTap() }, onHandleClick: function (a) { this.activity && (e(a), f(a)) }, onWindowResize: function () { this.reflow() }, enable: function () { this.disabled = !1, this.handle.className = this.handle.className.replace(/\s?disabled/g, "") }, disable: function () { this.disabled = !0, this.handle.className += " disabled" }, reflow: function () { this.setWrapperOffset(), this.bounds = this.calculateBounds(), this.valuePrecision = this.calculateValuePrecision(), this.updateOffsetFromValue() }, getStep: function () { return [this.getStepNumber(this.value.target[0]), this.getStepNumber(this.value.target[1])] }, getValue: function () { return this.value.target }, setStep: function (a, b, c) { this.setValue(this.options.steps && a > 1 ? (a - 1) / (this.options.steps - 1) : 0, this.options.steps && b > 1 ? (b - 1) / (this.options.steps - 1) : 0, c) }, setValue: function (a, b, c) { this.setTargetValue([a, b || 0]), c && (this.groupCopy(this.value.current, this.value.target), this.updateOffsetFromValue(), this.callAnimationCallback()) }, startTap: function () { !this.disabled && this.options.tapping && (this.tapping = !0, this.setWrapperOffset(), this.setTargetValueByOffset([g.x - this.offset.wrapper[0] - this.handle.offsetWidth / 2, g.y - this.offset.wrapper[1] - this.handle.offsetHeight / 2])) }, stopTap: function () { !this.disabled && this.tapping && (this.tapping = !1, this.setTargetValue(this.value.current)) }, startDrag: function () { this.disabled || (this.dragging = !0, this.setWrapperOffset(), this.offset.mouse = [g.x - h.get(this.handle)[0], g.y - h.get(this.handle)[1]], this.wrapper.className.match(this.options.activeClass) || (this.wrapper.className += " " + this.options.activeClass), this.callDragStartCallback()) }, stopDrag: function () { if (!this.disabled && this.dragging) { this.dragging = !1; var a = this.groupClone(this.value.current); if (this.options.slide) { var b = this.change; a[0] += 4 * b[0], a[1] += 4 * b[1] } this.setTargetValue(a), this.wrapper.className = this.wrapper.className.replace(" " + this.options.activeClass, ""), this.callDragStopCallback() } }, callAnimationCallback: function () { var a = this.value.current; this.options.snap && this.options.steps > 1 && (a = this.getClosestSteps(a)), this.groupCompare(a, this.value.prev) || ("function" == typeof this.options.animationCallback && this.options.animationCallback.call(this, a[0], a[1]), this.groupCopy(this.value.prev, a)) }, callTargetCallback: function () { "function" == typeof this.options.callback && this.options.callback.call(this, this.value.target[0], this.value.target[1]) }, callDragStartCallback: function () { "function" == typeof this.options.dragStartCallback && this.options.dragStartCallback.call(this, this.value.target[0], this.value.target[1]) }, callDragStopCallback: function () { "function" == typeof this.options.dragStopCallback && this.options.dragStopCallback.call(this, this.value.target[0], this.value.target[1]) }, animateWithRequestAnimationFrame: function (a) { a ? (this.timeOffset = this.timeStamp ? a - this.timeStamp : 0, this.timeStamp = a) : this.timeOffset = 25, this.animate(), this.interval = this.requestAnimationFrame(this.animateWithRequestAnimationFrame) }, animate: function (a, b) { if (!a || this.dragging) { if (this.dragging) { var c = this.groupClone(this.value.target), d = [g.x - this.offset.wrapper[0] - this.offset.mouse[0], g.y - this.offset.wrapper[1] - this.offset.mouse[1]]; this.setTargetValueByOffset(d, this.options.loose), this.change = [this.value.target[0] - c[0], this.value.target[1] - c[1]] } (this.dragging || b) && this.groupCopy(this.value.current, this.value.target), (this.dragging || this.glide() || b) && (this.updateOffsetFromValue(), this.callAnimationCallback()) } }, glide: function () { var a = [this.value.target[0] - this.value.current[0], this.value.target[1] - this.value.current[1]]; return a[0] || a[1] ? (Math.abs(a[0]) > this.valuePrecision[0] || Math.abs(a[1]) > this.valuePrecision[1] ? (this.value.current[0] += a[0] * Math.min(this.options.speed * this.timeOffset / 25, 1), this.value.current[1] += a[1] * Math.min(this.options.speed * this.timeOffset / 25, 1)) : this.groupCopy(this.value.current, this.value.target), !0) : !1 }, updateOffsetFromValue: function () { this.offset.current = this.options.snap ? this.getOffsetsByRatios(this.getClosestSteps(this.value.current)) : this.getOffsetsByRatios(this.value.current), this.groupCompare(this.offset.current, this.offset.prev) || (this.renderHandlePosition(), this.groupCopy(this.offset.prev, this.offset.current)) }, renderHandlePosition: function () { var a = ""; return this.options.css3 && i.transform ? (this.options.horizontal && (a += "translateX(" + this.offset.current[0] + "px)"), this.options.vertical && (a += " translateY(" + this.offset.current[1] + "px)"), this.handle.style[i.transform] = a, void 0) : (this.options.horizontal && (this.handle.style.left = this.offset.current[0] + "px"), this.options.vertical && (this.handle.style.top = this.offset.current[1] + "px"), void 0) }, setTargetValue: function (a, b) { var c = b ? this.getLooseValue(a) : this.getProperValue(a); this.groupCopy(this.value.target, c), this.offset.target = this.getOffsetsByRatios(c), this.callTargetCallback() }, setTargetValueByOffset: function (a, b) { var c = this.getRatiosByOffsets(a), d = b ? this.getLooseValue(c) : this.getProperValue(c); this.groupCopy(this.value.target, d), this.offset.target = this.getOffsetsByRatios(d) }, getLooseValue: function (a) { var b = this.getProperValue(a); return [b[0] + (a[0] - b[0]) / 4, b[1] + (a[1] - b[1]) / 4] }, getProperValue: function (a) { var b = this.groupClone(a); return b[0] = Math.max(b[0], 0), b[1] = Math.max(b[1], 0), b[0] = Math.min(b[0], 1), b[1] = Math.min(b[1], 1), (!this.dragging && !this.tapping || this.options.snap) && this.options.steps > 1 && (b = this.getClosestSteps(b)), b }, getRatiosByOffsets: function (a) { return [this.getRatioByOffset(a[0], this.bounds.availWidth, this.bounds.left), this.getRatioByOffset(a[1], this.bounds.availHeight, this.bounds.top)] }, getRatioByOffset: function (a, b, c) { return b ? (a - c) / b : 0 }, getOffsetsByRatios: function (a) { return [this.getOffsetByRatio(a[0], this.bounds.availWidth, this.bounds.left), this.getOffsetByRatio(a[1], this.bounds.availHeight, this.bounds.top)] }, getOffsetByRatio: function (a, b, c) { return Math.round(a * b) + c }, getStepNumber: function (a) { return this.getClosestStep(a) * (this.options.steps - 1) + 1 }, getClosestSteps: function (a) { return [this.getClosestStep(a[0]), this.getClosestStep(a[1])] }, getClosestStep: function (a) { for (var b = 0, c = 1, d = 0; d <= this.options.steps - 1; d++)Math.abs(this.stepRatios[d] - a) < c && (c = Math.abs(this.stepRatios[d] - a), b = d); return this.stepRatios[b] }, groupCompare: function (a, b) { return a[0] == b[0] && a[1] == b[1] }, groupCopy: function (a, b) { a[0] = b[0], a[1] = b[1] }, groupClone: function (a) { return [a[0], a[1]] }, draggingOnDisabledAxis: function () { return !this.options.horizontal && g.xDiff > g.yDiff || !this.options.vertical && g.yDiff > g.xDiff } }; for (var b = function (a, b) { return function () { return a.apply(b, arguments) } }, c = function (a, b, c) { a.addEventListener ? a.addEventListener(b, c, !1) : a.attachEvent && a.attachEvent("on" + b, c) }, d = function (a, b, c) { a.removeEventListener ? a.removeEventListener(b, c, !1) : a.detachEvent && a.detachEvent("on" + b, c) }, e = function (a) { a || (a = window.event), a.preventDefault && a.preventDefault(), a.returnValue = !1 }, f = function (a) { a || (a = window.event), a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0 }, g = { x: 0, y: 0, xDiff: 0, yDiff: 0, refresh: function (a) { a || (a = window.event), "mousemove" == a.type ? this.set(a) : a.touches && this.set(a.touches[0]) }, set: function (a) { var b = this.x, c = this.y; a.clientX || a.clientY ? (this.x = a.clientX, this.y = a.clientY) : (a.pageX || a.pageY) && (this.x = a.pageX - document.body.scrollLeft - document.documentElement.scrollLeft, this.y = a.pageY - document.body.scrollTop - document.documentElement.scrollTop), this.xDiff = Math.abs(this.x - b), this.yDiff = Math.abs(this.y - c) } }, h = { get: function (a) { var b = { left: 0, top: 0 }; return void 0 !== a.getBoundingClientRect && (b = a.getBoundingClientRect()), [b.left, b.top] } }, i = { transform: j("transform"), perspective: j("perspective"), backfaceVisibility: j("backfaceVisibility") }, l = ["webkit", "moz"], m = window.requestAnimationFrame, n = window.cancelAnimationFrame, o = 0; o < l.length && !m; ++o)m = window[l[o] + "RequestAnimationFrame"], n = window[l[o] + "CancelAnimationFrame"] || window[l[o] + "CancelRequestAnimationFrame"]; return m || (m = function (a) { return setTimeout(a, 25) }, n = clearTimeout), a });
