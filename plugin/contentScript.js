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

var blockElements = function(selectors) {
	var index;
	var selector;
	var style;
	var $target;

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

	style = '<style type="text/css">'
	style += selectors.join(", \n") + '\n';
	style += '{ display: none !important }';
	style += '</style>';

	$("body").append(style);

	console.log(style);
};

requestSelectors();

