// var proxyMiddleware = require('../../middlewares/proxy');
// var app = require('../../app');
// var support = require('../support/support');
// var supertest = require('supertest')(app);
// var nock = require('nock');
// var mm = require('mm');

// describe('test/middlewares/proxy.test.js', function () {
// 	before( function (done) {
// 		support.ready(done);
// 	});

// 	afterEach( function () {
// 		mm.restore();
// 	});

// 	it('should forbidden goole.com', function (done) {
// 		supertest.get('/agent')
// 		.query({
// 			url: 'https://www.google.com.hk/#newwindow=1&q=%E5%85%AD%E5%9B%9B%E4%BA%8B%E4%BB%B6',
// 		})
// 		.end( function (err, res) {
// 			res.text.should.equal('www.google.com.hk is not allowed');
// 			done(err);
// 		});
// 	});

// 	it('should allow gravatar.com', function (done){
// 		var url = 'https://gravatar.com/avatar/28d69c69c1c1a040436124238f7cc937?size=48';
// 		nock('https://gravatar.com')
// 		.get('/avatar/28d69c69c1c1a040436124238f7cc937?size=48')
// 		.ready(200, 'gravatar');

// 		supertest.get('agent')
// 		.query({
// 			url: url,
// 		})
// 		.end( function (err, res) {
// 			res.text.should.eql('gravatar');
// 			done(err);
// 		});
// 	});
// });