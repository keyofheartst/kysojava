var model = new function () {
    var self = this;
    self.ConfigGroup = "";
    self.tab = $('#signserver');

    self.mailServerMode = function () {
        self.ConfigGroup = "SMTP";
        self.tab = $('#mailserver');
        self.render();
    };

    self.signserverMode = function () {
        self.ConfigGroup = "SIGNSERVER";
        self.tab = $('#signserver');
        self.render();
    };

    self.ftpMode = function () {
        self.ConfigGroup = "FTP";
        self.tab = $('#ftp');
        self.render();
    };

    self.gatewayMode = function () {
        self.ConfigGroup = "GATEWAY";
        self.tab = $('#gateway');
        self.render();
    };

    self.render = function () {
        // Function to get character limits based on screen width
        function getCharacterLimits() {
            const screenWidth = window.innerWidth;
            let configKeyLimit, valueLimit;

            if (screenWidth < 600) { // Small screens
                configKeyLimit = 15;
                valueLimit = 30;
            } else if (screenWidth < 1200) { // Medium screens
                configKeyLimit = 20;
                valueLimit = 50;
            } else { // Large screens
                configKeyLimit = 40;
                valueLimit = 100;
            }

            return { configKeyLimit, valueLimit };
        }

        // Function to truncate text based on a character limit
        function truncateText(text, limit) {
            if (text.length > limit) {
                return text.substring(0, limit - 3) + "...";
            }
            return text;
        }
        self.tab.jsGrid({
            width: "100%",
            height: "400px",
            inserting: true,
            editing: true,
            deleting: true,
            sorting: true,
            paging: false,
            autoload: true,
            controller: {
                loadData: function () {
                    return self.loadData();
                }
            },
            onItemUpdating: self.updateConfig,
            onItemInserting: self.addConfig,
            deleteItem: function (row) {
                self.showPopup(row);
            },
            fields: [
                {
                    name: "CONFIGKEY", type: "text", width: 50, validate: {
                        validator: "required",
                        message: function (value, item) {
                            return "Config KEY là trường bắt buộc";
                        }
                    },
                    itemTemplate: function (value) {
                        let classBadge = "badge-success";
                        switch (self.ConfigGroup) {
                            case 'SIGNSERVER':
                                classBadge = "badge-success";
                                break;
                            case 'SMTP':
                                classBadge = "badge-warning";
                                break;
                            case 'FTP':
                                classBadge = "badge-light";
                                break;
                            case 'GATEWAY':
                                classBadge = "badge-primary";
                                break;
                            default:
                                classBadge = "badge-default";
                        }
                        // if (self.ConfigGroup === 'GATEWAY') {
                        //     return $("<div>").append($("<span>").addClass("badge").addClass(classBadge).append("Domain")).append("  " + value);
                        // } else {
                        //     return $("<div>").append($("<span>").addClass("badge").addClass(classBadge).append(self.ConfigGroup)).append("  " + value);
                        // }

                        const { configKeyLimit } = getCharacterLimits();
                        let displayValue = self.ConfigGroup === 'GATEWAY' ? "Domain " + value : self.ConfigGroup + " " + value;
                        let truncatedValue = truncateText(displayValue, configKeyLimit);

                        let badge = $("<span>").addClass("badge").addClass(classBadge).text(self.ConfigGroup === 'GATEWAY' ? "Domain" : self.ConfigGroup);
                        let content = $("<span>").addClass("ellipsis").text(truncatedValue.replace(self.ConfigGroup + " ", "").replace("Domain ", "")).attr("title", displayValue);

                        return $("<div>").append(badge).append(content);
                    },
                    insertTemplate: function () {
                        const insertControl = this._insertControl = $("<input>").attr("type", "text").attr("maxlength", 50);
                        return insertControl;
                    },
                    editTemplate: function (value) {
                        const editControl = this._editControl = $("<input>").attr("type", "text").attr("maxlength", 50).val(value);
                        return editControl;
                    },
                    insertValue: function () {
                        return this._insertControl.val();
                    },
                    editValue: function () {
                        return this._editControl.val();
                    }
                },
                {
                    name: "VALUE", type: "text",
                    itemTemplate: function (value, item) {
                        // if (item.CONFIGKEY === "SMTP_PASSWORD") {
                        //     return "<div data-value='" + value + "'>" + "******" + "</div>";
                        // } else {
                        //     return value;
                        // }
                        const { valueLimit } = getCharacterLimits();
                        let displayValue = item.CONFIGKEY === "SMTP_PASSWORD" ? "******" : truncateText(value, valueLimit);

                        return $("<span>").addClass("ellipsis").text(displayValue).attr("title", value);

                    },
                    insertTemplate: function () {
                        const insertControl = this._insertControl = $("<input>").attr("type", "text").attr("maxlength", 200);
                        return insertControl;
                    },
                    editTemplate: function (value) {
                        const editControl = this._editControl = $("<input>").attr("type", "text").attr("maxlength", 200).val(value);
                        return editControl;
                    },
                    insertValue: function () {
                        return this._insertControl.val();
                    },
                    editValue: function () {
                        return this._editControl.val();
                    }
                },
                { type: "control"}
            ]
        });
        // Re-render the grid on window resize to adjust character limits
        $(window).resize(function () {
            self.tab.jsGrid("refresh");
        });
    };


    self.updateConfig = function (row) {
        self.query('/SystemConfig/UpdateConfig',
            {
                config: row.item
            },
            function () {

            },
            function (result) {
                if (result === null || result.success !== 1) {
                    row.cancel = true;
                    showMessage('Cập nhật thất bại. ' + result.message, 'error');
                } else {
                    showMessage('Cập nhật thành công', 'info');
                }
            }
        );
    };

    self.addConfig = function (row) {
        row.item.ConfigGroup = self.ConfigGroup;
        self.query('/SystemConfig/AddConfig', row.item,
            function () {

            },
            function (result) {
                if (result === null || result.success !== 1) {
                    row.cancel = true;
                    showMessage('Thêm config thất bại. ' + result.message, 'error');
                } else {
                    row.item.ID = result.data;
                    showMessage('Thêm config thành công', 'info');
                }
            }
        );
    };

    self.removeConfig = function (row) {
        self.query('/SystemConfig/RemoveConfig', row,
            function () {

            },
            function (result) {
                if (result === null || result.success !== 1) {
                    row.cancel = true;
                    row.item = row.previousItem;
                    showMessage('Xóa config thất bại. ' + result.message, 'error');
                } else {
                    showMessage('Xóa config thành công', 'info');
                    self.tab.jsGrid("loadData"); // Reload jsGrid after successful deletion
                    hidePopup(); // Hide the popup after successful deletion
                }
            }
        );
    };

    self.showPopup = function (row) {
        if (row !== undefined) {
            // Show custom popup for confirmation
            document.getElementById("customPopup").style.display = "flex";

            // Store the row item for later use
            self.pendingDeleteRow = row;
        } else {
            document.getElementById("customPopup").style.display = "none";
        }
    };

    function hidePopup() {
        document.getElementById("customPopup").style.display = "none";
    }

    document.getElementById("confirmYes").addEventListener("click", function () {
        self.removeConfig(self.pendingDeleteRow);
    });

    document.getElementById("confirmNo").addEventListener("click", function () {
        hidePopup();
    });

    self.loadData = function () {
        var d = $.Deferred();
        $.ajax({
            type: "POST",
            url: "/SystemConfig/LoadConfig",
            dataType: "json",
            data: {
                type: self.ConfigGroup
            }
        }).done(function (response) {
            d.resolve(response);
        });
        return d.promise();
    };

    self.query = function (url, data, beforeSend, callback) {
        $.ajax({
            url: GenerateUrl(url),
            async: false,
            type: 'POST',
            data: data,
            beforeSend: function () {
                beforeSend();
            },
            success: function (result) {
                callback(result);
            }
        });
    };
};
