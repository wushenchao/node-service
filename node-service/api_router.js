var express = require('express');
var config = require('./config');
var user = require('./api/user');
var sign = require('./api/sign');
var topic = require('./api/topic');
var router = express.Router();


// register 
router.post('/register', sign.register);
router.post('/login', sign.login);


router.get('/userInfo/:name', user.userInfo);

// topic
router.get('/sendTopic/:userId',topic.sendTopic);

module.exports = router;