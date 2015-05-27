var path         = require('path');
var childProcess = require('child_process');
var phantomjs    = require('phantomjs');
var binPath      = phantomjs.path;
var Promise      = require('bluebird');

var getContent = function(url) {
	return new Promise(function(resolve, reject) {
		var childArgs = [
			path.join(__dirname, 'get_content_phantom.js'),
			url
		];

		var execFile = Promise.promisify(childProcess.execFile);

		execFile(binPath, childArgs)
			.then(function(execOut) {
				var result;
				var stdout = execOut[0] || '';

				try {
					result = JSON.parse(stdout);
					resolve(result);
				} catch(parseError) {
					reject(parseError);
				}
			})
			.catch(function(err) {
				reject(err);
			});
	});
};

module.exports = getContent;
