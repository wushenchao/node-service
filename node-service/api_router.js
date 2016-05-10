var express = require('express');
var userController = require('./api/user');
var sign = require('./api/sign');
var config = require('./config');
var router = express.Router();


// register 
router.post('/register', sign.register);
router.post('/login', sign.login);


router.get('/userInfo/:name', userController.userInfo);
module.exports = router;