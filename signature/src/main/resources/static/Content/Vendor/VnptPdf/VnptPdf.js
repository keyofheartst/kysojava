/*
 * 
*/
SignatureVisibleType = {
    ONLY_TEXT: 1,
    BOTH: 2,
    ONLY_IMAGE: 3
};


var _defaultImage = "iVBORw0KGgoAAAANSUhEUgAAAQMAAAFHCAYAAAClGCmxAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTExIDc5LjE1ODMyNSwgMjAxNS8wOS8xMC0wMToxMDoyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpiOTI4NTMyZS0yZThjLTRhNDAtYTZmNC03M2IxYmFmNjI1YTQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDVCRDkwQjY0NDY2MTFFNzk5NjM5RUI1NTQwMEEzREYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDVCRDkwQjU0NDY2MTFFNzk5NjM5RUI1NTQwMEEzREYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzRlNjcwY2MtZWU0My0xNjRhLWExNjQtYTc4MWZhYmY4ODE4IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOmI5Mjg1MzJlLTJlOGMtNGE0MC1hNmY0LTczYjFiYWY2MjVhNCIv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";

var _imagePrefix = "data:image/png;base64,";
var _pageWidth = 0;
var _pageHeight = 0;
var _pdf = null;
var _numOfPages = 0;
var _signBox;
var _pdfPage;
var _signImage;
var _signText;
var _posX, _posY, _signWidth, _signHeigth;

var _dataChanged = false;

var _completeBtnCallBack = null;

var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9+/=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/rn/g, "n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }

var VnptPdf = (function (plugin) {
    var _options = new PdfOptions();
    _options.x = 0;
    _options.y = 0;
    _options.width = 250;
    _options.height = 60;

    /*
    */
    plugin.initPlugin = function () {
        $('body').append(pdfWorkingArea);
        $('#pdf-complete').click(function () {
            $('.pdf-working-area').hide();
            _completeBtnCallBack();
        });
        $('#pdf-cancel').click(function () {
            $('.pdf-working-area').hide();
        });
    };

    /**
     *
     * @param {any} file unsigned file
     * @param {any} callBack callback function when advanced sign pressed
     */
    plugin.initData = function (file, callBack) {
        if (_options.imageSrc === null || _options.imageSrc === '') {
            _options.imageSrc = _defaultImage;
        }
        _completeBtnCallBack = callBack;

        //Step 2: Read the file using file reader
        var fileReader = new FileReader();

        fileReader.onload = function () {

            //Step 4:turn array buffer into typed array
            var typedarray = new Uint8Array(this.result);

            //Step 5:PDFJS should be able to read this
            PDFJS.getDocument(typedarray).then(function (pdf) {
                _pdf = pdf;
                _numOfPage = pdf.numPages;
                $('#pdf-total-pages').text(" of " + pdf.numPages);

                pdf.getPage(1).then(function (page) {
                    _options.page = 1;
                });
            });

            // Listener when click change page
            changePageListener();
            // Complete button press listener
            advancedSign();
            // Change image listener
            changeImageListener();
            //
            _dataChanged = true;
            // 
            $('#add-comment-btn').click(function () {
                _addComment();
            });
        };
        //Step 3:Read the file as ArrayBuffer
        fileReader.readAsArrayBuffer(file);
    };

    /**
     *
     * @param {any} file unsigned file
     * @param {any} callBack callback function when advanced sign pressed
     * @param {any} option PdfOption
     */
    plugin.initDataWithOption = function (file, callBack, option) {
        if (option === null) {
            _options.width = 250;
            _options.height = 60;
        } else {
            _options = option;
        }
        if (_options.width === 0) {
            _options.widdth = 250;
        }
        if (_options.height === 0) {
            _options.height = 60;
        }
        this.initData(file, callBack);
    };

    /**
     *
     * @param {any} base64 unsigned data in base64 format
     * @param {any} callBack callback function when advanced sign pressed
     */
    plugin.initDataBase64 = function (base64, callBack) {
        if (_options.imageSrc === null || _options.imageSrc === '') {
            _options.imageSrc = _defaultImage;
        }
        _completeBtnCallBack = callBack;

        var typedarray = convertDataURIToBinary(base64);

        PDFJS.getDocument(typedarray).then(function (pdf) {
            _pdf = pdf;
            _numOfPage = pdf.numPages;
            $('#pdf-total-pages').text(" of " + pdf.numPages);

            pdf.getPage(1).then(function (page) {
                _options.page = 1;
            });
        });

        // Listener when click change page
        changePageListener();
        // Complete button press listener
        advancedSign();
        // Change image listener
        changeImageListener();

        //
        _dataChanged = true;
        // 
        $('#add-comment-btn').click(function () {
            _addComment();
        });
    };

    /**
     * 
     * @param {any} base64 unsigned data in base64 format
     * @param {any} callBack callback function when advanced sign pressed
     * @param {any} option PdfOption
     */
    plugin.initDataBase64WithOption = function (base64, callBack, option) {
        if (option === null) {
            _options.width = 250;
            _options.height = 60;
        } else {
            _options = option;
        }
        if (_options.width === 0) {
            _options.width = 250;
        }
        if (_options.height === 0) {
            _options.height = 60;
        }
        this.initDataBase64(base64, callBack);
    };

    /*
        
    */
    plugin.start = function () {
        if (!_dataChanged) {
            $('.pdf-working-area').show();
        } else {
            _dataChanged = false;
            // Reload view page
            _pdf.getPage(_options.page).then(function (page) {
                handlePage(page);
            });
        }
    }

    /*
        Trả về PDF signature options
    */
    plugin.getPdfOptions = function () {
        _options.rectangle = "" + _options.x + "," + _options.y + "," + (_options.x + _options.width) + "," + (_options.y + _options.height);
        _options.comment = "";
        var coms = [];
        for (var i = 0; i < _options.comments.length; i++) {
            _options.comments[i].rectangle = "" + _options.comments[i].x + "," + _options.comments[i].y
                + "," + (_options.comments[i].x + _options.comments[i].width) + "," + (_options.comments[i].y + _options.comments[i].height);

            _options.comment += _options.comments[i].text + ";" + _options.comments[i].rectangle + ";" + _options.comments[i].page + "-";
            var c = new Comment();
            c.text = Base64.encode(_options.comments[i].text);
            c.rectangle = _options.comments[i].rectangle;
            c.page = _options.comments[i].page;
            coms.push(c);
        }
        _options.comment = _options.comment.slice(0, -1);
        var comStr = JSON.stringify(coms);
        _options.comment = Base64.encode(JSON.stringify(_options.comments));

        console.log(_options.comment);
        return _options;
    }

    function Comment() {
        this.text = "";
        this.rectangle = "";
        this.page = 1;
    }


    /*
        Convert base64 to byte array
    */
    function convertDataURIToBinary(base64) {
        var raw = window.atob(base64);
        var rawLength = raw.length;
        var array = new Uint8Array(new ArrayBuffer(rawLength));

        for (i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        return array;
    }

    /*
        Xử lý khi click Ký dữ liệu
    */
    function advancedSign() {
    }

    /*
        Xử lý hiển thị pdf page + signature box
    */
    function handlePage(page) {
        //We need to pass it a scale for "getViewport" to work
        var scale = 1;

        var xview = page.getViewport(1);
        _pageWidth = Math.floor(xview.width);
        _pageHeight = Math.floor(xview.height);
        console.log("width=" + _pageWidth + ". height=" + _pageHeight);

        //Grab the viewport with original scale
        // Pdf using 72 units per inch, while your screen dpi difference ex 96dpi ->>
        var viewport = page.getViewport(1 / 72 * getDpi());

        var canvas = document.getElementById('dropHere');
        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;



        // Render PDF page into canvas context.
        var renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        page.render(renderContext);

        initSignatureVisible();
        signaturePositionChangeListener();
    }

    function signaturePositionChangeListener() {
        $('.sign-pos').bind("cut copy paste drag drop", function (e) {
            e.preventDefault();
        });

    }

    /*
        Lấy độ phân giải màn hình
    */
    function getDpi() {
        return document.getElementById('dpi').offsetWidth;
    }

    /*
    */
    function initSignatureVisible() {
        _signBox = $('#dragThis');
        _pdfPage = $('#dropHere');
        _signImage = $('#signature-img');
        _signText = $('#signature-text');

        _pdfPage.show();
        $('.pdf-working-area').show();

        var boundX = _pdfPage[0].offsetLeft;
        var boundY = _pdfPage[0].offsetTop;

        //21 = 15 * getDpi() / 72;

        if (_options.x === 0) {
            _options.x = 15;
        }

        if (_options.y === 0) {
            _options.y = _pageHeight - 15 - _options.height;
        } 

        var yPos = Math.floor((_pageHeight - _options.y - _options.height) * getDpi() / 72) + 9 - 4 + boundY;
        var xPost = boundX + 9 + Math.floor(_options.x * getDpi() / 72);
        var h = Math.floor(_options.height * getDpi() / 72);
        _signBox.css({ 'top': yPos, 'left': xPost, 'height':h, 'position': 'absolute' });
        $('#signature-img').attr('src', "data:image/png;base64," + _options.imageSrc);

        $('#signbox-xpos').val(_options.x);
        $('#signbox-ypos').val(_options.y);
        $('#signbox-width').val(_options.width);
        $('#signbox-height').val(_options.height);

        setupSignatureBox();


        changeVisibleType();
    }

    function _addComment() {
        var suf = _options.comments.length;
        var currentId = "#comment" + suf;
        var text = $('#comment-text').val();
        if (text === '') {
            alert("Chưa nhập nội dung comment.");
            return;
        }
        var page = $('#comment-text-page').val();
        if (isNaN(page) || page < 1 || page > _numOfPage) {
            alert("Trang thêm comment không hợp lệ. (Số trang từ 1 đến " + _numOfPage + ")");
            return;
        }

        //$('#pdf-comments').append("<input type=\"text\" id=\"comment-text-" + suf + "\" value=\"" + text + "\" \/><br \/>");
        var tr = "<tr><td>" + (suf + 1) + ".</td><td><span class=\"pdf-size-lbl\">Nội dung</span></td><td><input id=\"comment-text-" + suf + "\" class=\"sign-pos\" type=\"text\" value=\"" + text + "\" /></td > <td><span class=\"pdf-size-lbl\">Page </span></td> <td><input id=\"comment-text-page-" + suf + "\" class=\"sign-pos\" value=\"" + page + "\" type=\"text\" /></td></tr >";
        $('#pdf-comments-table').append(tr);
        $('#comment-text-' + suf).keyup(function () {
            myFunction(suf);
        });
        $('.pdf-page').append("<div id=\"comment" + suf + "\" class=\"pdf-comment\"><span id=\"comment-val-" + suf + "\">" + text + "<\/span><\/div>");
        $('#comment-text').val('');
        var comment = new CommentOption();
        comment.text = text;
        comment.page = page;
        _options.comments.push(comment);
        setupCommentBox(suf, currentId);
    }

    function _addDefaultComment(text, page) {
        var suf = _options.comments.length;
        var currentId = "#comment" + suf;
        var tr = "<tr><td>" + (suf + 1) + ".</td><td><span class=\"pdf-size-lbl\">Nội dung</span></td><td><input id=\"comment-text-" + suf + "\" class=\"sign-pos\" type=\"text\" value=\"" + text + "\" /></td > <td><span class=\"pdf-size-lbl\">Page </span></td> <td><input id=\"comment-text-page-" + suf + "\" class=\"sign-pos\" value=\"" + page + "\" type=\"text\" /></td></tr >";
        $('#pdf-comments-table').append(tr);
        $('#comment-text-' + suf).keyup(function () {
            myFunction(suf);
        });
        $('.pdf-page').append("<div id=\"comment" + suf + "\" class=\"pdf-comment\"><span id=\"comment-val-" + suf + "\">" + text + "<\/span><\/div>");
        var comment = new CommentOption();
        comment.text = text;
        comment.page = page;
        _options.comments.push(comment);
        setupCommentBox(suf, currentId);
    }

    function myFunction(index) {
        var text = $('#comment-text-' + index).val();
        _options.comments[index].text = text;
        $('#comment-val-' + index).text(text);
    }

    /*
        Initial signature box with dragable, resiable
    */
    function setupSignatureBox() {
        _signBox
            .draggable({
                containment: $('#dropHere'),
                drag: function () {
                    var boundX = _pdfPage[0].offsetLeft;
                    var boundY = _pdfPage[0].offsetTop;
                    var top = _signBox[0].offsetTop;
                    var left = _signBox[0].offsetLeft;
                    var offset = $(this).offset();
                    var xPos = Math.floor((left - boundX - 9) / getDpi() * 72);
                    _options.x = xPos;

                    var h = Math.floor(_signBox[0].offsetHeight / getDpi() * 72);
                    var yPos = _pageHeight - Math.floor((top - boundY - 9) / getDpi() * 72) - h;
                    _options.y = yPos;
                    $('#signbox-xpos').val(xPos);
                    $('#signbox-ypos').val(yPos);
                },
                stop: function () {
                    var boundX = _pdfPage.offset().left;
                    var boundY = _pdfPage.offset().top;
                    var finalOffset = $(this).offset();
                    var finalxPos = finalOffset.left;
                    var finalyPos = finalOffset.top;
                }
            })
            .resizable({
                resize: function (event, ui) {
                    _changeSignBoxSize($(this));
                },
                stop: function (event, ui) {
                    _changeSignBoxSize($(this));
                }
            });

        $('#dropHere').droppable({
            accept: '#dragThis',
            over: function () {
                $('#dragThis').draggable('option', 'containment', $(this));
            }
        });

        // Xử lý sự kiện resize windows làm page viewport thay đổi theo
        window.addEventListener('resize', function () {
            var boundX = _pdfPage[0].offsetLeft;
            var boundY = _pdfPage[0].offsetTop;
            var h = Math.floor(_signBox[0].offsetHeight / getDpi() * 72);

            var left = boundX + _options.x * getDpi() / 72;
            var top = (_pageHeight - h - _options.y) * getDpi() / 72 + boundY;
            _signBox.css({ "left": left, "top": top });
        });
    }

    function setupCommentBox(index, elem) {
        var com = $(elem);
        var boundX = _pdfPage[0].offsetLeft;
        var boundY = _pdfPage[0].offsetTop;

        var xPos = boundX + 21;
        var yPos = _pageHeight - 15 - 250;

        var l = com[0].offsetLeft;

        _options.comments[index].x = 9;
        _options.comments[index].y = 450;
        _options.comments[index].width = 120;
        _options.comments[index].height = 20;
        com.css({ 'top': yPos, 'left': xPos, 'position': 'absolute' });
        com
            .draggable({
                containment: $('#dropHere'),
                drag: function () {
                    var boundX = _pdfPage[0].offsetLeft;
                    var boundY = _pdfPage[0].offsetTop;
                    var top = com[0].offsetTop;
                    var left = com[0].offsetLeft;
                    var offset = $(this).offset();
                    var xPos = Math.floor((left - boundX) / getDpi() * 72);
                    _options.comments[index].x = xPos - 6;

                    var h = Math.floor(com[0].offsetHeight / getDpi() * 72);
                    var yPos = _pageHeight - Math.floor((top - boundY) / getDpi() * 72) - h + 6;
                    _options.comments[index].y = yPos;
                },
                stop: function () {
                    var boundX = _pdfPage.offset().left;
                    var boundY = _pdfPage.offset().top;
                    var finalOffset = $(this).offset();
                    var finalxPos = finalOffset.left;
                    var finalyPos = finalOffset.top;
                }
            })
            .resizable({
                resize: function (event, ui) {
                    _changeCommentBoxSize(index, $(this));
                },
                stop: function (event, ui) {
                    _changeCommentBoxSize(index, $(this));
                }
            });

        $('#dropHere').droppable({
            accept: elem,
            over: function () {
                com.draggable('option', 'containment', $(this));
            }
        });

    }

    /*
        Initial signature box with dragable, resiable
    */
    function _changeSignBoxSize(box) {
        var w = Math.floor(box[0].offsetWidth / getDpi() * 72);
        var h = Math.floor(box[0].offsetHeight / getDpi() * 72);

        //Change _options value
        _options.width = w;
        _options.height = h;

        // Set value on input field
        $('#signbox-width').val(w);
        $('#signbox-height').val(h);
    }

    function _changeCommentBoxSize(index, box) {
        var w = Math.floor(box[0].offsetWidth / getDpi() * 72);
        var h = Math.floor(box[0].offsetHeight / getDpi() * 72);

        //Change _options value
        _options.comments[index].width = w;
        _options.comments[index].height = h;
    }

    /**
     * Change signature visible type 
     */
    function changeVisibleType() {
        var signTypeObj = $('input[type=radio][name=sign-visible-type]');
        signTypeObj.change(function () {
            var type = $(this).val();
            switch (type) {
                case '1':
                    // Signature visible text only
                    signatureVisibleTextOnly();
                    break;
                case '2':
                    // Signature visible both text and image
                    signatureVisibleBoth();
                    break;
                default:
                    // Signature visible image only
                    signatureVisibleImageOnly();
                    break;
            }
        });
    }

    /*
        Initial signature box with dragable, resiable
    */
    function signatureVisibleTextOnly() {
        _options.visibleType = SignatureVisibleType.ONLY_TEXT;
        _signImage.hide();
        _signText.removeAttr('style');
        _signText.css({ 'width': '100%' });
    }

    /*
        Initial signature box with dragable, resiable
    */
    function signatureVisibleBoth() {
        _options.visibleType = SignatureVisibleType.BOTH;
        _signImage.removeAttr('style');
        _signText.removeAttr('style');
        _signText.css({ 'width': '50%' });
    }

    /*
        Initial signature box with dragable, resiable
    */
    function signatureVisibleImageOnly() {
        _options.visibleType = SignatureVisibleType.ONLY_IMAGE;
        _signText.hide()
        _signImage.removeAttr('style');
        _signImage.css({ 'margin': '0px auto', 'float': 'unset', 'width': '100%' });
        _signImage.show();
    }

    /*
        Change signature page
    */
    function changePageListener() {
        $('#pdf-sign-page-btn').click(function () {
            var p = Number($('#pdf-sign-page').val());
            if (isNaN(p) || p < 1 || p > _numOfPage) {
                alert("Trang đặt chữ ký không hợp lệ. (Số trang từ 1 đến " + _numOfPage + ")");
                return;
            }
            _options.page = p;

            // Reload view page
            _pdf.getPage(_options.page).then(function (page) {
                handlePage(page);
            });
        });
        $('#pdf-sign-font-btn').click(function () {
            var z = Number($('#pdf-sign-font').val());
            if (isNaN(z) || z < 1 || z > 20) {
                alert("Cỡ chữ không hợp lệ. (Cỡ chữ hợp lệ từ 1 đến 20)");
                return;
            }
            _options.fontSize = z;

            var fontSizeView = Math.floor(z * getDpi() / 72);
            var fz = "" + fontSizeView + "px";
            var lineheight = "" + (fontSizeView + 1) + "px";
            $('#signature-text span').css({ 'font-size': fz, 'line-height': lineheight });
        });
    }

    /*
        Change signature image
    */
    function changeImageListener() {
        $(document).on(
            'change',
            '#pdf-sign-image-file :file',
            function (event) {
                if (!$(this).get(0).files) {
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
                    _options.imageSrc = this.result.replace(prefix, "");

                    $('#signature-img').attr('src', this.result);




                });
                if (f) {
                    reader.readAsDataURL(f);
                }
            });
    }


    /**
     * Pdf signature comments
     * */
    function CommentOption() {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.page = 1;
        this.rectangle = "";
        this.page = 1;
    }

    return plugin;

}(VnptPdf || {}));
/*
*/
function PdfOptions() {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.page = 1;
    this.fontSize = 8;
    this.imageSrc = "";
    this.rectangle = "";
    this.visibleType = SignatureVisibleType.BOTH;
    this.comments = [];
    this.comment = "";
}

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
    '                    <input type="radio" name="sign-visible-type" value="2" checked> Hiển thị text và hình ảnh<br />' +
    '                    <input type="radio" name="sign-visible-type" value="3"> Chỉ hiển thị hình ảnh<br />' +
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
    '        <canvas id="dropHere" class="pdf-viewport"></canvas>' +
    '        <div id="dragThis">' +
    '            <div id="signature-img-box">' +
    '                <img id="signature-img" src="" />' +
    '            </div>' +
    '            <div id="signature-text">' +
    '                <span>Ký bởi: Tên chủ chứng thư</span>' +
    '                <br />' +
    '                <span>Thời gian ký: dd/MM/yyyy</span>' +
    '            </div>' +
    '        </div>' +
    '    </div>' +
    '</div>';


