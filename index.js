var getContent = require('./modules/get_content');

getContent('http://redrouge.hu')
	.then(function(content) {
		console.log(content);
	})
	.catch(function(err) {
		throw err;
	});
