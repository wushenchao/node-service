var app = require('../../app');
var request = require('supertest')(app);
var pedding = require('pedding');
var support =  require('../support/support');
var should  = require('should');

describe('test/api/reply.test.js', function () {
	var mockTopic;
	var mockReplyId;

	before(function (done) {
		support.ready (function() {
			support.ready( function () {
				support.createTopic(support.normalUser.user_id, function(err, topic) {
					mockTopic = topic;
					done();
				});
			});
		});
	});

	describe('create reply', function() {
		it('should success', function(done){
			request.post()
		})
	})
});