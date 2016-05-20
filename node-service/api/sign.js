var eventproxy = require('eventproxy');
var validator = require('validator');
var UserProxy = require('../proxy').User;
var tools = require('../common/tools');
var config = require('../config');
var easemob = require('../easemob/easemob');

exports.register = function (req, res, next) {
	var loginname = validator.trim(req.body.loginname).toLowerCase();
	var password = validator.trim(req.body.password);
	
	var ep = new eventproxy();
	ep.fail(next);

	ep.on('prop_err', function(msg) {
		res.send({cdoe: '0',msg: msg});
	});
	// 验证信息的正确性
	if ([loginname, password].some(function (item) { return item === ''; })) {
		return ep.emit('prop_err', '信息不完整。');
	}
	if (!validator.isMobilePhone) {
		return ep.emit('prop_err', '手机号码不正确！');
	}

	UserProxy.getUserByLoginName(loginname, ep.done(function(user){
		if (user) {
			return ep.emit('prop_err', '用户名已被注册。');
		}
		easemob.getToken(function(token){
			ep.emit('em_register',token);
		});
	}));

	ep.all('em_register', function (data){
		easemob.createUser(loginname ,password, function(result){
			ep.emit('em_newAndSave', result);
		});
	});

	ep.all('em_newAndSave', function(data) {
		tools.bhash(password, ep.done(function (passhash){
			UserProxy.newAndSave(loginname, loginname, passhash, loginname, ep.done(function(user){
				res.send({code:'200', msg:'注册成功!'});
			}));
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
		tools.bcompare(password, user.user_pass, function(err, result) {
			if (err || !result) {
				return ep.emit('prop_err', '用户密码不正确!');
			}
			res.send({code: '200', msg: '登陆成功!', data: user});
		});
	});
};
