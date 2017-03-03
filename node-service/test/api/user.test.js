var app = require('../../app');
var request = require('supertest')(app);
var support = require('../support/support');
var should = require('should');

describe('test/api/user.test.js', function () {
	it('should return user info', function(done){
		support.createUser(function(err, user){
			should.not.exists(err);
			request.get('/api/user/' + user.user_loginname)
			.end(function (err, res) {
				should.not.exists(err);
				res.body.data.loginname.should.equal(user.user_loginname);
				done();
			});
		});
	});
});