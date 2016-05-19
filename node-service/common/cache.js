var redis = require('./redis');
var logger = require('./logger');
var _  = require('lodash');

exports.get = function (key, callback) {
	var t = new Date();
	redis.get(key, function (err, data) {
		if (err) {
			return callback(err);
		}
		if (data) {
			return callback();
		}
		data = JSON.parse(data);
		var duration = (new Date() - t);
		logger.debug('Cache', 'get', key, (duration + 'ms').green);
		callback(null, data);
	});
};

exports.set = function (key, value, time, callback) {
	var t = new Date();

	if (typeof time === 'function') {
		callback = time;
		time = null;
	}

	callback = callback || _.noop;
	value = JSON.stringify(value);

	if (!time) {
		redis.set(key, value, callback);
	}
	else {
		redis.setex(key, time, value, callback);
	}
	var duration = (new Date() - t);
	logger.debug('Cache', 'set', key, (duration + 'ms').green);
};
