var eventproxy = require('eventproxy');
var validator = require('validator');
var UserProxy = require('../proxy').User;
var tools = require('../common/tools');

exports.register = function (req, res, next) {
	var loginname = validator.trim(req.body.loginname).toLowerCase();
	var email = validator.trim(req.body.email).toLowerCase();
	var password = validator.trim(req.body.password);

	var ep = new eventproxy();
	ep.fail(next);

	ep.on('prop_err', function(msg) {
		res.send({cdoe: '0',msg: msg});
	});
	// 验证信息的正确性
	if ([loginname, password, email].some(function (item) { return item === ''; })) {
		return ep.emit('prop_err', '信息不完整。');
	}

	if (loginname.length < 5) {
		return ep.emit('prop_err', '用户名至少需要5个字符。');
	}

	if (!validator.isEmail(email)) {
		return ep.emit('prop_err', '邮箱不合法。');
	}

	UserProxy.getUsersByQuery({'$or':[{'loginname': loginname},{'email': email}]},
		{}, function(err, users){
			if (err) {
				return next(err);
			}
			if (users.length > 0) {
				return ep.emit('prop_err', '用户名或邮箱已被使用。');
			}
			tools.bhash(password, ep.done(function (passhash){
				UserProxy.newAndSave(loginname, loginname, passhash, email, false, function (err){
					if (err) {
						return next(err);
					}
					res.send({code:'200', msg:'注册成功!'});
				});
			}));
	});
};

exports.login = function(req, res, next) {
	var loginname = validator.trim(req.body.loginname).toLowerCase();
	var password = validator.trim(req.body.password);

	var ep = new eventproxy();
	ep.fail(next);

	ep.on('prop_err', function(msg) {
		res.send({cdoe: '0',msg: msg});
	});
	// 验证信息的正确性
	if ([loginname, password].some(function (item) { return item === ''; })) {
		return ep.emit('prop_err', '用户名密码不能为空。');
	}

	UserProxy.getUserByLoginName(loginname, function(err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return ep.emit('prop_err', '用户不存在!');
		}
		tools.bcompare(password, user.pass, function(err, result) {
			if (err || !result) {
				return ep.emit('prop_err', '用户密码不正确!');
			}
			res.send({code: '200', msg: '登陆成功!', data: user});
		});
	});
};
