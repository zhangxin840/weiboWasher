/* global chrome: false */
/* jshint jquery: true */
/* jshint devel: true */

(function() {"use strict";

    var SETTINGS = {
        preview : true,
        blockOnInterval : true
    };

    var requestSelectors = function() {
        chrome.extension.sendRequest({}, function(response) {
            SETTINGS = response.settings;
            blockElements(response.selectors);

            if (SETTINGS.blockOnInterval) {
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

        if (SETTINGS.preview) {
            for (index in selectors) {
                if (selectors.hasOwnProperty(index)) {
                    $target = $(selectors[index]);
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
            }
            return;
        }

        for (index in selectors) {
            if (selectors.hasOwnProperty(index)) {
                selector = selectors[index];

                style = '<style type="text/css">' + '\n';
                style += selector + '\n';
                style += '{ display: none !important }' + '\n';
                style += '</style>';

                $("body").append(style);
            }
        }

        for (index in jqSelectors) {
            if (jqSelectors.hasOwnProperty(index)) {
                jqSelector = jqSelectors[index];
                $(jqSelector).hide();
            }
        }

        $('#Box_right').on('DOMSubtreeModified', function() {
            var index;
            for (index in jqSelectors) {
                if (jqSelectors.hasOwnProperty(index)) {
                    $(jqSelectors[index]).hide();
                }
            }
        });

        $(document).ready(function() {
            var index;
            for (index in jqSelectors) {
                if (jqSelectors.hasOwnProperty(index)) {
                    $(jqSelectors[index]).hide();
                }
            }
        });

        console.log(resultGetSelectors);
    };

    requestSelectors();

})();

