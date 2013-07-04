/* jshint jquery: true */
/* jshint devel: true */
/* global chrome: false */

(function() {"use strict";

    var STORAGE_PERFIX = "options_";

    // Sample data
    var CHECK_OPTIONS = [{
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
        var options = CHECK_OPTIONS;

        for (index in options) {
            if (options.hasOwnProperty(index)) {
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
        }
    };

    var getLoaclOptions = function() {
        var reg = new RegExp('^' + STORAGE_PERFIX);
        var storage = localStorage;
        var options = [];
        var option;
        var name;
        var innerIndex;
        var key;

        if (!storage) {
            throw "localStorage not available.";
        }

        for (key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                if (reg.test(key)) {
                    if (key.indexOf("_displayName") < 0) {
                        option = {};
                        name = key.substring(key.indexOf("_") + 1);

                        option.name = name;
                        if (storage[key] === "true") {
                            option.checked = true;
                        } else if (storage[key] === "false") {
                            option.checked = false;
                        }

                        options.push(option);
                    }

                }
            }
        }

        for (key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                if (reg.test(key) && key.indexOf("_displayName") >= 0) {
                    name = key.substring(key.indexOf("_") + 1, key.lastIndexOf("_"));
                    for (innerIndex in options) {
                        if (options.hasOwnProperty(innerIndex)) {
                            if (options[innerIndex].name === name) {
                                options[innerIndex].displayName = localStorage[key];
                            }
                        }
                    }
                }
            }
        }

        CHECK_OPTIONS = options;
    };

    var setupOptions = function() {
        $("#options").on("click", "input", optionCheckChanged);
    };

    var optionCheckChanged = function() {
        var storage = localStorage;
        var fullName = STORAGE_PERFIX + $(this).attr("name");
        
        if (!storage) {
            throw "localStorage not available.";
        }

        if ($(this).prop('checked')) {
            storage[fullName] = "true";

        } else {
            storage[fullName] = "false";
        }
    };
    
    var getPluginVersion = function() {
        chrome.extension.sendRequest({}, function(response) {
            var settingsVersion = response.settings.settingsVersion;
            var pluginVersion = response.pluginVersion;
            
            setupUpdateLinks(pluginVersion, settingsVersion);      
        });
    };
    
    var setupUpdateLinks = function(pluginVersion, settingsVersion) {
        $("#versionNumber").html("v" + pluginVersion);
        if(pluginVersion !== settingsVersion){
            $("#link_projectPage").show();
        }
    };
    
    
    getLoaclOptions();
    generateOptions();
    setupOptions();
    getPluginVersion();

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

    // Track UI
    function trackUi(e) {
        _gaq.push(['_trackEvent', e.target.getAttribute("name"), 'clicked']);
    }

    (function() {
        $("[name]").click(trackUi);
    })();

})();

