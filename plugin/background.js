var pluginSettings = {
	optionPerfix : "options_",
	storageLastUpdated : "lastUpdated",
	updatePeriod : 86400000, // 86400000 equles one day
	updateUrl : "http://www.zhangxinweb.cn/projects/weiboAdBlocker/data/settings.json",
	preview : false,
	blockOnInterval : false
};

var blockSelectors = [{
	name : "ad_activity",
	type : "ad",
	description : "右侧关于活动的广告",
	selector : "#pl_rightmod_ads35"
}, {
	name : "ad_inline",
	type : "ad",
	description : "插入微博中的广告",
	selector : ".popular_buss.S_line1.S_bg1"
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
	selector : "#trustPagelet_zt_hottopicv5"
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
	selector : "#trustPagelet_recom_interestv5"
}, {
	name : "recommendTopic",
	type : "content",
	description : "右侧推荐话题",
	selector : "div[node-type=recommendTopic]"
}, {
	name : "rightTab",
	type : "content",
	description : "微吧与微刊",
	selector : "#trustPagelet_recom_allinonev5"
}];

var checkOptions = [{
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
	displayName : "微吧与微刊",
	checked : true,
	forceUpdateValue : false
}];

var settings = {
	pluginSettings: pluginSettings,
	blockSelectors: blockSelectors,
	checkOptions: checkOptions
}

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

var saveOptionsToLocal = function() {
	var index;
	var option;
	var storage = localStorage;
	var perfix = pluginSettings.optionPerfix;
	var reg = new RegExp('^' + perfix);
	var fullName;
	var optionKeys = [];

	if (!storage) {
		throw "localStorage not available.";
	}

	for (index in checkOptions) {
		option = checkOptions[index];
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
	var selectors = [];
	var block;

	if (!storage) {
		throw "localStorage not available.";
	}

	for (index in blockSelectors) {
		selector = blockSelectors[index];
		block = false;
		if (selector.type === "ad") {
			if (storage[pluginSettings.optionPerfix + "advertisements"] !== "false") {
				block = true;
			}
		} else if (selector.type === "content") {
			if (storage[pluginSettings.optionPerfix + selector.name] !== "false") {
				block = true;
			}
		}

		if (block === true) {
			selectors.push(selector.selector);
		}
	}

	return selectors;
};

// Show icon
var checkForValidUrl = function(tabId, changeInfo, tab) {
	if (tab.url.match(/weibo.com/)) {
		chrome.pageAction.show(tabId);
	}
};

saveOptionsToLocal();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	var selectors = getSelectors();

	sendResponse({
		settings : pluginSettings,
		selectors : selectors
	});
});

chrome.tabs.onUpdated.addListener(checkForValidUrl);

// Google Analyse
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-XXXXXXXX-X']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script');
	ga.type = 'text/javascript';
	ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(ga, s);
})();

