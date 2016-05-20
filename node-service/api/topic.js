var eventproxy = require('eventproxy');
var validator = require('validator');
var TopicProxy = require('../proxy').Topic;
var tools = require('../common/tools');
var fs = require('fs');

var path = __dirname + '/data.txt';

exports.sendTopic = function(req, res, next) {
	var userId = validator.trim(req.body.userId);
	var topicTitle = validator.trim(req.body.topicTitle);
	var topicContent = validator.trim(req.body.topicContent);
	var topicImages = req.body.topicImages;

	TopicProxy.newAndSave(topicTitle, '', topicContent, topicImages, userId, function(err){
		if (err) {
			return res.send({cdoe: '0',msg: '数据保存失败'});
		}
		res.send({cdoe: '200',msg: 'success'});
	});
};

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
		var obj = JSON.parse(data);
		console.log('obj: ', obj);
		ep.emit('obj', obj);
	});

	ep.all('obj', function(obj){
		var epfill = new eventproxy();
		epfill.fail(next);

		epfill.after('event_save', obj.length ,function(err){
			ep.emit('save_result', err);
		});
		obj.forEach(function (evObj){
			var ev_title = evObj['ev_title'];
			var ev_time = evObj['ev_time'];
			var ev_content = evObj['ev_content'];
			var ev_images = evObj['ev_images'];
			TopicProxy.newAndSave(ev_title, ev_time, ev_content, ev_images, userId, epfill.group('event_save'));
		});
	});
};
