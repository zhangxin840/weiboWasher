var storagePerfix = "options_";

// Sample data
var checkOptions = [{
	name : "recommend",
	displayName : "推荐内容",
	checked : true,
}, {
	name : "related",
	displayName : "相关搜索",
	checked : false,
}];

var generateOptions = function() {
	var newOption;
	var index;
	var option;
	var options = checkOptions;

	for (index in options) {
		option = options[index];

		if (!option.name || ( typeof option.checked === "undefined") || !option.displayName) {
			console.log("Option data error");
		} else {
			newOption = $("#options .js-optionContainer.js-template").clone().removeClass("js-template");
			newOption.find("label").attr("for", option.name);
			newOption.find("label").html(option.displayName);
			if (option.checked) {
				newOption.find("input").prop('checked', true);
			} else {
				newOption.find("input").prop('checked', false);
			}
			newOption.find("input").attr("name", option.name);
			$("#options").append(newOption);
		}
	}
};

var checkNeedUpdate = function() {
	var storage = localStorage;
	var last;
	var now = new Date();
	var lastString = storage[pluginSettings.storageLastUpdated];
	var needUpdate = true;

	if (!storage) {
		throw "localStorage not available.";
	}

	if ( typeof lastString === "string") {
		last = new Date(lastString);

		if (Object.prototype.toString.call(last) === "[object Date]" && !isNaN(last.getTime())) {
			if ((now - last) < pluginSettings.updatePeriod) {
				needUpdate = false;
			}
		}
	} else {
		storage[pluginSettings.storageLastUpdated] = now.toString();
	}

	return needUpdate;
};

var syncLocalSettings = function() {
	var storage = localStorage;
	var index;
	var option;
	var options = checkOptions;
	var prefix = storagePerfix;
	var fullName;

	if (!storage) {
		throw "localStorage not available.";
	}

	for (index in options) {
		option = options[index];
		fullName = prefix + option.name;

		// localStorage store boolean as string
		if (storage[fullName] === "true") {
			option.checked = true;
		} else if (storage[fullName] === "false") {
			option.checked = false;
		}
	}
};

var getLoaclOptions = function() {
	var reg = new RegExp('^' + storagePerfix);
	var storage = localStorage;
	var options = [];
	var option;
	var name;
	var innerIndex;

	if (!storage) {
		throw "localStorage not available.";
	}

	for (key in localStorage) {
		if (reg.test(key)) {
			if (key.indexOf("_displayName") < 0) {
				option = {};
				name = key.split("_")[1];
				
				option["name"] = name;
				if (storage[key] === "true") {
					option["checked"] = true;
				} else if (storage[key] === "false") {
					option["checked"] = false;
				}
				
				options.push(option);
			}

		}
	}

	for (key in localStorage) {
		if (reg.test(key) && key.indexOf("_displayName") >= 0) {
			name = key.split("_")[1];
			for (innerIndex in options) {
				if (options[innerIndex].name === name) {
					options[innerIndex].displayName = localStorage[key];
				}
			}

		}
	}

	checkOptions = options;
};

var setupOptions = function() {
	var $options = $(".js-optionContainer").not(".js-template");

	$("#options").on("click", "input", optionCheckChanged);
};

var optionCheckChanged = function() {
	var storage = localStorage;
	var fullName = storagePerfix + $(this).attr("name");

	if (!storage) {
		throw "localStorage not available.";
	}

	if ($(this).prop('checked')) {
		storage[fullName] = "true";

	} else {
		storage[fullName] = "false";
	}
};

getLoaclOptions();
generateOptions();
setupOptions();

