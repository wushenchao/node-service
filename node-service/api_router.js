var express = require('express');
var config = require('./config');
var user = require('./api/user');
var sign = require('./api/sign');
var topic = require('./api/topic');
var upFile = require('./api/uploadFile');
var router = express.Router();

// uploadFile
router.post('/uplodaFile',upFile.uplodaFile);

// register 
router.post('/register', sign.register);
router.post('/login', sign.login);

// topic
router.post('/sendTopic', topic.sendTopic);


router.get('/userInfo/:name', user.userInfo);
// topic
router.get('/textSendTopic/:userId',topic.textSendTopic);

module.exports = router;