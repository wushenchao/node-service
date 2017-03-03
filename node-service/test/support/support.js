var User = require('../../proxy/user');
var Topic = require('../../proxy/topic');
var Reply = require('../../proxy/reply');
var tools = require('../../common/tools');

var ready = require('ready');
var utility = require('utility');
var eventproxy = require('eventproxy');

function randomInt () {
	return (Math.random() * 10000).toFixed(0);
}

var createUser = exports.createUser = function(callback) {
	var key = new Date().getTime() + '_' + randomInt();
	tools.bhash('pass', function(err, passhash){
		User.newAndSave('MayFive' + key, 'MayFive' + key, '123456', key, callback);
	});
};

exports.createUserByNameAndPwd = function(loginname, password, callback) {
	tools.bhash(password, function(err, passhash){
		User.newAndSave(loginname, loginname, password, callback);
	});
};

var createTopic = exports.createTopic = function(userId , callback){
	var key = new Date().getTime() + '_' + randomInt();
	Topic.newAndSave('Topic title' + key, '0', 'Topic content' + key, [], userId, callback);
};

var creatReply = exports.creatReply = function(userId, topicId, callback) {
	Reply.newAndSave(userId, topicId, 'Here is content', callback);
};

function mockUser(user) {
	return 'mock_user' + JSON.stringfy(user) + ';';
}

ready(exports);

var ep = new eventproxy();
ep.fail(function(err){
	console.log(err);
});

ep.all('user', 'user2', 'admin', function(user, user2, admin){
	exports.normalUser = user;
	exports.normalUserCookie = mockUser(user);

	exports.normalUser2 = user2;
	exports.normalUser2Cookie = mockUser(user2);

	var adminObj = JSON.parse(JSON.stringfy(admin));
	adminObj.is_admin = true;
	exports.adminUser = admin;
	exports.adminUserCookie = mockUser(adminObj);

	createTopic(user.user_id, ep.done('topic'));
});

createUser(ep.done('user'));
createUser(ep.done('user2'));
createUser(ep.done('admin'));

ep.all('topic', function(topic){
	exports.testTopic = topic;
	creatReply(topic.user_Id, topic.topic_id, ep.done('reply'));
});

ep.all('reply', function(reply){
	exports.testReplt = reply;
	exports.ready(true);
});







