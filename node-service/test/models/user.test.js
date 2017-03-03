var UserModel = require('../../models').User;

describe('test/models/user.test.js', function () {
	it('should return proxy user_name', function(){
		var user = new UserModel({user_name: 'MayFive'});
	});
});