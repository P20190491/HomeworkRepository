const fs = require('fs');

module.exports.addComment = function (id, comment) {
	let comments = JSON.parse(fs.readFileSync('comment.json'))
	if(comments[""+id] === undefined) comments[""+id] = [];
	comments[""+id].push(comment);
	fs.writeFileSync('comment.json', JSON.stringify(comments));
}

module.exports.getComments = function (id) {
	let comments = JSON.parse(fs.readFileSync('comment.json'));
	if(comments[""+id] === undefined) return null;
	return comments[""+id];
}

