var settings = {
	preview : true,
	blockOnInterval : true
};

var requestSelectors = function() {
	chrome.extension.sendRequest({}, function(response) {
		settings = response.settings;
		blockElements(response.selectors);

		if (settings.blockOnInterval) {
			setInterval(function() {
				blockElements(response.selectors);
			}, 1000);
		}
	});
};

var blockElements = function(resultGetSelectors) {
	var index;
	var selector;
	var jqSelector;
	var style;
	var $target;
	var selectors = resultGetSelectors.selectors;
	var jqSelectors = resultGetSelectors.jqSelectors;

	if (settings.preview) {
		for (index in selectors) {
			$target = $(selectors[index])
			if ($target.attr("blocked") !== "true") {
				$target.css({
					position : "relative",
					backgroundColor : "rgba(255, 0, 0, .6)"
				}).attr("blocked", "true");

				$("<div>").css({
					position : "absolute",
					backgroundColor : "rgba(255, 0, 0, .4)",
					top : 0,
					left : 0,
					width : "100%",
					height : "100%",
					zindex : 10000
				}).appendTo($target);
			}
		}
		return;
	}

	for (index in selectors) {
		selector = selectors[index];

		style = '<style type="text/css">' + '\n';
		style += selector + '\n';
		style += '{ display: none !important }' + '\n';
		style += '</style>';

		$("body").append(style);
	}

	for (index in jqSelectors) {
		jqSelector = jqSelectors[index];
		$(jqSelector).hide();
	}
	
	$('#Box_right').on('DOMSubtreeModified',function(){
		var index;
		for (index in jqSelectors) {
			$(jqSelectors[index]).hide();
		}
	});
	
	$(document).ready(function(){
		var index;
		for (index in jqSelectors) {
			$(jqSelectors[index]).hide();
		}
	});	console.log(resultGetSelectors);
};

requestSelectors();
