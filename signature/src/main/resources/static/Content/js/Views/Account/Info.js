class UserInfo {
    constructor() {
        this.data = {};
    }

    getData() {
        $.ajax({
            url: '/Account/ServicePack',
            type: 'POST',
            dataType: 'json',
            success: result => {
                if (result.data) {                    
                    var userData = result.data;
                    var LuotKy = 0;
                    var SoToChuc = 0;
                    userData.Groups.forEach(e => {
                        if (e.TenNhom !== "Khách hàng cá nhân") SoToChuc++;
                        if (e.SoLuotKyConLai > 0) LuotKy += e.SoLuotKyConLai;
                        e.EmailOwner = userData.Email;
                    });
                    userData.LuotKy = LuotKy;
                    userData.SoToChuc = SoToChuc;
                    this.data = userData;                  
                } else {
                    this.data = {};
                }
                this.render();
            }
        });
    }

    render() {
        var sourceUserInfo = $('#customer-company-info').html();
        var templateUserInfo = Handlebars.compile(sourceUserInfo);
        $('#user-info').append(templateUserInfo(this.data));
        
        var sourceGroups = $('#groups-tab-template').html();
        var templateGroups = Handlebars.compile(sourceGroups);
        $('#groups').html(templateGroups(this.data));

        var sourceInvitation = $('#invitation-template').html();
        $('#invitation').replaceWith(Handlebars.compile(sourceInvitation)(this.data));

        $('#messages').html(Handlebars.compile($('#invitation-tab-template').html())(this.data));

        let doanhnghiepsource = $("#doanh-nghiep-template").html();
        let doanhnghieptemplate = Handlebars.compile(doanhnghiepsource);
        $('#doanh-nghiep').replaceWith(doanhnghieptemplate(this.data));
        
    }
}

$(document).ready(function () {
    const userInfo = new UserInfo();
    userInfo.getData();    
    
});

Handlebars.registerHelper('ifeq', function (a, b, options) {
    if (a === b) { return options.fn(this); }
    return options.inverse(this);
});

Handlebars.registerHelper('ifnoteq', function (a, b, options) {
    if (a !== b) { return options.fn(this); }
    return options.inverse(this);
});

Handlebars.registerHelper('larger', function (a, b, options) {
    if (a > b) { return options.fn(this); }
    return options.inverse(this);
});

Handlebars.registerHelper('DatetimeToDate', function (datetime) {
    return moment(datetime).format("DD/MM/YYYY");
});

Handlebars.registerHelper('CheckGroupType', function (groups, options) {
    let result = false;
    result = groups.forEach(e => {
        if (e.GroupType === 1) result = true;
    });
    return result ? options.fn(this) : options.inverse(this);
});

