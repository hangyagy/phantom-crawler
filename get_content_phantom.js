var page   = require('webpage').create();
var system = require('system');

if ( system.args.length < 2 ) {
  console.log('Usage: ' + system.args[0] + ' url');
  phantom.exit();
}

var url = system.args[1];

page.onConsoleMessage = function (msg) {
  //console.log(msg);
};

page.open(url, function (status) {
  if ( status !== 'success' ) {
    console.log('Unable to access network');
  } else {
    var content = page.evaluate(function() {
      var tags = document.body.getElementsByTagName('*');
      var notAllowed = ['SCRIPT', 'LINK'];
      var content = [];

      var titleNodes = document.getElementsByTagName('title');

      var title = '';

      if ( titleNodes && titleNodes.length > 0 ) {
        title = titleNodes[0].text;
      }

      var metas = document.getElementsByTagName('meta');

      var searchedMetas = ['description', 'keywords'];

      var pageMetas = {};

      for ( var j=0; j<metas.length; j++ ) {
        var meta = metas[j];

        var name = meta.getAttribute('name');

        if ( name && searchedMetas.indexOf(name) !== -1 ) {
          pageMetas[name] = meta.getAttribute('content');
        }

      }

      for ( var i=0; i<tags.length; i++ ) {
        var tag = tags[i];

        if ( (tag.text) && (notAllowed.indexOf(tag.tagName) === -1) ) {
          var parents = [];

          var parentNode = tag.parentNode || null;

          while (parentNode && parentNode.tagName !== 'HTML' && parentNode.tagName !== 'BODY') {
            parents.push(parentNode.tagName);
            parentNode = parentNode.parentNode || null;
          }

          content.push({
            tag: tag.tagName,
            text: tag.text,
            parents: parents
          });
        }
      }


      return {
        title: title,
        metas: pageMetas,
        content: content
      };
    });

    console.log(JSON.stringify(content));
  }

  phantom.exit();
});
