var model = new function () {
    var self = this;

    self.pageSize = 10;
    self.items = null;

    self.paging_options = {
        bootstrapMajorVersion: 3,
        alignment: 'right',
        currentPage: 1,
        totalPages: 1,
        onPageChanged: function (event, oldPage, newPage) {
            self.loadMemberTrans(newPage, self.pageSize);
        }
    };

    self.search = function () {
        self.refresh();
    };

    self.clearSearch = function () {
        $('#tuKhoa').val('');
    };

    // lam moi danh sach
    self.refresh = function () {
        self.fetchData(self.paging_options.currentPage, self.pageSize);
    };

    /**
     * 
     * */
    self.report = function () {
        $('#fileupload').submit();
        $('#modalReport').modal('hide');
    };


    /**
     * Get group information
     */
    self.fetchData = function () {
    };

    /**
     * Load group transactions summary
     * */
    self.loadMembers = function () {
        self.query('/Account/LoadMembers', null,
            function () {
            },
            function (result) {
                if (result === "") {
                    window.location.replace("/Account/Login/?ReturnUrl=/Transactions/GroupIndex");
                }
                if (result.success === 1 && result.data !== null) {                    
                    var $el = $("#member-select");
                    $el.empty();
                    $el.append($("<option selected></option>")
                        .attr("value", "").text("Tất cả thành viên"));
                    $.each(result.data.content, function (index, item) {
                        $el.append($("<option></option>")
                            .attr("value", item.Email).text(item.HoTenDayDu));
                    });
                    $("#member-select").select2();
                    $('#member-select').on('change', function () {
                        self.loadMemberTrans();
                    });
                    self.loadMemberTrans();
                }
            }
        );
    };

    self.loadMemberTrans = function (pageIndex, pageSize) {
        let email = $('#member-select').val();
        if (!pageIndex || pageIndex <= 0) pageIndex = 1;
        if (!pageSize || pageSize <= 0) pageSize = self.pageSize;
        self.query("/Transactions/GetTransactionByEmail",
            {
                userEmail: email,
                page: pageIndex
            },
            function () {
                self.ShowLoading('#mem-trans-loader', 'Đang tải dữ liệu...');
            },
            function (result) {
                self.HideLoading('#mem-trans-loader');
                let memTranSource = $('#mem-trans-empty-template').html();
                if (result !== null && result.Count >= 0) {
                    $('#tran-complete').text(result.TotalItemCount);
                    memTranSource = $('#mem-trans-template').html();
                    self.setPaging(result.PageNumber, 10, result.TotalItemCount);
                }

                var template = Handlebars.compile(memTranSource);
                $('#mem-trans').html('').append(template({ items: result.Items, page: self.paging_options.currentPage, size: 10 }));
            }
        );
    };

    self.query = function (url, data, beforeSend, callback) {
        $.ajax({
            url: GenerateUrl(url),
            type: 'POST',
            data: data,
            beforeSend: function () {
                beforeSend();
            },
            success: function (result) {
                callback(result);
            },
            error: function (x, y, z) {
                if (y !== "abort")
                    showMessage('Lỗi: ' + z, 'error');
            }
        });
    };


    /**
     * 
     * @param {any} pageIndex pageIndex
     * @param {any} pageSize pageSize
     * @param {any} total total
     */
    self.setPaging = function (pageIndex, pageSize, total) {
        var max = pageIndex * pageSize;
        if (total < max) max = total;
        $("#paging_info").children(".max").html(max);
        $("#paging_info").children(".total").html(total);
        self.paging_options.currentPage = pageIndex;
        self.paging_options.totalPages = Math.ceil(total / pageSize);

        if (self.paging_options.totalPages > 0) {
            $("#paging").bootstrapPaginator(self.paging_options);
        } else {
            self.paging_options.currentPage = 1;
            self.paging_options.totalPages = 1;
            $("#paging").bootstrapPaginator(self.paging_options);
        }
        $('#paging').addClass('pagination-no-border');
        $('#paging li').addClass('page-item');
        $('#paging li a').addClass('page-link');
    };

    /**
     * 
     * @param {any} loader loader element
     * @param {any} message message to show
     */
    self.ShowLoading = function (loader, message) {
        if (message === '') {
            $(loader).find('.loader-message').hide();
        } else {
            $(loader).find('.loader-message').html(message);
        }

        $(loader).css('display', 'flex');
    };

    /**
     * 
     * @param {any} loader loader element
     */
    self.HideLoading = function (loader) {
        $(loader).css('display', 'none');
    };

    self.tranTypeBackgroup = function (value) {
        switch (value) {
            case 'SIGN':
                return 'bg-green-600';
            case 'VERIFY':
                return "bg-orange-500";
            case 'SIGNHASH':
                return "bg-red-500";
            case 'SIGNHASHPLOT':
                return 'bg-red-900';
            default:
                return "bg-red-500";
        }
    };
};

$(document).ready(function () {
    model.loadMembers();
    Handlebars.registerHelper("equals", function (string1, string2, options) {
        if (string1 === string2) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    /*
     * Helper: Trạng thái giao dịch background color
     */
    Handlebars.registerHelper('tranStatus', function (value) {
        switch (value) {
            case 1:
            case 3:
                return "bg-blue-600";
            case 2:
                return "bg-orange-500";
            case 4:
            case 5:
            default:
                return "bg-red-500";
        }
    });

    /*
     * Helper: Trạng thái giao dịch background color
     */
    Handlebars.registerHelper('tranTypeBackground', function (value) {
        return model.tranTypeBackgroup(value);
    });

    Handlebars.registerHelper('tranDate', function (date) {
        let formattedDate = new Date(date.match(/\d+/)[0] * 1);
        var d = formattedDate.getDate();
        var m = formattedDate.getMonth();
        m += 1;  // JavaScript months are 0-11
        var y = formattedDate.getFullYear();

        return d + "/" + m + "/" + y + " " + formattedDate.getHours() + ":" + formattedDate.getMinutes() + ":" + formattedDate.getSeconds();
    });

    Handlebars.registerHelper('firstAction', function (tran) {
        let html = '';
        if ('SIGN' === tran.TranType && 1 === tran.TrangThai) {
            html = '<a href="javascript::void(0)" id="' + tran.ID + '" class="btn btn-online send-tran blue-600" data-target="#sendTranFileModal" data-toggle="modal"><i class="icon fa fa-envelope-o" aria-hidden="true" data-toggle="tooltip" data-placement="top" data-original-title="Gửi tệp đã ký qua email"></i></a>';
        }
        return new Handlebars.SafeString(html);
    });

    /*
     * Helper: Trạng thái giao dịch information
     */
    Handlebars.registerHelper('tranStatusInfo', function (tran) {
        let html = '<div class="sub-title hidden-lg-up"><span class="' + model.tranTypeBackgroup(tran.TranType) +
            ' badge badge-round hidden-sm-down">' + tran.TranType + '</span><span class="hidden-sm-down"> | </span> ' + tran.FileSize +
            '<span class="divider hidden-md-up">| ' + tran.FileContentType + '</span></div> ';
        switch (tran.TrangThai) {
            case 1:
                html = "";
                break;
            case 3:
                html = '<div class="sub-title green-600">Đã chuyển tới đối tác: <strong>' + tran.ReceiverEmail +
                    '</strong><span class="divider">|</span>Đối tác đã ký xác nhận.</div>';
                break;
            case 2:
                html = '<div class="sub-title green-500">Đã chuyển tới đối tác: <strong>' + tran.ReceiverEmail +
                    '</strong><span class="divider">|</span>' + tran.NgayChuyen + '</div>';
                break;
            case 4:
                html = '<div class="sub-title red-600">Đã chuyển tới đối tác: <strong>' + tran.ReceiverEmail +
                    '</strong><span class="divider">|</span>Đối tác hủy xác nhận.</div>';
                break;
            case 5:
                html = '<div class="sub-title red-600">Đã chuyển tới đối tác: <strong>' + tran.ReceiverEmail +
                    '</strong><span class="divider">|</span>Đối tác đã xem tài liệu.</div>';
                break;
            default:
                html = '<div class="sub-title red-600"><strong>[ERROR ' + tran.TrangThai + '] ' + tran.ThongTin + '</strong></div>';
        }
        html += '<div class="time hidden-sm-up"><span class="' + model.tranTypeBackgroup(tran.TranType) +
            ' badge badge-round">' + tran.TranType + '</span>  | ' + tran.NgayGiaoDichText + '</div>';

        return new Handlebars.SafeString(html);
    });
});
