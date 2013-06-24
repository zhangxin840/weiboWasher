var pluginSettings = {
	storagePerfix : "options_",
	storageLastUpdated : "lastUpdated",
	updatePeriod : 86400000, // One day
	updateUrl : "http://www.zhangxinweb.cn/projects/weiboAdBlocker/data/settings.json"
};

var storagePerfix = "options_";

var adSelectors = [
	{
		name : "activity",
		selector : "#pl_rightmod_ads35"
	},
	{
		name : "members",
		selector : "#trustPagelet_recom_memberv5"
	},
	{
		name : "rightTab",
		selector : "#trustPagelet_recom_allinonev5"
	},
	{
		name : "recommendItem",
		selector : "#pl_rightmod_ads36"
	},
	{
		name : "topic",
		selector : "#trustPagelet_zt_hottopicv5"
	},
	{
		name : "announcement",
		selector : "#pl_rightmod_noticeboard"
	},
	{
		name : "footerAd",
		selector : ".footer_adv"
	}
];


function checkForValidUrl(tabId, changeInfo, tab) {
	if (tab.url.match(/weibo.com/)) {
		chrome.pageAction.show(tabId);
	}
};

var getSelectors = function() {
	var storage = localStorage;
	var blockItem;
	var index;
	var selectors = [];

	if (!storage) {
		throw "localStorage not available.";
	}

	for (index in adSelectors) {
		blockItem = adSelectors[index];
		if (storage[storagePerfix + blockItem.name] !== "false") {
			selectors.push(blockItem.selector);
		}
	}

	return selectors;
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	var selectors = getSelectors();
	
	sendResponse({
		selectors : selectors
	});
});

chrome.tabs.onUpdated.addListener(checkForValidUrl);

