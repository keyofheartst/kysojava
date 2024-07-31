var signAdvanced = false;
var vnptPdf;

$(document).ready(function () {
    vnptPdf = $('#pdf-advanced').vnptpdf({Callback:signSignServerAdvanced});
    $('.nav-kyso').addClass('active');

    $('#sign-plugin').click(function () {
        checkPlugin(checkPluginCallback);
    });


    $('.cert-select-btn').click(function () {
        var certId = $(this).attr('id');
        console.log(certId);
        $('#signserver-cert-id').val(certId);
        signSignServerHandle();
    });

    $('#sign-signserver').click(function () {
        var fileSplit = document.getElementById('fileName').value.split(".");

        if (fileSplit === '' || fileSplit.length < 2 || fileSplit[fileSplit.length - 1] === '') {
            showMessage("Chưa chọn tệp để ký.", "error");
            return;
        }
        var _allowedTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'text/xml',
            'text/plain',
            'application/pdf'
        ];

        if ($('#file-type').text() === "" || _allowedTypes.indexOf($('#file-type').text()) < 0) {
            showMessage("Định dạng chưa được hỗ trợ.", "error");
            return;
        }


        var fileExtension = fileSplit[fileSplit.length - 1].toLowerCase();
        $('#signserver-cert').modal('show');
        $('.test').resize();
    });

    $('#verify-submit').click(function () {
        var fileSplit = document.getElementById('fileName').value.split(".");

        if (fileSplit === '' || fileSplit.length < 2) {
            showMessage("Chưa chọn tệp để cần kiểm tra.", "error");
            return;
        } else {
            verify();
        }
    });

    // Tim kiem doi tac
    $('#search-partner').click(function () {
        searchPartner();
    });
    $('#keyword').keypress(function (e) {
        if (e.which === 13) {
            searchPartner();
        }
    });

    $('#tool-signserver').click(function () {
        $('.example-loading').show();
        $('#signserver-cert').modal('show');
        checkHasCerts();
    });

    confirmSignTransaction();

    //

    if (!String.prototype.endsWith) {
        String.prototype.endsWith = function (suffix) {
            return this.indexOf(suffix, this.length - suffix.length) !== -1;
        };
    }
    verifySuccess();

});


function signSignServerHandle() {
    $('#signserver-cert').modal('hide');
    var fileSplit = document.getElementById('fileName').value.split(".");
    var fileExtension = fileSplit[fileSplit.length - 1].toLowerCase();

    if (fileExtension === "pdf" && document.getElementById('sign-advanced-opt').checked) {
        vnptPdf.start();
    } else {
        signSignServer();
    }
}

function checkHasCerts() {
    $.ajax({
        url: "/Certificates/CheckHasCertificates",
        type: "POST",
        success: function (result) {
            $('.example-loading').hide();
            if (result === true) {
                $('#login-form').submit();
            } else {
                $('#cert-list').html(result);
            }
        },
        error: function () {
            $('.example-loading').hide();
        }
    });
}

function searchPartner() {
    $('#cert-list').empty();
    $('.example-loading').show();
    $.ajax({
        url: "/Home/SearchForPartner",
        data: {
            keyword: $('#keyword').val()
        },
        success: function (result) {
            $('.example-loading').hide();
            $('#partner-list').html(result);
            $('.friend-info').click(function () {
                var partnerName = $(this).find('.friend-name').text();
                var partnerEmail = $(this).find('.friend-title').text();
                $('#partner-name').text(partnerName);
                $('#partner-email').val(partnerEmail);
                $('#examplePositionSidebar').modal('hide');
                $('#shareTranModal').modal('show');
            });
            $('.test').resize();
        },
        error: function () {
            $('.example-loading').hide();
        }
    });
}

// Called in Dropify.prototype.readFile ~/Content/Vendor/dropify/dropify.js
// when change file input
var selectFileCallback = function (file, fileBase64) {
    selectFileCallBack(file, fileBase64);

    if (file.type.endsWith('pdf')) {
        $('#checkbox-sign-advanced').show();

        // init pdf data every time change document
        var file1 = $('#input-file-max-fs').get(0).files[0];
        vnptPdf.initDataFile(file1);
    }
    else {
        $('#checkbox-sign-advanced').hide();
    }
};

function verifySelectFileCallBack(file, fileBase64) {
    $('#show-response').hide();
    $("[name='name']").val(file.name);
    $("[name='size']").val(filesize(file.size));
    $("[name='contentType']").val(file.type);
    var fileSplit = file.name.split(".");
    var fileExtension = fileSplit[fileSplit.length - 1].toLowerCase();
    $("[name='type']").val(fileExtension);
    selectFileCallBack(file, fileBase64);
}

function selectFileCallBack(file, fileBase64) {
    if (!fileBase64.trim()) {
        //TODO when read file error
    }

    document.getElementById('fileName').value = file.name;
    document.getElementById('fileName').innerHTML = file.name;

    $('.progress').hide();
    $('#file-name').text(file.name);
    $('#file-size').text(filesize(file.size));
    $('#file-type').text(file.type);
    $('.unsign-file-info').show();

    var dataIndex = fileBase64.indexOf("base64,") + 7;
    var data = fileBase64.substr(dataIndex);
    $('#fileContent').val(data);
}

function confirmSignTransaction() {
    var mark = $('#confirm-tran-mark').val();
    if (mark === "true") {
        var type = $('#file-type').text();
        var content = $('#fileContent').val();
        if (type.endsWith('pdf')) {
            $('#checkbox-sign-advanced').show();
            vnptPdf.initDataBase64(content);
        }
    }
}

/*
 * 
 *
 */
function checkPluginCallback(data) {
    hideLoading();

    if (data === "1") {
        setLicense(sign);
        vnpt_plugin.SetGetCertFromUsbToken(false);
    }
    else {
        showMessage("VNPT-CA Plugin chưa được cài đặt hoặc chưa được bật", "error");
    }
}


/*
 * 
 *
 */
function checkPlugin(functionCallback) {
    showLoading('Đang kiểm tra cài đặt Vnpt-CA Plugin...');
    vnpt_plugin.checkPlugin(functionCallback);
}

/*
 * 
 *
 */
function setLicense(functionCallback) {
    changeLoadingText('Đang kiểm tra License...');
    var key = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PExpY2Vuc2U+PFBoYW5NZW0+Vk5QVC1DQSBQbHVnaW48L1BoYW5NZW0+PE5ndW9pQ2FwPlZOUFQgU09GVFdBUkU8L05ndW9pQ2FwPjxEb25WaUR1b2NDYXA+KjwvRG9uVmlEdW9jQ2FwPjxOZ2F5QmF0RGF1PjA0LzA0LzIwMTggMDA6MDA6MDA8L05nYXlCYXREYXU+PE5nYXlLZXRUaHVjPjA3LzA1LzIwMTggMDA6MDA6MDA8L05nYXlLZXRUaHVjPjxTaWduYXR1cmUgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyMiPjxTaWduZWRJbmZvPjxDYW5vbmljYWxpemF0aW9uTWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvVFIvMjAwMS9SRUMteG1sLWMxNG4tMjAwMTAzMTUiIC8+PFNpZ25hdHVyZU1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyNyc2Etc2hhMSIgLz48UmVmZXJlbmNlIFVSST0iIj48VHJhbnNmb3Jtcz48VHJhbnNmb3JtIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnI2VudmVsb3BlZC1zaWduYXR1cmUiIC8+PC9UcmFuc2Zvcm1zPjxEaWdlc3RNZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjc2hhMSIgLz48RGlnZXN0VmFsdWU+aXJIV3NGY3EwYUZ3Q2dKampHRUFaTW1UYVZVPTwvRGlnZXN0VmFsdWU+PC9SZWZlcmVuY2U+PC9TaWduZWRJbmZvPjxTaWduYXR1cmVWYWx1ZT5ZeWFhWXVIR1FHaXFPNWlaWWpPczU1UVVrMllIMEZOa2UzcXk1LzNnL0Jva0hSS3I1MnkvTnRKSEhQM2I5MGluWmpjL0hJcFdaSWE4OUhza3JvbmJxbDd4K1h6Ymd0aS83WnY5MHpiSitCZDdvQ2RKVXMzRHh2ZExaOTNYNkJMM1dqWTZuSWhmK3lDd3dIVEpockxJTEV0VTRnNzkrOXR2eHdUSWhjOVJTcUI1NGxPNTNmcU4wMnlXTENML0hTL2JZYjNVK3pTOTlWZ0luYmpuUWFFUEd2bzBBU1BoRStXM29WYzFDTUl1ODMzd2tXQmhXRytXM1JNWm5LSURUTkp6YjZqV1RyWHRiSG9Zd2FsVkhLSkpINEZvVGZBMWplOUVkYWtyeGRCUk44WTIrZjdpYllYZ2lENExzTk1qSUdQMjllbXMzU2Z0V3hXamw0clJibDdsZFE9PTwvU2lnbmF0dXJlVmFsdWU+PEtleUluZm8+PEtleVZhbHVlPjxSU0FLZXlWYWx1ZT48TW9kdWx1cz5wMjhjVVRub1hHOVVvNzU0cGp3ZFpHSDhtWDRWWlFrQXlrb3Foc0FwdmdZUHlVUUVrQkU2ZDlxc1pMMzZHdjFqRloxdktob25JNmZMRXhWcmJIRG05K0RlS2V6VklacVF2TGlzNjNnM2hybXpSdCtjL29BemE2T1JxZUJWVm1QaENYT3cvSkRyd3hIM0NMWnJsUjFYR3htc3Fsamk3K1ZNMHBDL0NJa2lnLzV0RnUvUEN1VGNUWS9OZi95Zm1NVDk3Tml5OU5uRk5YNWNRcURFWTVsU0NEb295MGhwU0NuY1lRc3VMY1FKQWZZenZ6dzlvb09qRmpZT1V2bWNlbURDMS8wRUU5ZGJXbFdldGZuVk5iOHN6b3FzTEJyTEFEQjFDaFNmbmw5b1FGekdRVmEwUmlKOXhPd1BvSjI1alFkVmltRTE4dlRNWldadG1HTlMycisrT1E9PTwvTW9kdWx1cz48RXhwb25lbnQ+QVFBQjwvRXhwb25lbnQ+PC9SU0FLZXlWYWx1ZT48L0tleVZhbHVlPjxYNTA5RGF0YT48WDUwOUNlcnRpZmljYXRlPk1JSUdSVENDQkMyZ0F3SUJBZ0lRVkFFa2ozeVhSRUk3d0s3S1IvY0hzakFOQmdrcWhraUc5dzBCQVFVRkFEQnBNUXN3Q1FZRFZRUUdFd0pXVGpFVE1CRUdBMVVFQ2hNS1ZrNVFWQ0JIY205MWNERWVNQndHQTFVRUN4TVZWazVRVkMxRFFTQlVjblZ6ZENCT1pYUjNiM0pyTVNVd0l3WURWUVFERXh4V1RsQlVJRU5sY25ScFptbGpZWFJwYjI0Z1FYVjBhRzl5YVhSNU1CNFhEVEUzTURJeU56QTVNekl3TUZvWERURTVNREl5TnpJeE16SXdNRm93Z1lveEN6QUpCZ05WQkFZVEFsWk9NUkl3RUFZRFZRUUlEQWxJdzRBZ1R1RzdtRWt4RlRBVEJnTlZCQWNNREVQaHVxZDFJRWRwNGJxbGVURXNNQ29HQTFVRUF3d2pWazVRVkNCVFQwWlVWMEZTUlNBdElGWk9VRlFnUTBFZ0xTQlVSVk5VSUZOSlIwNHhJakFnQmdvSmtpYUprL0lzWkFFQkRCSk5VMVE2TVRBeE5qZzJPVGN6T0Mwd01USXdnZ0VpTUEwR0NTcUdTSWIzRFFFQkFRVUFBNElCRHdBd2dnRUtBb0lCQVFDbmJ4eFJPZWhjYjFTanZuaW1QQjFrWWZ5WmZoVmxDUURLU2lxR3dDbStCZy9KUkFTUUVUcDMycXhrdmZvYS9XTVZuVzhxR2ljanA4c1RGV3RzY09iMzRONHA3TlVobXBDOHVLenJlRGVHdWJORzM1eitnRE5ybzVHcDRGVldZK0VKYzdEOGtPdkRFZmNJdG11VkhWY2JHYXlxV09MdjVVelNrTDhJaVNLRC9tMFc3ODhLNU54Tmo4MS8vSitZeFAzczJMTDAyY1UxZmx4Q29NUmptVklJT2lqTFNHbElLZHhoQ3k0dHhBa0I5ak8vUEQyaWc2TVdOZzVTK1p4NllNTFgvUVFUMTF0YVZaNjErZFUxdnl6T2lxd3NHc3NBTUhVS0ZKK2VYMmhBWE1aQlZyUkdJbjNFN0ErZ25ibU5CMVdLWVRYeTlNeGxabTJZWTFMYXY3NDVBZ01CQUFHamdnSEZNSUlCd1RCd0JnZ3JCZ0VGQlFjQkFRUmtNR0l3TWdZSUt3WUJCUVVITUFLR0ptaDBkSEE2THk5d2RXSXVkbTV3ZEMxallTNTJiaTlqWlhKMGN5OTJibkIwWTJFdVkyVnlNQ3dHQ0NzR0FRVUZCekFCaGlCb2RIUndPaTh2YjJOemNDNTJibkIwTFdOaExuWnVMM0psYzNCdmJtUmxjakFkQmdOVkhRNEVGZ1FVYkg0aHRGc09iTEQxazBOb0NYanlGVHZaQ1Fzd0RBWURWUjBUQVFIL0JBSXdBREFmQmdOVkhTTUVHREFXZ0JRR2FjRFYxUUtLRlkxR2ZlbDg0bWdLVmF4cXJ6Qm9CZ05WSFNBRVlUQmZNRjBHRGlzR0FRUUJnZTBEQVFFREFRRUNNRXN3SWdZSUt3WUJCUVVIQWdJd0ZoNFVBRThBU1FCRUFDMEFVQUJ5QUMwQU1nQXVBREF3SlFZSUt3WUJCUVVIQWdFV0dXaDBkSEE2THk5d2RXSXVkbTV3ZEMxallTNTJiaTl5Y0dFd01RWURWUjBmQkNvd0tEQW1vQ1NnSW9ZZ2FIUjBjRG92TDJOeWJDNTJibkIwTFdOaExuWnVMM1p1Y0hSallTNWpjbXd3RGdZRFZSMFBBUUgvQkFRREFnVHdNRFFHQTFVZEpRUXRNQ3NHQ0NzR0FRVUZCd01DQmdnckJnRUZCUWNEQkFZS0t3WUJCQUdDTndvRERBWUpLb1pJaHZjdkFRRUZNQndHQTFVZEVRUVZNQk9CRVRGamFIVmpkWFZBWjIxaGFXd3VZMjl0TUEwR0NTcUdTSWIzRFFFQkJRVUFBNElDQVFBeXFpSlB2dmtDTU1GM0JCaVBaM0duZWhud3ZodG1EUkpqWlJSTm1iNTIyTHc4eVNxSXBvNTdnWElTbkxlM3FXeUMwR0NXYVZzL1dKNlRKZzNmQjFHYUhwMnVKRzhoR1YwZzVNSm5nZ0FrV0lISGJraGt5WGxLZC94eHZGN2xDV3NsaDdPTG8vRHdKelBjQVFLZERtb3NETGtMdXRsamlyS2dQMTE4WG1UcEplOWNuaFRHV3htUjQzUlhvMXBLNk1aSlMvMzVBMGFFY1VGd2xreU9KcEZ1eitHcmpxMnFLMllzVHB2TkludzNMWkR3UmtrWWpobUpPRStmdWtxZnA4V0ZjQnRFR3FXRGFCYm1xZ1p2Y2l0OXMrUm9pM1dlT014VUtyaTBmU0FLRGN1eG5mNHJ4aWZRMEJiYXM5SFVtTm02NVZFc20rZjVCMHZkU202UzdYOFpvNTR1UXRSZy9IZDFhQ1B5MEFGZGZhSGkrNmFkcXIyWnEzcHRNSVMxMDdsQ2RxMjZLeU4zUk14WXZoNU5ac2c4OEpjOUlObEd4TDU4V0Q5RUI3TXpGa1dtbkdiOUpjMXVrQUVhUFpBOXZ3WldaVUF0cFdPSWRUeE5tVXZzWmRsVkE5dkRjL1RuSlJiVWswYUN3dnFWV01halBQb3p0OC9DdnpIcXdjT3Vna0Z1YzcrOE05UkZpK1J0WlhBK2tyVE5nblRLSlJIZDE2M2RXc3kzZnB5RlU5UEFjeWt5VEtxRmZpbEZqTmlHODdYME1acnA0bExSY1N1RmtnSFk2ci9pSWtMdkZNNkRJclRKU3hEUDNiWG85akZsOVFPYWJTTmZvUHhLbTQxdTVHcXBlSlhqbE5OQURJK0dOdFdRNmczWjJtdVlXcFM1NE5VZEpOcnlHUHlMeEE9PTwvWDUwOUNlcnRpZmljYXRlPjwvWDUwOURhdGE+PC9LZXlJbmZvPjxPYmplY3Q+PFNpZ25hdHVyZVByb3BlcnRpZXMgeG1sbnM9IiI+PFNpZ25hdHVyZVByb3BlcnR5IElkPSJTaWduaW5nVGltZSIgVGFyZ2V0PSJzaWduYXR1cmVQcm9wZXJ0aWVzIj48U2lnbmluZ1RpbWU+MjAxOC0wNC0wNVQwMDo1NzoyM1o8L1NpZ25pbmdUaW1lPjwvU2lnbmF0dXJlUHJvcGVydHk+PC9TaWduYXR1cmVQcm9wZXJ0aWVzPjwvT2JqZWN0PjwvU2lnbmF0dXJlPjwvTGljZW5zZT4=";
    vnpt_plugin.setLicenseKey(key, functionCallback);
}

/*
 * 
 *
 */
function sign() {
    showLoading('Chọn chứng thư số...');
    if ($('#fileContent').val() === "" || $('#fileContent').val().length === 0) {
        hideLoading();
        showMessage("Chưa có dữ liệu ký.", "error");
        return;
    }
    if (document.getElementById('fileName') === null || document.getElementById('fileName').value.length === 0) {
        hideLoading();
        showMessage("Chưa chọn tệp cần ký.", "error");
        return;
    }

    var fileSplit = document.getElementById('fileName').value.split(".");
    var fileExtension = fileSplit[fileSplit.length - 1].toLowerCase();

    if (fileExtension !== "xml" && fileExtension !== "pdf" && fileExtension !== "docx"
        && fileExtension !== "xlsx" && fileExtension !== "pptx" && fileExtension !== "txt") {
        hideLoading();
        showMessage("Định dạng dữ liệu chưa được hỗ trợ.", "error");
        return;
    }
    var sigOptions = null;
    if (fileExtension === "pdf" && document.getElementById('sign-advanced-opt').checked) {
        sigOptions = new PdfSigner();
        sigOptions.AdvancedCustom = true;
    }
    GetCertInfo(fileExtension, sigOptions);
}

var fileExt = null, signOpt = null;
function GetCertInfo(fileExtension, sigOptions) {
    fileExt = fileExtension;
    signOpt = sigOptions;
    vnpt_plugin.getCertInfo(GetCertInfoCallBack);
}

function GetCertInfoCallBack(data) {
    showLoading('Đang kiểm tra chứng thư số...');
    if (data === "" || data === null) {
        $('.loader-content-custom').hide();
        showMessage("Không lấy được thông tin chứng thư số từ usb token", "error");
        return;
    }
    var jsOb = JSON.parse(data);
    if (jsOb !== "" || jsOb === null) {
        if (jsOb.hasOwnProperty('code')) {
            showMessage(jsOb.error, "error");
            return;
        }
        SignAdvanced(document.getElementById('fileContent').value, fileExt, signOpt, jsOb.serial);
        // Call service to check certificate
        //$.ajax({
        //    async: true,
        //    type: "POST",
        //    url: "/Home/CheckCertificate",
        //    data: {
        //        validFrom: jsOb.notBefore,
        //        validTo: jsOb.notAfter
        //    }
        //}).done(function (response) {
        //    if (response) {
        //        SignAdvanced(document.getElementById('fileContent').value, fileExt, signOpt, jsOb.serial);
        //    }
        //    else {
        //        hideLoading();
        //        showMessage("Chứng thư số đã hết hạn hoặc chưa tới hạn sử dụng.", "error");
        //    }
        //});
    } else {
        hideLoading();
        showMessage("Không thể kiểm tra thông tin chứng thư số", "error");
    }
}

/*
 * 
 *
 */
function SignAdvanced(data, type, sigOption, serial) {
    changeLoadingText('Đang ký dữ liệu...');
    var dataJS = {};

    var arrData = [];
    // 1			
    dataJS.data = data;
    dataJS.type = type;
    dataJS.sigOptions = JSON.stringify(sigOption);

    var jsData = "";
    jsData += JSON.stringify(dataJS);
    //
    arrData.push(jsData);

    vnpt_plugin.signArrDataAdvanced(arrData, serial, true, signCallback);
}

/*
 * 
 *
 */
function signCallback(dataJson) {
    hideLoading();
    var jsObj = JSON.parse(JSON.parse(dataJson)[0]);
    if (jsObj.code !== 0) {
        showResponseMessage(jsObj.code);
        return;
    }
    var fileSplit = document.getElementById('fileName').value.split(".");
    var fileExtension = fileSplit[fileSplit.length - 1].toLowerCase();
    var fileSplit2 = document.getElementById('fileName').value.split("\\");
    var fileNameTmp = fileSplit2[fileSplit2.length - 1];
    var fileName = fileNameTmp.substring(0, fileNameTmp.length - fileExtension.length - 1);
    $.ajax({
        async: true,
        type: "POST",
        url: "/home/pluginsigncallback",
        data: {
            signedData: jsObj.data,
            type: fileExtension,
            name: fileName,
            size: $('#file-size').text(),
            contentType: $('#file-type').text()
        }
    }).done(function (response) {
        if (response) {
            //showMessage("Ký dữ liệu thành công.", "info");
            //window.location.href = "/home/downloadfile?type=" + fileExtension + "&name=" + fileName;
            window.location.href = "/home/signcomplete";
        }
        else {
            showMessage("Ký dữ liệu thất bại.", "error");
        }
    });
}

function verifySuccess() {
    if ($('#model-code').val() === 0) {
        $('#verify-result-content').html($('#response').val());
        $('#verifyResult').modal('show');
        $('#show-response').show();
    }
}

function verify() {
    $('#show-response').hide();
    var fileSplit = document.getElementById('fileName').value.split(".");
    var fileExtension = fileSplit[fileSplit.length - 1].toLowerCase();
    var fileSplit2 = document.getElementById('fileName').value.split("\\");
    var fileNameTmp = fileSplit2[fileSplit2.length - 1];
    var fileName = fileNameTmp.substring(0, fileNameTmp.length - fileExtension.length - 1);

    $('#verify-form-x').submit();

    return;
    //$.ajax({
    //    type: "POST",
    //    url: "/transactions/verify",
    //    data: {
    //        CaptchaCode: $('#CaptchaInputText').val(),
    //        data: $('#fileContent').val(),
    //        type: fileExtension,
    //        name: fileName,
    //        size: $('#file-size').text(),
    //        contentType: $('#file-type').text(),
    //        otp: $('#OTP').val()
    //    },
    //    async: true,
    //    beforeSend: function () {
    //        showLoading('Đang kiểm tra dữ liệu ký số...');
    //    }
    //}).done(function (resp) {
    //    $('.sign-button').removeClass('disabled');
    //    $('.sign-button').removeAttr('disabled');
    //    var response = JSON.parse(resp);
    //    $('.otp-need').hide();
    //    $('#verify-submit').show();
    //    $('#OTP').val('');
    //    if (response.Code === 0) {
    //        hideLoading();
    //        $('#verify-result-content').html(response.Result);
    //        $('#verifyResult').modal('show');
    //        $('#show-response').show();
    //    }
    //    else if (response.Code == 1) {
    //        $('.otp-need').show();
    //        $('#verify-submit').hide();
    //    }
    //    else if (response.Code == 2) {
    //        hideLoading();
    //        showMessage(response.Message, "error");
    //    }
    //    else if (response.Code == 3) {
    //        hideLoading();
    //        showMessage(response.Message, "error");
    //    }
    //});
   
}

function verifyResult(data) {
    for (var i = 0; i < data.signatures.length; i++) {
        var sign = data.signatures[i];

    }
}

function signSignServer() {
    var fileNameSplit = $('#fileName').val().split(".");
    var fileType = fileNameSplit[fileNameSplit.length - 1].toLowerCase();

    $.ajax({
        method: "POST",
        url: "/home/sign",
        data: {
            data: $('#fileContent').val(),
            cert: $('#signserver-cert-id').val(),
            type: fileType,
            name: $('#fileName').val(),
            size: $('#file-size').text(),
            contentType: $('#file-type').text()
        },
        async: true,
        beforeSend: function () {
            showLoading('Đang ký dữ liệu trên hệ thống SignSevice...');
        }
    }).done(function (response) {
        if (response.ResponseCode === 1) {
            window.location.href = "/home/signcomplete";
        } 
        else if (response.ResponseCode === 10) {
            window.location.href = response.Message;
        }
        else if (response.ResponseCode === 100) {
            //$('#phone-otp').text(response.PhoneNum);
            $('#otpModal').modal({ backdrop: "static" });
            $('#otp-submit').click(function () {
                signOTPConfirm();
            });
        }
        else {
            hideLoading();
            showMessage("Ký dữ liệu thất bại. " + response.Message, "error");
        }
    });
}

function signOTPConfirm() {
    $.ajax({
        method: "POST",
        url: "/home/twofactorconfirm",
        data: {
            otp: $('#otp-val').val()
        },
        async: true,
        beforeSend: function () {
            showLoading('Đang hoàn tất giao dịch...');
        }
    }).done(function (response) {
        if (response.ResponseCode === 1) {
            window.location.href = "/home/signcomplete";
        }
        else {
            hideLoading();
            showMessage("Ký dữ liệu thất bại. " + response.Message, "error");
        }
    });
}

function signSignServerAdvanced(option) {
    console.log(option);
    var pdfOption = {
        Rectangle: option.rectangle,
        Page: option.page,
        FontSize: option.fontSize,
        VisibleType: option.visibleType,
        Image: option.imageSrc,
        Comment: option.comment
    };

    var worker = $('#worker').val();

    var fileNameSplit = $('#fileName').val().split(".");
    var type = fileNameSplit[fileNameSplit.length - 1].toLowerCase();
    var fileNameSub = $('#fileName').val().substring(0, $('#fileName').val().length - type.length - 1);


    $.ajax({
        method: "POST",
        url: "/home/signpdfadvanced",
        data: {
            data: $('#fileContent').val(),
            cert: $('#signserver-cert-id').val(),
            pdfOptions: JSON.stringify(pdfOption),
            name: $('#fileName').val(),
            size: $('#file-size').text()
        },
        async: true,
        beforeSend: function () {
            showLoading('Đang ký dữ liệu trên hệ thống SignSevice...');
        }
    }).done(function (response) {
        if (response.ResponseCode === 1) {
            //showMessage("Ký dữ liệu thành công.", "info");
            window.location.href = "/home/signcomplete";
        }
        else if (response.ResponseCode === 10) {
            window.location.href = response.Message;
        }
        else if (response.ResponseCode === 100) {
            //$('#phone-otp').text(response.PhoneNum);
            $('#otpModal').modal({ backdrop: "static" });
            $('#otp-submit').click(function () {
                signOTPConfirm();
            });
        }
        else {
            hideLoading();
            showMessage("Ký dữ liệu thất bại. " + response.Message, "error");
        }
    });
}

/*
*/
function showLoading(mesg) {
    $('.sign-button').addClass('disabled');
    $('.sign-button').attr('disabled', 'disabled');
    $('.loader-content-custom').show();
    $('#loading-message').text(mesg);

}

/*
*/
function changeLoadingText(mesg) {
    $('#loading-message').text(mesg);
}

/*
*/
function hideLoading() {
    $('.loader-content-custom').hide();
    $('.sign-button').removeClass('disabled');
    $('.sign-button').removeAttr('disabled');
}

/*
 * 
 *
 */
function showResponseMessage(data) {
    var err = "Lỗi không xác định";
    switch (data) {
        case 1:
            err = "Dữ liệu đầu vào không đúng định dạng";
            break;
        case 2:
            err = "Không lấy được thông tin chứng thư số";
            break;
        case 3:
            err = "Có lỗi trong quá trình ký số";
            break;
        case 4:
            err = ("Chứng thư số không có khóa bí mật");
            break;
        case 5:
            err = ("Lỗi không xác định");
            break;
        case 6:
            err = ("Ký pdf: không tìm thấy tham số số trang cần ký");
            break;
        case 7:
            err = ("Ký pdf: trang đặt chữ ký không tồn tại");
            break;
        case 8:
            err = ("Ký xml: không tìm thấy thẻ ký số");
            break;
        case 9:
            err = ("Ký pdf: không tìm thấy id của thẻ ký số");
            break;
        case 10:
            err = ("Dữ liệu ký đã chứa một hoặc nhiều chữ ký không hợp lệ");
            break;
        case 11:
            err = ("Người dùng hủy bỏ");
            break;
        default:
            err = ("Lỗi không xác định");
            break;
    }
    showMessage(err, "error");
}
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define('/forms/validation', ['jquery', 'Site'], factory);
    } else if (typeof exports !== "undefined") {
        factory(require('jquery'), require('Site'));
    } else {
        var mod = {
            exports: {}
        };
        factory(global.jQuery, global.Site);
        global.formsValidation = mod.exports;
    }
})(this, function (_jquery, _Site) {
    'use strict';

    var _jquery2 = babelHelpers.interopRequireDefault(_jquery);

    (0, _jquery2.default)(document).ready(function ($$$1) {
        (0, _Site.run)();
    });

    // Upgrage Account form -----------------------------------
    (function () {
        (0, _jquery2.default)('#share-tran-form').formValidation({
            framework: "bootstrap4",
            locale: 'vi_VN',
            icon: null,
            button: {
                selector: '#share-tran-submit',
                disabled: 'disabled'
            },
            fields: {
                message: {
                    validators: {
                        notEmpty: {
                            message: 'Nội dung thông điệp là trường bắt buộc'
                        },
                        stringLength: {
                            max: 250,
                            message: 'Nội dung không được quá 250 ký tự'
                        }
                    }
                }
            },
            err: {
                clazz: 'invalid-feedback'
            },
            control: {
                // The CSS class for valid control
                valid: 'is-valid',

                // The CSS class for invalid control
                invalid: 'is-invalid'
            },
            row: {
                invalid: 'has-danger'
            }
        }).on('err.field.fv', function (e, data) {
            data.fv.disableSubmitButtons(true);
        }).on('success.field.fv', function (e, data) {
            var fields = $("form#upgrage-account-form :input:not(:hidden)");
            if (!required(fields)) {
                $('#submit-upgrade-account').attr('disabled', 'disabled');
            }
            });
    })();

});

var required = function (fields) {
    var valid = true;
    fields.each(function () { // iterate all
        var $this = $(this);
        if (($this.is(':checkbox') && !$this.is(":checked")) || // checkbox
            (($this.is(':text') || $this.is('textarea')) && !$this.val()) || // text and textarea
            ($this.is(':radio') && !$('input[name=' + $this.attr("name") + ']:checked').length) ||
            ($this.is(':password') && !$this.val())) {
            valid = false;
        }
    });

    return valid;
}

$('.option-info').click(function () {
    alert();
})