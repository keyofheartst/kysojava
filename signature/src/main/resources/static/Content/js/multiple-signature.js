$(document).ready(function () {
    signBegin();
    signatureMultiple();
    $('.nav-sign').removeClass('active');
    $('.nav-sign-multiple').addClass('active');
})

var _files;
var _items;
var _allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/xml',
    'text/plain',
    'application/pdf'
];
var _actionBtns = '<button class="btn btn-online red-600 cancel-file" id=""><i class="icon wb-trash" aria-hidden="true" data-toggle="tooltip" data-placement="top" data-original-title="H?y ch?n t?p"></i></button>' +
    '';

function signatureMultiple() {
    $('#multiple-file').change(function () {
        $("#divFiles").empty();
        $('#btnUpload').show();
        $('#divFiles').html('');
        var myvar = '<tr>' +
            '   <td>STT</td>' +
            '   <td>NAME</td>' +
            '   <td>SIZE</td>' +
            "   <td class='action' id='ACTION_ID'>TYPE</td>" +
            '</tr>';
        _files = this.files;
        _items = [];
        for (var i = 0; i < _files.length; i++) {
            _items.push(true);
        }
        for (i = 0; i < this.files.length; i++) {
            var fileId = i + 1;
            var row = myvar.replace('STT', fileId);
            row = row.replace('NAME', this.files[i].name);
            row = row.replace('SIZE', filesize(this.files[i].size));
            row = row.replace('ACTION_ID', 'action_' + i);

            if (_allowedTypes.indexOf(this.files[i].type) < 0) {
                row = row.replace('TYPE', "<span>Định dạng không hỗ trợ</span>");
            } else {
                row = row.replace('TYPE', _actionBtns);
            }
            $("#divFiles").append(row);

        }
        $('.cancel-file').click(function () {
            var tr = $(this).closest('tr');
            var index = parseInt(tr.find('td:first').text()) - 1;
            _items[index] = false;
            tr.remove();
        })
    });
}

function signBegin() {
    $('#sign-signserver-multiple-btn').click(function () {
        if ((typeof _files) === 'undefined' || _files === null || _files.length < 1) {
            showMessage("Chọn tệp cần ký để tiếp tục", "error");
            return;
        }
        var check = false;
        for (var i = 0; i < _items.length; i++) {
            if (_items[i]) {
                check = true;
                break;
            }
        }
        if (!check) {
            showMessage("Chọn tệp cần ký để tiếp tục", "error");
            return;
        }
        //TODO: Check so luot ky truoc
        $('#signserver-cert').modal('show');
    });
}


function multipleSign(certId) {
    $('#signserver-cert-id').val(certId);
    $('#signserver-cert').modal('hide');

    for (var i = 0; i < _files.length; i++) {
        if (!_items[i]) {
            console.log('exgnore ' + i);
            continue;
        }
        var file = _files[i];
        var context = $('#action_' + i);

        if (_allowedTypes.indexOf(_files[i].type) < 0) {
            continue;
        }

        _readFileAsBase64(file, signSingleFile, context);
    }
}

function signSingleFile(file, fileBase64, context) {
    var dataIndex = fileBase64.indexOf("base64,") + 7;
    var dataBase64 = fileBase64.substr(dataIndex);
    console.log(dataBase64);
    console.log(context);

    var fileNameSplit = file.name.split(".");
    var extend = fileNameSplit[fileNameSplit.length - 1].toLowerCase();

    $.ajax({
        method: "POST",
        url: "/home/sign",
        data: {
            data: dataBase64,
            cert: $('#signserver-cert-id').val(),
            type: extend,
            name: file.name,
            size: filesize(file.size),
            contentType: file.type
        },
        async: true,
        beforeSend: function () {
            context.text('Đang ký dữ liệu trên hệ thống SignSevice...');
        }
    }).done(function (response) {
        if (response.ResponseCode === 1) {
            context.text('Ký dữ liệu thành công');
        }
        else {
            context.text("Ký dữ liệu thất bại. " + response.Message, "error");
        }
    });
}

/**
 * 
 * @param {any} file
 * @param {any} callBack
 */
function _readFileAsBase64(file, callBack, context) {
    reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (_file) {
        callBack(file, _file.target.result, context);
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}



