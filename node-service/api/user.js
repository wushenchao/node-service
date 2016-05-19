var eventproxy = require('eventproxy');
var UserProxy = require('../proxy').User;
var tools = require('../common/tools');

var userInfo = function (req, res, next) {
	var loginname = req.params.name;
	var ep = new eventproxy();
	ep.fail(next);

	UserProxy.getUserByLoginName(loginname, ep.done(function(user){
		if (!user) {
			return res.send({cdoe: '0',msg: 'user `' + loginname + '` is not exists.'});
		}
		
		res.send({code: '200',msg: '请求成功!',data: user});
	}));
};

exports.userInfo = userInfo;
