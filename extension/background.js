console.log('start')

chrome.webNavigation.onCompleted.addListener(function() {
	chrome.tabs.executeScript({
		file: 'script.js'
	});
}, {url: [{hostContains : 'cafebaluk.by'}]});
