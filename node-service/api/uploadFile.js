var eventproxy = require('eventproxy');
var UserProxy = require('../proxy').User;
var store = require('../common/store');
var config = require('../config');
var validator = require('validator');

exports.uplodaFile = function (req, res, next) {

	var ep = new eventproxy();
	ep.fail(next);

	req.pipe(req.busboy);
	var data = {};
	req.busboy.on('field', function(fieldname, val, valTruncated, keyTruncated) {
		data[fieldname] = val;
	});

	req.busboy.on('finish', function() {
		console.log('Done parsing form!' + data);
		if (!validator.isNull(data.userId)) {
			ep.emit('userId',data.userId);
		}
    });

	ep.all('userId',function(userId){
		UserProxy.getUserById(userId, ep.done(function(user){
			if (!user) {
				return res.send({cdoe: '0',msg: '用户不存在!'});
			}
			ep.emit('upFile',user);
		}));
	});

	ep.all('upFile', function(user){
		req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
			file.on('limit', function(){
				return res.send({code: '0', msg: '文件过大，最大为' + config.file_limit});
			});
			store.upload(file, {filename: filename}, function(err, result) {
				if (err) {
					return next(err);
				}
				return res.send({code: '200', msg: 'success', url: result.url});
			});
		});
	});
};
