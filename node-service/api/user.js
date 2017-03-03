var eventproxy = require('eventproxy');
var UserProxy = require('../proxy').User;
var tools = require('../common/tools');

var crypto = require('crypto');
var API_KEY = "sk_test_ibbTe5jLGCi5rzfH4OqPW9KC";
var APP_ID = "app_DOGaT8SiLur5OaXz";
var pingpp = require('pingpp')(API_KEY);

pingpp.setPrivateKeyPath(__dirname + '/your_rsa_private_key.pem');

exports.userPay = function(req, res, next) {
	console.log('cmb_wallet');
	var channel = 'cmb_wallet';
	var order_no = crypto.createHash('md5')
			.update(new Date().getTime().toString())
			.digest('hex').substr(0, 16);

	pingpp.charges.create({
		order_no:  order_no,
		app:       { id: APP_ID },
		channel:   channel,// 支付使用的第三方支付渠道取值，请参考：https://www.pingxx.com/api#api-c-new
		amount:    1,//订单总金额, 人民币单位：分（如订单总金额为 1 元，此处请填 100）
		client_ip: "127.0.0.1",// 发起支付请求客户端的 IP 地址，格式为 IPV4，如: 127.0.0.1
		currency:  "cny",
		subject:   "测试招行",
		body:      "Your Body"
	}, function(err, charge){
		console.log(err);
		console.log(charge);// 输出 Ping++ 返回的支付凭据 Charge
		res.send({'err':err,'charge':charge});
	});
};


exports.userInfo = function (req, res, next) {
	var loginname = req.params.name;
	// var loginname = req.body.name;
	console.log(loginname);
	var ep = new eventproxy();
	ep.fail(next);

	UserProxy.getUserByLoginName(loginname, ep.done(function(user){
		if (!user) {
			return res.send({
				cdoe: '0',
				msg: loginname + '不存在.'
			});
		}
		res.send({
			code: '200',
			msg: 'success',
			data: user
		});
	}));
};
