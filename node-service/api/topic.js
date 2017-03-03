var eventproxy = require('eventproxy');
var validator = require('validator');
var TopicProxy = require('../proxy').Topic;
var UserProxy = require('../proxy').User;
var _ = require('lodash');
var fs = require('fs');
var path = __dirname + '/data.txt';

/**
 * 发送话题
 */
exports.sendTopic = function(req, res, next) {
	var userId = validator.trim(req.body.userId);
	var topicTitle = validator.trim(req.body.topicTitle);
	var topicContent = validator.trim(req.body.topicContent);
	var topicType = req.body.topicType;
	var topicImages = req.body.topicImages;//字符串
	var images = [];
	if (!validator.isNull(topicImages)) {
		images = _.split(topicImages,',');
	}
	TopicProxy.newAndSave(topicTitle, topicType, topicContent, images, userId, function(err) {
		if (err) {
			return res.send({
				code: '0',
				msg: '数据保存失败'
			});
		}
		res.send({
			code: '200',
			msg: 'success'
		});
	});
};

/**
 * 给话题点赞
 */
exports.praiseTopic = function(req, res, next) {
	var userId = req.body.userId;
	var topicId = req.body.topicId;
	console.log('userId:' + userId + ' topicId:' + topicId);

	var ep = new eventproxy();
	ep.fail(next);
	ep.on('prop_err', function(msg) {
		res.send({
			code: '0',
			msg: msg
		});
	});

	TopicProxy.getTopicById(topicId, ep.done(function(topic){
		if (!topic) {
			return ep.emit('prop_err','事件不存在！');
		}
		ep.emit('topic',topic);
	}));

	UserProxy.getUserById(userId, ep.done(function(user){
		if (!user) {
			return ep.emit('prop_err','用户不存在！');
		}
		ep.emit('user',user);
	}));

	ep.all('user','topic',function(user, topic){
		var pariseUser = topic.topic_praiseUser;
		var userId = user.user_id;
		if (_.indexOf(pariseUser, user.user_id) >= 0) {
			return ep.emit('prop_err','您已经点过赞了！');
		}
		topic.topic_praiseNumber += 1;
		topic.topic_praiseUser.push(user.user_id);
		topic.save();
		res.send({
			code:'200',
			msg : 'success'
		});
	});
};

/**
 * 按时间排序获取数据库话题
 */
exports.getTopics = function(req, res, next) {
	var page = req.body.page;
	var limit = req.body.limit;
	var topicId = req.body.topicId;

	TopicProxy.getTopics(topicId, page, limit, function(err, topics){
		if (err) {
			return res.send({
				code: '0',
				msg: '查询错误'
			});
		}
		res.send({
			code: '200',
			msg: 'success',
			data: topics
		});
	});
};

/**
 * 获取具体用户的事件
 */
exports.getOwnTopics = function(req, res, next) {
	var userId = req.body.userId;
	var page = req.body.page;
	var limit = req.body.limit;

	var ep = new eventproxy();
	ep.fail(next);

	ep.on('prop_err', function(msg) {
		res.send({
			code: '0',
			msg: msg
		});
	});

	UserProxy.getUserById(userId, ep.done(function(user){
		if (!user) {
			return ep.emit('prop_err', '用户不存在!');
		}
		ep.emit('user', user);
	}));

	ep.all('user', function(user){
		TopicProxy.getOwnTopics(userId , page, limit, function(err, topics){
			if (err) {
				return ep.emit('prop_err', '获取话题失败!');
			}
			res.send({
				code: '200',
				msg: 'success',
				data: topics
			});
		});
	});
};

/**
 * 删除话题
 */
exports.removeTopic = function(req, res, next){
	var userId = req.body.userId;
	var topicId = req.body.topicId;

	var ep = new eventproxy();
	ep.fail(next);

	ep.on('prop_err', function(msg) {
		res.send({
			code: '0',
			msg: msg
		});
	});

	UserProxy.getUserById(userId, ep.done(function(user){
		if (!user) {
			return ep.emit('prop_err', '用户不存在!');
		}
		ep.emit('user', user);
	}));

	ep.all('user', function(user) {
		TopicProxy.removeByTopicId(topicId, userId, function(err){
			if (err) {
				return ep.emit('prop_err', '删除话题失败!');
			}
			res.send({
				code: '200',
				msg: 'success'
			});
		});
	});
};


//////////////////////////////////////////////////////////////////////////////////
// GET
exports.textSendTopic = function(req, res, next) {
	var userId = req.params.userId;
	// var userId = validator.trim(req.body.userId);
	var ep = new eventproxy();
	ep.fail(next);

	ep.on('prop_err', function(msg) {
		res.send({cdoe: '0',msg: msg});
	});

	ep.all('save_result', function (err) {
		if (err) {
			return ep.emit('prop_err', '数据保存失败!');
		}
		res.send({code:'200', msg : 'success'});
	});

	fs.readFile(path, 'utf-8', function(err, data){
		if (err) {
			return ep.emit('prop_err', '解析数据失败!');
		}
		var objs = JSON.parse(data);
		console.log('objs: ', objs);
		ep.emit('objs', objs);
	});

	ep.all('objs', function(objs){
		var epfill = new eventproxy();
		epfill.fail(next);

		epfill.after('event_save', objs.length ,function(err){
			ep.emit('save_result', err);
		});
		objs.forEach(function (obj){
			var ev_title = obj['ev_title'];
			var ev_time = obj['ev_time'];
			var ev_content = obj['ev_content'];
			var ev_images = obj['ev_images'];
			TopicProxy.newAndSaveEnvent(ev_title, ev_time, ev_content, ev_images, userId, epfill.group('event_save'));
		});
	});
};
