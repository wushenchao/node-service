var eventproxy = require('eventproxy');
var validator = require('validator');
var ReplyProxy = require('../proxy').Reply;
var UserProxy = require('../proxy').User;
var TopicProxy = require('../proxy').Topic;
var tools = require('../common/tools');
var _ = require('lodash');
var config = require('../config');

exports.replyTopic = function (req, res, next) {
	var userId = req.body.userId;
	var topicId = req.body.topicId;
	var content = req.body.content;

	var ep = new eventproxy();
	ep.fail(next);
	ep.on('prop_err', function(msg){
		res.send({code:'0', msg: msg});
	});
	UserProxy.getUserById(userId, ep.done(function(user){
		if (!user) {
			return ep.emit('prop_err', '用户不存在!');
		}
		ep.emit('user', user);
	}));

	TopicProxy.getTopicById(topicId, ep.done(function(topic){
		if (!topic) {
			return ep.emit('prop_err', '事件不存在');
		}
		ep.emit('topic', topic);
	}));

	ep.all('user','topic', function(user, topic){
		ReplyProxy.newAndSave(userId, topicId, content, function(err){
			if (err) {
				return ep.emit('prop_err', '回复内容插入失败!');
			}
			var replyUsers = topic.topic_replyUsers;
			if (_.indexOf(replyUsers, userId) < 0){
				replyUsers.push(userId);
			}
			topic.topic_replyNumber +=1;
			topic.save();
			res.send({code: '200', msg:'success'});
		});
	});
};