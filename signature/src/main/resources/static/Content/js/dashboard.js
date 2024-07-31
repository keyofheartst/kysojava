(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define('/dashboard/v1', ['jquery', 'Site'], factory);
    } else if (typeof exports !== "undefined") {
        factory(require('jquery'), require('Site'));
    } else {
        var mod = {
            exports: {}
        };
        factory(global.jQuery, global.Site);
        global.dashboardV1 = mod.exports;
    }
})(this, function (_jquery, _Site) {
    'use strict';

    var _jquery2 = babelHelpers.interopRequireDefault(_jquery);

    (0, _jquery2.default)(document).ready(function ($$$1) {
        (0, _Site.run)();

        //var defaultLabels = ['_/_', '_/_', '_/_', '_/_', '_/_', '_/_', '_/_'];
        //var defaultVals = [0, 0, 0, 0, 0, 0, 0];
        //var defaultValRevert = [600, 600, 600, 600, 600, 600, 600];

        //function tranReport(labels, vals, valsRevert) {
        //    //chart-bar-withfooter
        //    new Chartist.Bar('#widgetCurrentChart .ct-chart', {
        //        labels: labels,
        //        series: [vals, valsRevert]
        //    }, {
        //            stackBars: true,
        //            fullWidth: true,
        //            seriesBarDistance: 0,
        //            axisX: {
        //                showLabel: true,
        //                showGrid: false,
        //                offset: 30
        //            },
        //            axisY: {
        //                showLabel: true,
        //                showGrid: false,
        //                offset: 30,
        //                labelOffset: {
        //                    x: 0,
        //                    y: 15
        //                }
        //            }
        //        });
        //}

        //// Widget Current Chart
        //// --------------------
        ////(tranReport(defaultLabels, defaultVals, defaultValRevert))();
        //Number.prototype.format = function (n, x) {
        //    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
        //    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
        //};
        //(function () {
        //    $.ajax({
        //        url: "/Home/TransactionReport",
        //        type: "GET",
        //        success: function (result) {                    
        //            var totalCount = 0;
        //            if (result) {
        //                var data = JSON.parse(result);
        //                var labels = [];
        //                var vals = [];
        //                var valsRevert = [];
        //                var max = 1.0;
        //                for (var i = 0; i < data.length; i++) {
        //                    labels.push(data[i].Label);
        //                    vals.push(data[i].Value);
        //                    totalCount += data[i].Value;
        //                    max = data[i].Value > max ? data[i].Value : max;
        //                }
        //                max = max < 100 ? 100 : ((Math.floor(max / 500) + 1) * 500);
        //                for (var j = 0; j < vals.length; j++) {
        //                    valsRevert.push(max - vals[j]);
        //                }

        //                tranReport(labels, vals, valsRevert);
        //            } else {
        //                tranReport(defaultLabels, defaultVals, defaultValRevert);
        //            }
        //            $('#weekTotal').text(totalCount.format());
        //        },
        //        error: function () {
        //            tranReport(defaultLabels, defaultVals, defaultValRevert);
        //        }
        //    });
        //})();

    });
});