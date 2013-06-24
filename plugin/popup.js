var storagePerfix = "options_";

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

// var sendBackToPlugin = function() {
// chrome.runtime.sendMessage(blockSettings.checkOptions, function(response) {
//
// });
// };
var setupOptions = function() {
	var $options = $(".js-optionContainer").not(".js-template");

	$("#options").on("click", "input", optionCheckChanged);
};

var optionCheckChanged = function() {
	var storage = localStorage;
	var fullName = storagePerfix + $(this).attr("name");
	var options = checkOptions;

	if (!storage) {
		throw "localStorage not available.";
	}

	if ($(this).prop('checked')) {
		storage[fullName] = "true";

	} else {
		storage[fullName] = "false";
	}
};

//checkNeedUpdate();
syncLocalSettings();
generateOptions();
setupOptions();

