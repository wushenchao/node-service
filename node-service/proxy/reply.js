var models		= require('../models');
var Reply		= models.Reply;
var utility		= require('utility');
var uuid		= require('node-uuid');
var validator	= require('validator');
var tools		= require('../common/tools');

/**
 * 回复内容保存
 * @param  {[type]}   user_Id  [回复人ID]
 * @param  {[type]}   topic_id [回复事件ID]
 * @param  {[type]}   content  [回复内容]
 */
exports.newAndSave = function (user_id, topic_id, content, callback) {
	var reply = new Reply();
	reply.reply_content = content;
	reply.reply_topic_id = topic_id;
	reply.reply_user_id = user_id;
	reply.reply_id = uuid.v4();
	reply.save(callback);
};

/**
 * 通过回复ID查询回复内容
 * @param  {[type]}   reply_id 回复ID
 * @param  {Function} callback 回复详情
 */
exports.getReplyByReplyId = function(reply_id, callback){
	if (!reply_id) {
		return callback();
	}
	Reply.findOne({reply_id: reply_id}, callback);
};

/**
 * 删除指定回复内容
 * @param  {[type]}   reply_id 回复ID
 * @param  {[type]}   user_id  用户id
 */
exports.removeByReplyId = function(reply_id, user_id, callback){
	Reply.remove({reply_id: reply_id, reply_user_id: user_id}, callback);
};

/**
 * 通过话题ID查询回复
 * @param  {[type]}   topic_id 话题ID
 * @param  {[type]}   page     分页
 * @param  {[type]}   limit    限制
 */
exports.getReplyByTopicId = function(topic_id, page, limit, callback){
	if (!topic_id) {
		return callback();
    }
    var limitInt = validator.toInt(limit);
    var pageInt = validator.toInt(page);
    Reply.find({reply_topic_id: topic_id},'', {sort: {reply_time : -1}, limit : limitInt, skip : pageInt}, callback);
};

/**
 * 通过用户ID查询回复
 * @param  {[type]}   user_id  用户ID
 */
exports.getReplyByUserId = function(user_id, callback) {
	if (!user_id) {
		return callback();
	}
	Reply.find({reply_topic_id: topic_id},'', {sort: {reply_time : -1}, limit : limit, skip : page}, callback);
};






