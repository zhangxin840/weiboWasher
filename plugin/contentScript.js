var requestSelectors = function(){
	chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
  		hideElements(response.selectors);
	});
};

var hideElements = function(selectors){
	var index;
	var selector;
	
	console.log(selectors);
	
	for(index in selectors){
		selector = selectors[index];
		$(selector).hide();
	}
};


requestSelectors();


// chrome.runtime.onMessage.addListener(
  // function(request, sender, sendResponse) {
    // console.log(sender.tab ?
                // "from a content script:" + sender.tab.url :
                // "from the extension");
    // if (request.greeting == "hello")
      // sendResponse({farewell: "goodbye"});
  // });
//   


