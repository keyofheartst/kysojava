function chooseFileCallback(data) {
    document.getElementById("input-file-max-fs").disabled = false;
	if (data === "")
	{
		document.getElementById('checkbox-sign-advanced').style.visibility = 'hidden';
		return;
	}
    var jsonObj = JSON.parse(data);
    if (jsonObj != null && jsonObj.code != null) {
        alert(jsonObj.error);
        return;
    }
    document.getElementById('fileName').value = jsonObj.path;
    document.getElementById('fileName').innerHTML = jsonObj.path;	
    document.getElementById('fileContent').value = jsonObj.base64;
	var fileSplit = document.getElementById('fileName').value.split(".");
	var fileExtension = fileSplit[fileSplit.length - 1].toLowerCase();
	if (fileExtension === "pdf")
	{
		document.getElementById('checkbox-sign-advanced').style.visibility = 'visible';
	}
	else
	{
		document.getElementById('checkbox-sign-advanced').style.visibility = 'hidden';
	}
}
function chooseFile() {
    vnpt_plugin.chooseFile(chooseFileCallback);
}
// get cert info
function CertInfoCallback(data) {
    document.getElementById("btGetCertInfo").disabled = false;
    var jsonObj = JSON.parse(data);
    var randomAcc = makeAccountID();
    document.getElementById('certInfos').value = data;
    document.getElementById('account').value = randomAcc;
    document.getElementById('account').innerHTML = randomAcc;
    document.getElementById('subject').value = jsonObj.subjectCN;
    document.getElementById('subject').innerHTML = jsonObj.subjectCN;
    document.getElementById('issuer').value = jsonObj.issuerCN;
    document.getElementById('issuer').innerHTML = jsonObj.issuerCN;
    var dateExpire = new Date(jsonObj.notAfter);
    var formattedDate = formatDate(dateExpire);
    document.getElementById('dateExpire').value = formattedDate;
    document.getElementById('dateExpire').innerHTML = formattedDate;
    document.getElementById('serial').value = jsonObj.serial;
    document.getElementById('serial').innerHTML = jsonObj.serial;
    document.getElementById('certBase64').value = jsonObj.base64;
    document.getElementById('certBase64').innerHTML = jsonObj.base64;
}
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}
function getCertInfo() {
    vnpt_plugin.getCertInfo(CertInfoCallback);
    document.getElementById("btGetCertInfo").disabled = true;
}

function checkPluginCertInfoCallback(data) {
    if (data === "1") {
        setLicense(getCertInfo);
    }
    else {
        alert("VNPT-CA Plugin chưa được cài đặt hoặc chưa được bật");
    }
}

// sign cms
function logonCallback(data) {
    document.getElementById("btLogon").disabled = false;
    var modelCert = {
        certBase64: document.getElementById('certBase64').value,
        certSerial: document.getElementById('serial').value
    }
    var jsonObj = JSON.parse(data);
    if (jsonObj.code != 0) {
        alert(jsonObj.error);
        return;
    }
    document.getElementById('fileContent').value = jsonObj.data;
    $.ajax({
        method: "POST",
        url: "/module/verifylogon",
        data: {
            account: document.getElementById('account').value,
            certModel: modelCert,
            strSignedLogon: jsonObj.data
        },
        async: false
    }).done(function (response) {
        if (response) {

            alert("Đăng ký thành công!");
            document.getElementById('accountLogin').value = document.getElementById('account').value;
            document.getElementById('signup').style.visibility = 'hidden';
            document.getElementById('signup').style.display = 'none';
            document.getElementById('logon').style.visibility = 'visible';
            document.getElementById("logon").style.display = "block";
            document.getElementById('formGuide').style.visibility = 'hidden';
            document.getElementById("formGuide").style.display = "none";
        }
        else {
            alert("Đăng ký không thành công!");
        }
    });
}
function signLogon() {
    var logonStrRan = makeAccountID();
    vnpt_plugin.signCms(base64.encode(logonStrRan), logonCallback);
    document.getElementById("btLogon").disabled = true;
}
function makeAccountID() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < 16; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
// login
function loginCallback(data) {
    document.getElementById('btLogin').disabled = false;
    var modelCert = {
        certBase64: document.getElementById('certBase64').value,
        certSerial: document.getElementById('serial').value
    }
    var jsonObj = JSON.parse(data);
    if (jsonObj.code != 0) {
        alert(jsonObj.error);
        return;
    }
    $.ajax({
        method: "POST",
        url: "/module/verifylogin",
        data: {
            account: document.getElementById('account').value,
            certModel: modelCert,
            strSignedLogon: jsonObj.data
        },
        async: false
    }).done(function (response) {
        if (response) {
            document.getElementById('accountLogin').value = document.getElementById('account').value;
            document.getElementById('btLogin').style.visibility = 'hidden';
            document.getElementById('btLogin').style.display = 'none';
            document.getElementById('btLogout').style.visibility = 'visible';
            document.getElementById("btLogout").style.display = "block";

            document.getElementById('loginGuide').style.visibility = 'hidden';
            document.getElementById("loginGuide").style.display = "none";

            document.getElementById('issuerLogined').style.visibility = 'visible';
            document.getElementById("issuerLogined").style.display = "block";
            document.getElementById('subjectLogined').style.visibility = 'visible';
            document.getElementById("subjectLogined").style.display = "block";
            document.getElementById('dateExpireLogined').style.visibility = 'visible';
            document.getElementById("dateExpireLogined").style.display = "block";
            document.getElementById('serialLogined').style.visibility = 'visible';
            document.getElementById("serialLogined").style.display = "block";
            var jsonObj = JSON.parse(document.getElementById('certInfos').value);
            document.getElementById('dataSubjectLogined').value = jsonObj.subjectCN;
            document.getElementById('dataSubjectLogined').innerHTML = jsonObj.subjectCN;
            document.getElementById('dataIssuerLogined').value = jsonObj.issuerCN;
            document.getElementById('dataIssuerLogined').innerHTML = jsonObj.issuerCN;
            var dateExpire = new Date(jsonObj.notAfter);
            var formattedDate = formatDate(dateExpire);
            document.getElementById('dataDateExpireLogined').value = formattedDate;
            document.getElementById('dataDateExpireLogined').innerHTML = formattedDate;
            document.getElementById('dataSerialLogined').value = jsonObj.serial;
            document.getElementById('dataSerialLogined').innerHTML = jsonObj.serial;
            $("#dataSerialLogined").addClass("disabledbutton");
            $("#dataDateExpireLogined").addClass("disabledbutton");
            $("#dataSubjectLogined").addClass("disabledbutton");
            $("#dataIssuerLogined").addClass("disabledbutton");
            $("#accountLogin").addClass("disabledbutton");
            document.getElementById('formSiging').style.visibility = 'visible';
            document.getElementById("formSiging").style.display = "block";
        }
        else {
            alert("Đăng nhập không thành công!");
        }
    });
}
function signLogin() {
    var logonStrRan = makeAccountID();
    vnpt_plugin.signCms(base64.encode(logonStrRan), loginCallback);
    document.getElementById('btLogin').disabled = true;
}
function Logout() {
    location.reload();
}
function showMessage(data)
{			
	var err = "Lỗi không xác định";
	switch (data)
	{
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
	errorMessage(err);
}	
// sign data
function signCallback(dataJson) {
    $('#loader-content').hide();
    //var jsObj = JSON.parse(dataJson);
	var jsObj = JSON.parse(JSON.parse(dataJson)[0]);	
    if (jsObj.code != 0) {
        //errorMessage("Ký dữ liệu thất bại. Không tìm thấy certificate.");
		showMessage(jsObj.code);
        return;
    }
    var fileSplit = document.getElementById('fileName').value.split(".");
    var fileExtension = fileSplit[fileSplit.length - 1].toLowerCase();
    var fileSplit2 = document.getElementById('fileName').value.split("\\");
    var fileNameTmp = fileSplit2[fileSplit2.length - 1];
    var fileName = fileNameTmp.substring(0, fileNameTmp.length - fileExtension.length - 1);
    $.ajax({
        method: "POST",
        url: "/module/uploadsigneddatatoserver",
        data: {
            signedData: jsObj.data,
            type: fileExtension,
            name: fileName
        },
        async: false
    }).done(function (response) {
        if (response) {
            successMessage("Ký dữ liệu thành công.");
            window.location.href = "/Module/DownloadFile?type=" + fileExtension + "&name=" + fileName;
        }
        else {
            errorMessage("Ký dữ liệu thất bại.");
        }
    });
}
function sign_old() {
    $('#loader-content').show();
    $('#loading-message').text('Đang ký dữ liệu...');
	PNotify.removeAll();
    if ($('#fileContent').val() === "" || $('#fileContent').val().length == 0) {
        $('#loader-content').hide();
        errorMessage("Không có dữ liệu ký.");
        return;
    }
    if (document.getElementById('fileName') == null || document.getElementById('fileName').value.length == 0) {
        $('#loader-content').hide();
        errorMessage("Chưa chọn tệp cần ký.");
        return;
    }

    var fileSplit = document.getElementById('fileName').value.split(".");
    var fileName = fileSplit[fileSplit.length - 1].toLowerCase();
    if (fileName === "xml") {
        vnpt_plugin.signXML(document.getElementById('fileContent').value, signCallback);
    }
    else if (fileName == "pdf") {
        vnpt_plugin.signPdf(document.getElementById('fileContent').value, signCallback);
    }
    else if (fileName == "xlsx" || fileName == "docx" || fileName == "pptx" ) {
        vnpt_plugin.signOffice(document.getElementById('fileContent').value, signCallback);
    }
    else if (fileName == "txt") {
        vnpt_plugin.signCms(document.getElementById('fileContent').value, signCallback);
    }
    else {
        $('#loader-content').hide();
        errorMessage("Định dạng dữ liệu chưa được hỗ trợ.");
    }
}
function sign() {
    $('#loader-content').show();
    $('#loading-message').text('Đang ký dữ liệu...');
	PNotify.removeAll();
    if ($('#fileContent').val() === "" || $('#fileContent').val().length == 0) {
        $('#loader-content').hide();
        showMessage("Chưa có dữ liệu ký.", "error");
        return;
    }
    if (document.getElementById('fileName') == null || document.getElementById('fileName').value.length == 0) {
        $('#loader-content').hide();
        showMessage("Chưa chọn tệp cần ký.", "error");
        return;
    }

    var fileSplit = document.getElementById('fileName').value.split(".");
    var fileExtension = fileSplit[fileSplit.length - 1].toLowerCase();
	
	if (fileExtension !== "xml" && fileExtension !== "pdf" && fileExtension !== "docx"
		&& fileExtension !== "xlsx" && fileExtension !== "pptx" && fileExtension !== "txt")  {
		$('#loader-content').hide();
        showMessage("Định dạng dữ liệu chưa được hỗ trợ.", "error");
		return;
	}		
	var sigOptions = null;
	if (fileExtension === "pdf" && document.getElementById('for-project').checked)
	{
		 sigOptions = new PdfSigner();
		 sigOptions.AdvancedCustom = true;
		 //SignAdvanced(data, "pdf", sigOptions);
	}
    SignAdvanced(document.getElementById('fileContent').value, fileExtension, sigOptions);	
}

function SignAdvanced(data, type, sigOption)
{
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
	var serial = "";
	
	vnpt_plugin.signArrDataAdvanced(arrData, serial, true, signCallback);
}

function setLicenseCallback(data)
{
    $('#loading-message').text('');
    $('#loader-content').hide();
    vnpt_plugin.chooseFile(chooseFileCallback);
    document.getElementById("input-file-max-fs").disabled = true;
}

function setLicense(functionCallback)
{
    $('#loading-message').text('Đang kiểm tra License...');
    var key = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PExpY2Vuc2U+PFBoYW5NZW0+Vk5QVC1DQSBQbHVnaW48L1BoYW5NZW0+PE5ndW9pQ2FwPlZOUFQgU09GVFdBUkU8L05ndW9pQ2FwPjxEb25WaUR1b2NDYXA+KjwvRG9uVmlEdW9jQ2FwPjxOZ2F5QmF0RGF1PjAzLzAzLzIwMTggMDA6MDA6MDA8L05nYXlCYXREYXU+PE5nYXlLZXRUaHVjPjA0LzA1LzIwMTggMDA6MDA6MDA8L05nYXlLZXRUaHVjPjxTaWduYXR1cmUgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyMiPjxTaWduZWRJbmZvPjxDYW5vbmljYWxpemF0aW9uTWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvVFIvMjAwMS9SRUMteG1sLWMxNG4tMjAwMTAzMTUiIC8+PFNpZ25hdHVyZU1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyNyc2Etc2hhMSIgLz48UmVmZXJlbmNlIFVSST0iIj48VHJhbnNmb3Jtcz48VHJhbnNmb3JtIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnI2VudmVsb3BlZC1zaWduYXR1cmUiIC8+PC9UcmFuc2Zvcm1zPjxEaWdlc3RNZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjc2hhMSIgLz48RGlnZXN0VmFsdWU+bDczYWt0U3ZSbUZ4K091WVNpVDlWQ2l5b0RFPTwvRGlnZXN0VmFsdWU+PC9SZWZlcmVuY2U+PC9TaWduZWRJbmZvPjxTaWduYXR1cmVWYWx1ZT5EVnh1WllKRnVyb3dGSVVhU0RqbWgwUFo3QjBvbnpZbytDQzMvTDVOQjZoQmpMa3JZOFg1TDIzQ09GWlpSdUd1MC9SZlo0QmRpdWNGM0Z3a2EwVTc3VFN6RlRBOGJ2ZmRvajVJdEtNWkEzZU05RGhpdG5tcitwb0dUT2gvZWJxencxMDFIUjVFZW8zRXdxM3ZmMGxKL3dpb2JLZ2czZGlBcmo2L1hxaWYzZUJMMWczUlBrR3BTVGVLaGF4L3pLNEhhbUpraUhKc3MzS2dKNTNBUUZiaTR5c1RtVjFHTVV0MFRXdXZ1TkdtT2U2UjhsbG9FSHlLcHFCeXhNNXozeFp0ZUZoV2trWi9DNDEwWDZrZjlkc0hPYkVER1F5STVham13eUlsQ0F3TzgrM2VGbUdVU2IvcHIwbnpkeVdMOE1zR2hhQXBmOUl0QlA5R1J0TS9FRm5lM3c9PTwvU2lnbmF0dXJlVmFsdWU+PEtleUluZm8+PEtleVZhbHVlPjxSU0FLZXlWYWx1ZT48TW9kdWx1cz5wMjhjVVRub1hHOVVvNzU0cGp3ZFpHSDhtWDRWWlFrQXlrb3Foc0FwdmdZUHlVUUVrQkU2ZDlxc1pMMzZHdjFqRloxdktob25JNmZMRXhWcmJIRG05K0RlS2V6VklacVF2TGlzNjNnM2hybXpSdCtjL29BemE2T1JxZUJWVm1QaENYT3cvSkRyd3hIM0NMWnJsUjFYR3htc3Fsamk3K1ZNMHBDL0NJa2lnLzV0RnUvUEN1VGNUWS9OZi95Zm1NVDk3Tml5OU5uRk5YNWNRcURFWTVsU0NEb295MGhwU0NuY1lRc3VMY1FKQWZZenZ6dzlvb09qRmpZT1V2bWNlbURDMS8wRUU5ZGJXbFdldGZuVk5iOHN6b3FzTEJyTEFEQjFDaFNmbmw5b1FGekdRVmEwUmlKOXhPd1BvSjI1alFkVmltRTE4dlRNWldadG1HTlMycisrT1E9PTwvTW9kdWx1cz48RXhwb25lbnQ+QVFBQjwvRXhwb25lbnQ+PC9SU0FLZXlWYWx1ZT48L0tleVZhbHVlPjxYNTA5RGF0YT48WDUwOUNlcnRpZmljYXRlPk1JSUdSVENDQkMyZ0F3SUJBZ0lRVkFFa2ozeVhSRUk3d0s3S1IvY0hzakFOQmdrcWhraUc5dzBCQVFVRkFEQnBNUXN3Q1FZRFZRUUdFd0pXVGpFVE1CRUdBMVVFQ2hNS1ZrNVFWQ0JIY205MWNERWVNQndHQTFVRUN4TVZWazVRVkMxRFFTQlVjblZ6ZENCT1pYUjNiM0pyTVNVd0l3WURWUVFERXh4V1RsQlVJRU5sY25ScFptbGpZWFJwYjI0Z1FYVjBhRzl5YVhSNU1CNFhEVEUzTURJeU56QTVNekl3TUZvWERURTVNREl5TnpJeE16SXdNRm93Z1lveEN6QUpCZ05WQkFZVEFsWk9NUkl3RUFZRFZRUUlEQWxJdzRBZ1R1RzdtRWt4RlRBVEJnTlZCQWNNREVQaHVxZDFJRWRwNGJxbGVURXNNQ29HQTFVRUF3d2pWazVRVkNCVFQwWlVWMEZTUlNBdElGWk9VRlFnUTBFZ0xTQlVSVk5VSUZOSlIwNHhJakFnQmdvSmtpYUprL0lzWkFFQkRCSk5VMVE2TVRBeE5qZzJPVGN6T0Mwd01USXdnZ0VpTUEwR0NTcUdTSWIzRFFFQkFRVUFBNElCRHdBd2dnRUtBb0lCQVFDbmJ4eFJPZWhjYjFTanZuaW1QQjFrWWZ5WmZoVmxDUURLU2lxR3dDbStCZy9KUkFTUUVUcDMycXhrdmZvYS9XTVZuVzhxR2ljanA4c1RGV3RzY09iMzRONHA3TlVobXBDOHVLenJlRGVHdWJORzM1eitnRE5ybzVHcDRGVldZK0VKYzdEOGtPdkRFZmNJdG11VkhWY2JHYXlxV09MdjVVelNrTDhJaVNLRC9tMFc3ODhLNU54Tmo4MS8vSitZeFAzczJMTDAyY1UxZmx4Q29NUmptVklJT2lqTFNHbElLZHhoQ3k0dHhBa0I5ak8vUEQyaWc2TVdOZzVTK1p4NllNTFgvUVFUMTF0YVZaNjErZFUxdnl6T2lxd3NHc3NBTUhVS0ZKK2VYMmhBWE1aQlZyUkdJbjNFN0ErZ25ibU5CMVdLWVRYeTlNeGxabTJZWTFMYXY3NDVBZ01CQUFHamdnSEZNSUlCd1RCd0JnZ3JCZ0VGQlFjQkFRUmtNR0l3TWdZSUt3WUJCUVVITUFLR0ptaDBkSEE2THk5d2RXSXVkbTV3ZEMxallTNTJiaTlqWlhKMGN5OTJibkIwWTJFdVkyVnlNQ3dHQ0NzR0FRVUZCekFCaGlCb2RIUndPaTh2YjJOemNDNTJibkIwTFdOaExuWnVMM0psYzNCdmJtUmxjakFkQmdOVkhRNEVGZ1FVYkg0aHRGc09iTEQxazBOb0NYanlGVHZaQ1Fzd0RBWURWUjBUQVFIL0JBSXdBREFmQmdOVkhTTUVHREFXZ0JRR2FjRFYxUUtLRlkxR2ZlbDg0bWdLVmF4cXJ6Qm9CZ05WSFNBRVlUQmZNRjBHRGlzR0FRUUJnZTBEQVFFREFRRUNNRXN3SWdZSUt3WUJCUVVIQWdJd0ZoNFVBRThBU1FCRUFDMEFVQUJ5QUMwQU1nQXVBREF3SlFZSUt3WUJCUVVIQWdFV0dXaDBkSEE2THk5d2RXSXVkbTV3ZEMxallTNTJiaTl5Y0dFd01RWURWUjBmQkNvd0tEQW1vQ1NnSW9ZZ2FIUjBjRG92TDJOeWJDNTJibkIwTFdOaExuWnVMM1p1Y0hSallTNWpjbXd3RGdZRFZSMFBBUUgvQkFRREFnVHdNRFFHQTFVZEpRUXRNQ3NHQ0NzR0FRVUZCd01DQmdnckJnRUZCUWNEQkFZS0t3WUJCQUdDTndvRERBWUpLb1pJaHZjdkFRRUZNQndHQTFVZEVRUVZNQk9CRVRGamFIVmpkWFZBWjIxaGFXd3VZMjl0TUEwR0NTcUdTSWIzRFFFQkJRVUFBNElDQVFBeXFpSlB2dmtDTU1GM0JCaVBaM0duZWhud3ZodG1EUkpqWlJSTm1iNTIyTHc4eVNxSXBvNTdnWElTbkxlM3FXeUMwR0NXYVZzL1dKNlRKZzNmQjFHYUhwMnVKRzhoR1YwZzVNSm5nZ0FrV0lISGJraGt5WGxLZC94eHZGN2xDV3NsaDdPTG8vRHdKelBjQVFLZERtb3NETGtMdXRsamlyS2dQMTE4WG1UcEplOWNuaFRHV3htUjQzUlhvMXBLNk1aSlMvMzVBMGFFY1VGd2xreU9KcEZ1eitHcmpxMnFLMllzVHB2TkludzNMWkR3UmtrWWpobUpPRStmdWtxZnA4V0ZjQnRFR3FXRGFCYm1xZ1p2Y2l0OXMrUm9pM1dlT014VUtyaTBmU0FLRGN1eG5mNHJ4aWZRMEJiYXM5SFVtTm02NVZFc20rZjVCMHZkU202UzdYOFpvNTR1UXRSZy9IZDFhQ1B5MEFGZGZhSGkrNmFkcXIyWnEzcHRNSVMxMDdsQ2RxMjZLeU4zUk14WXZoNU5ac2c4OEpjOUlObEd4TDU4V0Q5RUI3TXpGa1dtbkdiOUpjMXVrQUVhUFpBOXZ3WldaVUF0cFdPSWRUeE5tVXZzWmRsVkE5dkRjL1RuSlJiVWswYUN3dnFWV01halBQb3p0OC9DdnpIcXdjT3Vna0Z1YzcrOE05UkZpK1J0WlhBK2tyVE5nblRLSlJIZDE2M2RXc3kzZnB5RlU5UEFjeWt5VEtxRmZpbEZqTmlHODdYME1acnA0bExSY1N1RmtnSFk2ci9pSWtMdkZNNkRJclRKU3hEUDNiWG85akZsOVFPYWJTTmZvUHhLbTQxdTVHcXBlSlhqbE5OQURJK0dOdFdRNmczWjJtdVlXcFM1NE5VZEpOcnlHUHlMeEE9PTwvWDUwOUNlcnRpZmljYXRlPjwvWDUwOURhdGE+PC9LZXlJbmZvPjxPYmplY3Q+PFNpZ25hdHVyZVByb3BlcnRpZXMgeG1sbnM9IiI+PFNpZ25hdHVyZVByb3BlcnR5IElkPSJTaWduaW5nVGltZSIgVGFyZ2V0PSJzaWduYXR1cmVQcm9wZXJ0aWVzIj48U2lnbmluZ1RpbWU+MjAxOC0wMy0wNVQwNDowMzoxMVo8L1NpZ25pbmdUaW1lPjwvU2lnbmF0dXJlUHJvcGVydHk+PC9TaWduYXR1cmVQcm9wZXJ0aWVzPjwvT2JqZWN0PjwvU2lnbmF0dXJlPjwvTGljZW5zZT4=";
    vnpt_plugin.setLicenseKey(key, functionCallback);
}

function checkPluginCallback(data) {
    if (data === "1")
    {
        setLicense(setLicenseCallback);
    }
    else
    {
        $('#loader-content').hide();
        errorMessage("VNPT-CA Plugin chưa được cài đặt hoặc chưa được bật");
    }
}
function checkPlugin(functionCallback)
{
    $('#loader-content').show();
    $('#loading-message').text('Đang kiểm tra cài đặt Vnpt-CA Plugin...');
    vnpt_plugin.checkPlugin(functionCallback);
}