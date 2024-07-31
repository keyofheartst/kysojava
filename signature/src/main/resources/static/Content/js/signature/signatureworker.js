/*!
 * =============================================================
 * signature-worker v1.0.0 - Signature helper.
 *
 * Copyright © 2019 VNPT IT
 * Author: TuanBS<tuanbs@vnpt.vn>
 * =============================================================
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        root.Signature = factory(root.jQuery);
    }
}(this, function ($) {
    var pluginName = "signature";

    $.fn[pluginName] = function (options) {
        var vnptSignature;
        if (!$.data(this, pluginName)) {
            vnptSignature = new Signature(this, options);
            $.data(this, pluginName, vnptSignature);
        }
        return vnptSignature;
    };
    return Signature;

    }));