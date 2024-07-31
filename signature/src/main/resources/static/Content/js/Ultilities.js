function ConvertJSONDate(strDate) {
    var d = new Date(parseInt(strDate.slice(6, -2)));
    return d;
}
function FormatJSONDateTime(strDateTime, formatType) {
    var date = ConvertJSONDate(strDateTime);
    var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
    var MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
    var yyyy = date.getFullYear();
    var hh = date.getHours();
    var MM = date.getMinutes();
    var ss = date.getSeconds();
    switch (formatType) {
        case "dd/MM/yyyy":
            return dd + "/" + MM + "/" + yyyy;
        case "dd-MM-yyyy":
            return dd + "-" + MM + "-" + yyyy;
        case "dd/MM/yyyy HH:mm:ss":
            return dd + "/" + MM + "/" + yyyy + " " + HH + ":" + mm + ":" + ss;
    }
    return "";
}
function GetTimeStamp(time) {
    const SECOND = 1;
    const MINUTE = 60 * SECOND;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;
    const MONTH = 30 * DAY;
    var defaultVal = new Date(0001, 01, 01);
    var now = new Date();
    if (time == null || time - now > 0) {
        return "";
    }
    if (defaultVal - time == 0) {
        return "";
    }
    var delta = (now - time) * 0.001;

    if (delta < 0) {
        return "not yet";
    }
    if (delta < 1 * MINUTE) {
        return "Vừa xong";
    }
    if (delta < 2 * MINUTE) {
        return "Khoảng 1 phút trước";
    }
    if (delta < 45 * MINUTE) {
        return (Math.floor(delta / 60)) + " phút trước";
    }
    if (delta < 90 * MINUTE) {
        return "Khoảng 1 giờ trước";
    }
    if (delta < 24 * HOUR) {
        return (Math.floor(delta / 3600)) + " giờ trước";
    }
    if (delta < 48 * HOUR) {
        return "Hôm qua";
    }
    if (delta < 30 * DAY) {
        return (Math.floor(delta / 86400)) + " ngày trước";
    }
    if (delta < 12 * MONTH) {
        var months = Math.floor((delta / 86400) / 30);
        return months <= 1 ? "Khoảng 1 tháng trước" : months + " tháng trước";
    }
    else {
        var years = Math.floor((delta / 86400) / 365);
        return years <= 1 ? "Khoảng 1 năm trước" : years + " năm trước";
    }
}
function Delay(callback, ms) {
  var timer = 0;
  return function() {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      callback.apply(context, args);
    }, ms || 0);
  };
}
function GetURLParam(param) {
    var url_string = window.location.href;
    var url = new URL(url_string);
    return url.searchParams.get(param);
}