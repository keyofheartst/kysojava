function getTableTransaction(controlID, email, groupId, page, functionCallback) {
    var html = "Không có thông tin giao dịch";
    $.ajax({
        method: "POST",
        url: "/Transactions/GetTransactionByEmail",
        data: {
            userEmail: email,
            sortOrder: "",
            CurrentSort: "",
            page: page,
            groupId: groupId
        },
        async: true,
        beforeSend: function () {
            $(controlID).html("<img src='/Content/Vendor/images/preloader.gif' style='width:100%'/>");
        }
    }).done(function (response) {
        if (response !== undefined) {
            if (response.Items !== undefined && response.Items !== null) {
                if (response.Items.length > 0) {
                    html = "<table id='mailboxTable' class='table' data-plugin='animateList' data-animate='fade' data-child='tr'>" + "<tbody>";
                    for (var i = 0; i < response.Items.length; i++) {
                        var tran = response.Items[i];
                        var tranType = getTranTypeStyle(tran.TranType);
                        var fileName = "" + tran.FileName;
                        if (!fileName.endsWith(tran.FileExtension)) {
                            fileName += "." + tran.FileExtension;
                        }

                        html += "<tr id='mid_1' data-url='panel.tpl' data-toggle='slidePanel'>" +
                            "<td class='cell-60 tran-file-type responsive-hide'><img class='img-fluid' src='/Content/Images/document/" + tran.FileExtension + ".png" + "' alt='...'></td>" +
                            "<td class='cell-100'><span class='" + tranType + " tran-type-lbl'>" + tran.TranType + "</span></td>" +
                            "<td><div class='content'><div class='title'><span title='" + fileName + "'>" + fileName + "</span></div><div class='sub-title'>" + tran.FileSize + "<span class='divider'>|</span>" + tran.FileContentType + "</div>" + getTranStatusHTML(tran.TrangThai) + "</div></td>" +
                            "<td class='responsive-hide'><div class='abstract sub-title'>" + getTranDescription(tran) + "</div></td>" +
                            "<td class='cell-130 responsive-hide'><div class='time'>" + GetTimeStamp(ConvertJSONDate(tran.NgayGiaoDich)) + "</div><div class='identity " + getTranStatusClass(tran.TrangThai) + "'><i class='icon wb-large-point " + getTranStatusClass(tran.TrangThai) + "' aria-hidden='true'></i>" + getTranStatus(tran.TrangThai) + "</div></td>" +
                            "</tr>";
                    }
                    html += "</table>";
                    html += genarateTransactionPaging(response.PageCount, response.PageNumber, controlID, email, groupId); 
                }
            } else html = response;
        }
        else {
            // Donothing
        }
        $(controlID).html(html);
    }).fail(function (response) {
        debugger;
    });
}
function getFunctionTableTransaction(controlID, email, groupId, page) {
    return "getTableTransaction(\"" + controlID + "\",\"" + email + "\",\"" + groupId + "\", " + page + ")";
}
function genarateTransactionPaging(PageCount, PageNumber, controlID, email, groupId) {
    var html = "<div id='Paging' class='paging text-center'><ul class='pagination pagination-no-border'>";
    if (PageNumber == null) {
        PageNumber = 1;
    }
    var start = PageNumber - 2 > 0 ? PageNumber - 2 : 1;
    var end = start + 5 < PageCount ? start + 5 : PageCount;
    if (PageCount < 6) {
        start = 1;
        end = PageCount;
    }

    if (PageNumber > 1) {
        html += "<li>" +
            "<a class='btn btn-default hidden-sm-down' href='javascript:void(0)' onclick='" + getFunctionTableTransaction(controlID, email, groupId, 1) + "'>Trang đầu</a>" +
            "<a class='btn btn-default hidden-md-up' href='javascript:void(0)' onclick='" + getFunctionTableTransaction(controlID, email, groupId, 1) + "'><i class='fa fa-angle-double-left'></i></a>" +
            "</li>" +
            "<li class='page-item'>" +
            "<a class='page-link' href='javascript:void(0)' onclick='" + getFunctionTableTransaction(controlID, email, groupId, PageNumber - 1) + "' aria-label='Previous'>" +
            "<i class='icon wb-chevron-left-mini' aria-hidden='true'></i>" +
            "</a>" +
            "</li>";
        if (start > 1) {
            html += "<li class='more-items-dots'><strong style='padding-right: 10px;line-height: 40px;'>...</strong></li>";
        }
    }
    for (var i = start; i < end; i++) {
        if (i == PageNumber) {
            html += "<li class='active page-item'><a class='page-link disabled' href='javascript:void(0)'>" + i + " <span class='sr-only'>(current)</span></a></li>";
        }
        else {
            html += "<li class='page-item hidden-sm-down'><a class='page-link' href='javascript:void(0)' onclick='" + getFunctionTableTransaction(controlID, email, groupId, i) + "'>" + i + "</a></li>";
        }
    }
    if (PageNumber < PageCount) {
        if (end < PageCount) {
            html += "<li class='more-items-dots'><strong style='padding-left: 10px;line-height: 40px;'>...</strong></li>";
        }
        html += "<li class='page-item'><a class='page-link' href='javascript:void(0)' onclick='" + getFunctionTableTransaction(controlID, email, groupId, PageNumber + 1) + "' aria-label='Next'>" +
            "<i class='icon wb-chevron-right-mini' aria-hidden='true'></i>" +
            "</a> " +
            "</li> " +
            "<li> " +
            "<a class='btn btn-default hidden-sm-down' href='javascript:void(0)' onclick='" + getFunctionTableTransaction(controlID, email, groupId, PageCount) + "'> Trang cuối</a> " +
            "<a class='btn btn-default hidden-md-up' href='javascript:void(0)' onclick='" + getFunctionTableTransaction(controlID, email, groupId, PageCount) + "'> <i class='fa fa-angle-double-right'></i></a> " +
            "</li> ";
    }
    html += "</ul></div>";
    return html;
}
var SqlDataType = {
    TRANSACTION_COMPLETED: 1,
    TRANSACTION_WAIT: 2,
    TRANSACTION_CONFIRMED: 3,
    TRANSACTION_REJECTED: 4,
    TRANSACTION_VIEWED: 5
}
function getTranTypeStyle(txtTranType) {
    var tranType = "";
    if ("SIGN".indexOf(txtTranType) != -1) {
        tranType = "bg-green-600";
    }
    else if ("VERIFY".indexOf(txtTranType) != -1) {
        tranType = "bg-orange-500";
    }
    else if ("SIGNHASH".indexOf(txtTranType) != -1) {
        tranType = "bg-red-600";
    }
    else if ("SIGNHASHPLOT".indexOf(txtTranType) != -1) {
        tranType = "bg-red-900";
    }
    else {
        tranType = "bg-green-900";
    }
    return tranType;
}
function getTranStatusClass(TrangThai) {
    var str = "";
    switch (TrangThai) {
        case SqlDataType.TRANSACTION_CONFIRMED:
            str = "green-600"
            break;
        case SqlDataType.TRANSACTION_WAIT:
            str = "yellow-600"
            break;
        case SqlDataType.TRANSACTION_REJECTED:
            str = "red-600";
            break;
        case SqlDataType.TRANSACTION_VIEWED:
            str = "red-600";
            break;
    }
    return str;
}
function getTranStatusHTML(tran) {
    var html = "";
    if (tran != undefined && tran != null)
        switch (tran.TrangThai) {
            case SqlDataType.TRANSACTION_CONFIRMED:
                html = "<div class='sub-title green-600'>Đã chuyển tới đối tác: <strong>" + tran.ReceiverEmail + "</strong><span class='divider'>|</span>Đối tác đã ký xác nhận.</div>"
                break;
            case SqlDataType.TRANSACTION_WAIT:
                html = "<div class='sub-title yellow-600'>Đã chuyển tới đối tác: <strong>" + tran.ReceiverEmail + "</strong><span class='divider'>|</span>" + FormatJSONDateTime(tran.NgayChuyen, 'dd/MM/yyyy HH:mm:ss') + "</div>"
                break;
            case SqlDataType.TRANSACTION_REJECTED:
                html = "<div class='sub-title red-600'>Đã chuyển tới đối tác: <strong>" + tran.ReceiverEmail + "</strong><span class='divider'>|</span>Đối tác hủy xác nhận.</div>"
                break;
            case SqlDataType.TRANSACTION_VIEWED:
                html = "<div class='sub-title red-600'>Đã chuyển tới đối tác: <strong>" + tran.ReceiverEmail + "</strong><span class='divider'>|</span>Đối tác đã xem tài liệu.</div>"
                break;
        }
    return html;
}
function getTranDescription(tran) {
    var html = "";
    var messages = [];
    if (tran.MoTa != null) {
        messages = tran.MoTa.split(';');
    }
    html = "<ul>";
    for (var i = 0; i < messages.length; i++) {
        var mesg = messages[i];
        if (mesg != null && mesg != "") {
            var m = mesg.replace(tran.UserAccountEmail, 'Tôi');
            var mesgs = m.split('|');
            if (mesgs.length < 2) {
                html += "<li>" + mesg + "</li>";
            }
            else {
                html += "<li><b>" + mesgs[0] + ": </b><i>" + mesgs[1] + "</i></li>";
            }
        }
    }
    html += "</ul>";
    return html;
}
function getTranStatus(status) {
    switch (status) {
        case SqlDataType.TRANSACTION_COMPLETED:
            return "Hoàn thành";
        case SqlDataType.TRANSACTION_REJECTED:
            return "Đối tác từ chối";
        case SqlDataType.TRANSACTION_WAIT:
            return "Chờ xác nhận";
        case SqlDataType.TRANSACTION_CONFIRMED:
            return "Đã xác nhận";
        case SqlDataType.TRANSACTION_VIEWED:
            return "Đối tác đã xem";
    }
    return "Unknown";
}