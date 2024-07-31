var model = new function () {
    var self = this;

    self.pageSize = 15;
    self.items = null;

    self.paging_options = {
        bootstrapMajorVersion: 3,
        alignment: 'right',
        currentPage: 1,
        totalPages: 1,
        onPageChanged: function (event, oldPage, newPage) {
            self.fetchData(newPage, self.pageSize);
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
     * Get group information
     */
    self.fetchData = function () {
        //$.ajax({
        //    url: GenerateUrl("/Account/Groupinfo"),
        //    type: 'POST',
        //    beforeSend: function () {
        //        model.ShowLoading('#member-sum-loader', '');
        //        model.ShowLoading('#servicepack-sum-loader', '');
        //    },
        //    success: function (result) {
        //        model.HideLoading('#member-sum-loader');
        //        model.HideLoading('#servicepack-sum-loader');
        //        if (result === "") {
        //            window.location.replace("/account/login/?ReturnUrl=/home/dashboard");
        //        }
        //        let source = $("#member-sum-empty-template").html();
        //        let packSource = $("#servicepack-sum-empty-template").html();
        //        if (result.success === 1 && result.data !== null) {
        //            source = $("#member-sum-template").html();
        //            packSource = $("#servicepack-sum-template").html();
        //            if (result.data.Group.GroupType === 1) {
        //                result.data.Group.TenGoiCuoc = 'Đối soát giao dịch';
        //                result.data.Group.SoLuotKyConLai = 'UNLIMITED';
        //            }
        //        } 
        //        let template = Handlebars.compile(source);
        //        $('#member-sum').html('').append(template({
        //            model: result.data
        //        }));

        //        let packTemplate = Handlebars.compile(packSource);
        //        $('#servicepack-sum').html('').append(packTemplate({
        //            model: result.data
        //        }));
        //    },
        //    error: function (x, y, z) {
        //        if (y !== "abort")
        //            showMessage('Lỗi: ' + z, 'error');
        //    }
        //});
    };

    /**
     * Load group transactions summary
     * */
    self.loadGroupTransactions = function () {
        //self.query('/Account/LoadGroupTransactions', null,
        //    function () {
        //        self.ShowLoading('#tran-sum-loader', '');
        //        self.ShowLoading('#tran-report-loader', '');
        //    },
        //    function (result) {
        //        self.HideLoading('#tran-sum-loader');
        //        self.HideLoading('#tran-report-loader')
        //        if (result === "") {
        //            window.location.replace("/Account/Login/?ReturnUrl=/home/dashboard");
        //        }
        //        let source = $("#tran-sum-empty-template").html();
        //        let tranSource = $('#tran-report-empty-template');
        //        if (result.success === 1 && result.data !== null) {
        //            source = $("#tran-sum-template").html();
        //            tranSource = $('#tran-report-template').html();
        //        }
        //        let template = Handlebars.compile(source);
        //        $('#tran-sum').html('').append(template({
        //            model: result.data
        //        }));
        //        let tranTemplate = Handlebars.compile(tranSource);
        //        $('#tran-report').html('').append(tranTemplate({
        //            items: result.data.content,
        //            page: self.paging_options.currentPage,
        //            size: self.pageSize
        //        }));
        //    }
        //);
    };

    self.query = function (url, data, beforeSend, callback) {
        $.ajax({
            url: GenerateUrl(url),
            type: 'POST',
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

    // render
    self.render = function () {
        //var source = null;
        //if (self.items === null || self.items.length === 0) {
        //    source = $("#taikhoan_list-empty-template").html();
        //} else {
        //    source = $("#taikhoan_list-template").html();
        //}

        //var template = Handlebars.compile(source);
        //$('#taikhoan_list').html('').append(template({ items: self.items, page: self.paging_options.currentPage, size: self.pageSize }));
    };

    self.setData = function (items) {
        self.render();
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

};

$(document).ready(function () {
    model.search();
    model.loadGroupTransactions();
    Handlebars.registerHelper("equals", function (string1, string2, options) {
        if (string1 === string2) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
});
