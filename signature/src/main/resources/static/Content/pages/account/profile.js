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


    /**
     * Get group information
     */
    self.fetchData = function () {
        self.query('/Account/LoadMembers', null,
            function () {
            },
            function (result) {
                if (result === "") {
                    window.location.replace("/Account/Login/?ReturnUrl=/Transactions/GroupIndex");
                }
                if (result.success === 1 && result.data !== null) {
                    console.log(result);
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
                    console.log(result);
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
    model.loadMembers();
});
