var express = require('express');
var config = require('./config');
var user = require('./api/user');
var sign = require('./api/sign');
var topic = require('./api/topic');
var upFile = require('./api/uploadFile');
var reply = require('./api/reply');
var router = express.Router();

// uploadFile
router.post('/uplodaFile',upFile.uplodaFile);
router.post('/upUserHeader',upFile.upUserHeader);

// register 
router.post('/register', sign.register);
router.post('/login', sign.login);

// topic
router.post('/sendTopic', topic.sendTopic);
router.post('/praiseTopic', topic.praiseTopic);
router.post('/getTopics',topic.getTopics);
router.post('/getOwnTopics',topic.getOwnTopics);
router.post('/removeTopic',topic.removeTopic);

// reply
router.post('./replyTopic',reply.replyTopic);

// pingpp
router.get('/userPay', user.userPay);
router.get('/userInfo/:name', user.userInfo);
// topic
router.get('/textSendTopic/:userId',topic.textSendTopic);

module.exports = router;