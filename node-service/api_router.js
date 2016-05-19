var express = require('express');
var config = require('./config');
var user = require('./api/user');
var sign = require('./api/sign');
var topic = require('./api/topic');
var router = express.Router();


// register 
router.post('/register', sign.register);
router.post('/login', sign.login);

// topic
router.post('/sendTopic', topic.sendTopic);






router.get('/userInfo/:name', user.userInfo);

// topic
router.get('/textSendTopic/:userId',topic.textSendTopic);

module.exports = router;