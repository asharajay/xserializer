/* xserialize jQuery plugin 1.2 | (c) 2014 - 2015, 
 * Author: Jay Ashara 
*/
$.fn.xserialize = function (callback, options) {
	/* Eg. $(".divForm").xserialize(function(jsondata){
		// you can use jsondata as object of json with properties that you have use as attribute "data-xname"
	}); */
    var settings = $.extend({ PageIndex: 1, SortBy: '', SortDirection: '' }, options);
    if (typeof (options) === "undefined" || options == null) { settings = {}; }
    var jsondata = settings;
    var obj = this;
    var tempRadioList = [];
    $(obj).find("input[type='text'],input[type='password'],input[type='checkbox'],input[type='radio'],input[type='hidden'],input[type='tel'],input[type='email'],select,textarea").each(function () {
        var Name = $(this).attr("data-xname");
        if (typeof (Name) !== "undefined" && Name != "" && $.trim(Name) != "" && Name != null) {
            var itemValue = $.trim($(this).val());
            if (itemValue == "") { itemValue = null; }
            else { itemValue = "\"" + itemValue + "\""; }
            if (itemValue != null) itemValue = itemValue.replace(/"/ig, "\"");
            if (!$(this).is(":input[type='radio']") && !$(this).is(":input[type='checkbox']"))
                jsondata = $.extend(JSON.parse("{ \"" + Name + "\":" + itemValue + "}"), jsondata);
            else if ($(this).is(":input[type='radio']")) {
                if ($(this).is(":input[type='radio']:checked"))
                    jsondata = $.extend(JSON.parse("{ \"" + Name + "\":" + itemValue + "}"), jsondata);
                else {
                    if ($.inArray(Name, tempRadioList, 0) < 0) {
                        tempRadioList.push(Name);
                        jsondata = $.extend(JSON.parse("{ \"" + Name + "\": null}"), jsondata);
                    }
                }
            }
            else if ($(this).is(":input[type='checkbox']"))
                jsondata = $.extend(JSON.parse("{ \"" + Name + "\": " + $(this).is(":checked") + "}"), jsondata);
            else if ($(this).is(":textarea"))
                jsondata = $.extend(JSON.parse("{ \"" + Name + "\": " + $.trim($(this).html()).replace(/"/ig, "\"") + "}"), jsondata);
            else
                jsondata = $.extend(JSON.parse("{ \"" + Name + "\":" + itemValue + "}"), jsondata);
        }
    });
    if (typeof (callback) !== "function") {
        return jsondata;
    }
    else {
        callback(jsondata);
    }
}
/* Eg. $(".divForm").xdeserialize({Data: [OBJECT] }); */
$.fn.xdeserialize = function (options) {
    var settings = $.extend({ PageIndex: 1, SortBy: '', SortDirection: '', Data: null }, options);
    if (typeof (options) === "undefined" || options == null) { settings = { Data: null }; }
    var jsondata = settings;
    var obj = this;
    var tempRadioList = [];
    if (settings.Data == null) return;
    $(obj).find("*[data-xname]").each(function () {
        var Name = $(this).attr("data-xname");
        if (settings.Data[Name] != null && settings.Data[Name] != "undefined") {
            if ($(this).is(":input[type='checkbox']") || $(this).is(":input[type='radio']")) {
                var eleName = $(this).attr("name");
                $("input[name='" + eleName + "'][value='" + settings.Data[Name] + "']").prop("checked", true);
            } else if ($(this).is("textarea")) {
                $(this).html($.trim(settings.Data[Name]));
            }
            else if ($(this).is("label") || $(this).is("span")) {
                $(this).text($.trim(settings.Data[Name]));
            }
            else {
                $(this).val($.trim(settings.Data[Name]));
            }
        }
    });
}