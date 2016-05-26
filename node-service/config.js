var path = require('path');

var config = {
	debug: true,

	get mini_assets(){return !this.debug;},

	host: 'localhost',

	// mongodb configure
	db: 'mongodb://127.0.0.1/node_club_dev',

	// redis configure
	redis_host: '127.0.0.1',
	redis_port: 6379,
	redis_db: 0,

	// 程序运行端口
	port: 3000,
	
	// file
	upload: {
		filePath: __dirname + '/public/upload/',
		fileUrl: '/public/upload/'
	},

	// 头像
	uploadHeader: {
		filePath: __dirname + '/public/uploadHeader/',
		fileUrl: '/public/uploadHeader/'
	},

	file_limit: '1MB',

	session_secret: 'node_club_secret', // 务必修改
	auth_cookie_name: 'node_club',

	// 话题列表显示的话题数量
	list_topic_count: 20,

	// 是否允许直接注册 
	allow_sign_up: true,

	create_post_per_day: 1000, // 每个用户一天可以发的主题数
	create_reply_per_day: 1000, // 每个用户一天可以发的评论数
	visit_per_day: 1000, // 每个 ip 每天能访问的次数
};

if (process.env.NODE_ENV === 'test') {
	config.db = 'mongodb://127.0.0.1/node_club_test';
}

module.exports = config;
