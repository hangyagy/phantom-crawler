var page   = require('webpage').create();
var system = require('system');

if ( system.args.length < 2 ) {
  console.log('Usage: ' + system.args[0] + ' url');
  phantom.exit();
}

var url = system.args[1];

page.onConsoleMessage = function (msg) {
	console.log(msg);
};

page.open(url, function (status) {
  if ( status !== 'success' ) {
    console.log('Unable to access network');
  } else {
    var content = page.evaluate(function() {
		var tags = document.body.getElementsByTagName('*');
		var notAllowed = ['SCRIPT', 'LINK'];
		var content = [];

		for ( var i=0; i<tags.length; i++ ) {
			var tag = tags[i];

			if ( (tag.text) && (notAllowed.indexOf(tag.tagName) === -1) ) {
				content.push({
					tag: tag.tagName,
					text: tag.text
				});
			}
		}

		return content;
    });

	console.log(JSON.stringify(content));
  }

  phantom.exit();
});
