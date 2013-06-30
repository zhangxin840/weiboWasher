var settings = {
	pluginSettings : {
		optionPerfix : "options_",
		storageLastUpdated : "lastUpdated",
		updatePeriod : 100, // 86400000 equles one day
		updateUrl : "https://raw.github.com/zhangxin840/weiboWasher/master/data/settings.json",
		preview : false,
		blockOnInterval : false
	},
	blockSelectors : [{
		name : "ad_activity",
		type : "ad",
		description : "右侧关于活动的广告",
		selector : "#pl_rightmod_ads35, div#trustPagelet_indexright_recom div[ucardconf^=type][ad-data^=id]"
	}, {
		name : "ad_inline",
		type : "ad",
		description : "插入微博中的广告",
		selector : ".popular_buss.S_line1.S_bg1, div[feedtype=ad]"
	}, {
		name : "ad_centerUp",
		type : "ad",
		description : "中央主广告条",
		selector : "#pl_content_biztips"
	}, {
		name : "ad_recommendItem",
		type : "ad",
		description : "右侧推荐商品广告",
		selector : "#pl_rightmod_ads36"
	}, {
		name : "ad_footer",
		type : "ad",
		description : "中间页低广告",
		selector : ".footer_adv"
	}, {
		name : "members",
		type : "content",
		description : "右侧会员专区与会员动态",
		selector : "#trustPagelet_recom_memberv5"
	}, {
		name : "hotTopic",
		type : "content",
		description : "右侧热门话题",
		selector : "#trustPagelet_zt_hottopicv5",
		jqSelector: "div.WB_right_module:has(a[href^='http://huati.weibo.com/'])"
	}, {
		name : "announcement",
		type : "content",
		description : "右侧微博公告",
		selector : "#pl_rightmod_noticeboard"
	}, {
		name : "recentApp",
		type : "content",
		description : "左侧最近使用过的应用",
		selector : "#pl_leftnav_app"
	}, {
		name : "interestedPeople",
		type : "content",
		description : "右侧感兴趣的人",
		selector : "#trustPagelet_recom_interestv5",
		jqSelector: "div.WB_right_module:has(a[href^='http://weibo.com/find/i'])"
	}, {
		name : "recommendTopic",
		type : "content",
		description : "右侧推荐话题",
		selector : "div[node-type=recommendTopic]"
	}, {
		name : "rightTab",
		type : "content",
		description : "微吧 微刊 应用推荐",
		selector : "#trustPagelet_recom_allinonev5",
		jqSelector :  "div.WB_right_module:has(a[href^='http://app.weibo.com/'], a[href^='http://weiba.weibo.com/'], a[href^='http://kan.weibo.com/'])"
	}, {
		name : "notification_leftTop",
		type : "content",
		description : "左上方红点提醒",
		selector : "i.W_new"
	}, {
		name : "notification_group",
		type : "content",
		description : "分组提醒",
		selector : "em.W_new_count"
	}],
	checkOptions : [{
		name : "advertisements",
		displayName : "页面广告",
		checked : true,
		forceUpdateValue : false
	}, {
		name : "interestedPeople",
		displayName : "可能感兴趣的人",
		checked : false,
		forceUpdateValue : false
	}, {
		name : "recentApp",
		displayName : "最近使用的应用",
		checked : false,
		forceUpdateValue : false
	}, {
		name : "members",
		displayName : "会员推荐",
		checked : true,
		forceUpdateValue : false
	}, {
		name : "recommendTopic",
		displayName : "顶端推荐话题",
		checked : false,
		forceUpdateValue : false
	}, {
		name : "hotTopic",
		displayName : "热门话题",
		checked : false,
		forceUpdateValue : false
	}, {
		name : "announcement",
		displayName : "微博公告",
		checked : true,
		forceUpdateValue : false
	}, {
		name : "rightTab",
		displayName : "微吧 微刊 应用推荐",
		checked : true,
		forceUpdateValue : false
	}, {
		name : "notification_group",
		displayName : "分组提醒",
		checked : false,
		forceUpdateValue : false
	}]
};

var checkNeedUpdate = function() {
	var storage = localStorage;
	var last;
	var now = new Date();
	var lastString = storage[settings.pluginSettings.storageLastUpdated];
	var needUpdate = true;

	if (!storage) {
		throw "localStorage not available.";
	}

	if ( typeof lastString === "string") {
		last = new Date(lastString);

		if (Object.prototype.toString.call(last) === "[object Date]" && !isNaN(last.getTime())) {
			if ((now - last) < settings.pluginSettings.updatePeriod) {
				needUpdate = false;
			}
		}
	}

	return needUpdate;
};

var saveSettingsToLocal = function() {
	var storage = localStorage;
	var settingsKey = "settings";

	if ( typeof settings !== "object") {
		throw "settings data error";
	}
	if (!storage) {
		throw "localStorage not available.";
	}

	localStorage[settingsKey] = JSON.stringify(settings);
};

var getSettingsFromLocal = function() {
	var settingsKey = "settings";
	var parsedSettings;
	var storage = localStorage;

	if (!storage) {
		throw "localStorage not available.";
	}

	if (!storage[settingsKey]) {
		return;
	}

	try {
		parsedSettings = JSON.parse(storage[settingsKey]);
	} catch(e) {
		throw "Can not parse settings data."
	}

	if (parsedSettings) {
		settings = parsedSettings;
	}
};

var updateSettings = function() {
	var xhr = new XMLHttpRequest();
	var result;
	var storage = localStorage;

	if (!storage) {
		throw "localStorage not available.";
	}

	xhr.open("GET", settings.pluginSettings.updateUrl, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			try {
				result = JSON.parse(xhr.responseText);
			} catch(e) {
				throw "Update settings data error";
			}

			settings = result;
			saveSettingsToLocal();
			saveOptionsToLocal();
			storage[settings.pluginSettings.storageLastUpdated] = (new Date()).toString();
		}
	}
	xhr.send();
};

var saveOptionsToLocal = function() {
	var index;
	var option;
	var storage = localStorage;
	var perfix = settings.pluginSettings.optionPerfix;
	var reg = new RegExp('^' + perfix);
	var fullName;
	var optionKeys = [];

	if (!storage) {
		throw "localStorage not available.";
	}

	for (index in settings.checkOptions) {
		option = settings.checkOptions[index];
		fullName = perfix + option.name;

		optionKeys.push(fullName);

		if (!storage[fullName] || option.forceUpdateValue) {
			storage[fullName] = option.checked;
		}

		storage[fullName + "_" + "displayName"] = option.displayName;

		optionKeys.push(fullName + "_" + "displayName");
	}

	// Remove option items not in checkOptions
	for (index in localStorage) {
		if (reg.test(index)) {
			if (optionKeys.indexOf(index) < 0) {
				localStorage.removeItem(index);
			}
		}
	}
};

var getSelectors = function() {
	var storage = localStorage;
	var selector;
	var index;
	var block;
	var result = {
		selectors: [],
		jqSelectors: []
	};

	if (!storage) {
		throw "localStorage not available.";
	}

	for (index in settings.blockSelectors) {
		selector = settings.blockSelectors[index];
		block = false;
		if (selector.type === "ad") {
			if (storage[settings.pluginSettings.optionPerfix + "advertisements"] === "true") {
				block = true;
			}
		} else if (selector.type === "content") {
			if (storage[settings.pluginSettings.optionPerfix + selector.name] === "true") {
				block = true;
			}
		}

		if (block === true) {
			if(selector.selector){
				result.selectors.push(selector.selector);
			}
			
			if(selector.jqSelector){
				result.jqSelectors.push(selector.jqSelector);
			}
				
		}
	}
	
	return result;
};

var initialize = function() {
	getSettingsFromLocal();

	saveOptionsToLocal();
	saveSettingsToLocal();

	if (checkNeedUpdate()) {
		updateSettings();
	}

	chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		var selectors = getSelectors();

		sendResponse({
			settings : settings.pluginSettings,
			selectors : selectors
		});
	});

	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
		if (tab.url.match(/weibo.com/)) {
			chrome.pageAction.show(tabId);
		}
	});
};

initialize();

// Google Analyse
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-41995758-1']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script');
	ga.type = 'text/javascript';
	ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(ga, s);
})();
