var eventproxy = require('eventproxy');
var UserProxy = require('../proxy').User;
var store = require('../common/store');
var config = require('../config');
var validator = require('validator');
var fs = require('fs');
var path = require('path');

exports.uplodaFile = function (req, res, next) {

	var ep = new eventproxy();
	ep.fail(next);

	var paramsData = {};
	req.pipe(req.busboy);
	req.busboy.on('field', function(fieldname, val, valTruncated, keyTruncated) {
		paramsData[fieldname] = val;
	});

	req.busboy.on('finish', function() {
		console.log('Done parsing form!' + paramsData);
		if (!validator.isNull(paramsData.userId)) {
			ep.emit('userId',paramsData.userId);
		}
		else {
			return res.send({code: '0', msg: '参数错误！'});
		}
    });

	req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
		file.on('limit', function(){
			return res.send({code: '0', msg: '文件过大，最大为' + config.file_limit});
		});
		store.upload(file, {filename: filename}, function(err, result) {
			console.log('bbbbb'+ filename);
			if (err) {
				return next(err);
			}
			ep.emit('upFileUrl',result.url);
		});
	});

	ep.all('userId','upFileUrl',function(userId, fileUrl) {
		UserProxy.getUserById(userId, ep.done(function(user){
			if (!user) {
				return res.send({cdoe: '0',msg: '用户不存在!'});
			}
			res.send({code: '200', msg: 'success', url: fileUrl});
		}));
	});
};


exports.upUserHeader = function(req, res, next){
	var ep = new eventproxy();
	ep.fail(next);

	var paramsData = {};
	req.pipe(req.busboy);
	req.busboy.on('field', function(fieldname, val, valTruncated, keyTruncated) {
		paramsData[fieldname] = val;
	});

	req.busboy.on('finish', function() {
		console.log('Done parsing form!' + paramsData);
		if (!validator.isNull(paramsData.userId)) {
			ep.emit('userId',paramsData.userId);
		}
		else {
			return res.send({code: '0', msg: '参数错误！'});
		}
    });

	req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
		file.on('limit', function(){
			return res.send({code: '0', msg: '文件过大，最大为' + config.file_limit});
		});
		store.uploadHeader(file, {filename: filename}, function(err, result) {
			if (err) {
				return next(err);
			}
			ep.emit('upFileName',result.newFileName);
		});
	});

	ep.all('userId','upFileName',function(userId, fileName) {
		UserProxy.getUserById(userId, ep.done(function(user){
			if (!user) {
				return res.send({cdoe: '0',msg: '用户不存在!'});
			}
			// 文件重命名
			var local_path = config.uploadHeader.filePath;
			var oldfilePath = local_path + fileName;
			var newName = userId + path.extname(fileName);
			var newFilePath = local_path + newName;
			fs.rename(oldfilePath, newFilePath);
			var fileUrl = config.uploadHeader.fileUrl + newName;

			res.send({code: '200', msg: 'success', url: fileUrl});
			user.user_head_url = fileUrl;
			user.save();
		}));
	});
};



