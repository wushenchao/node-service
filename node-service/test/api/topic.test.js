var app = require('../../app');
var request = require('supertest')(app);
var support = require('../support/support');
var should = require('should');

describe('test/api/topic.test.js',function () {
	var mockUser, mockTopic;
	before(function(done){
		support.createUser(function(err, user){
			mockUser = user;
			support.createTopic(user.user_id, function(err, topic){
				mockTopic = topic;
				done();
			});
		});
	});

	describe('get /api/topics', function(){
		it('should return topics', function(done){
			request.get('/api/topics')
			.end(function(err, res){
				should.not.exists(err);
				res.body.data.length.should.above(0);
				done();
			});
		});

		it('should return topics', function(done){
			request.get('/api/topics')
			.query({
				limit:2
			})
			.end(function(err, res){
				should.not.exists(err);
				res.body.data.length.should.equal(2);
				done();
			});
		});
	});

});






