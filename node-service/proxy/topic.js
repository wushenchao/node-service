var models		= require('../models');
var Topic		= models.Topic;
var utility		= require('utility');
var uuid		= require('node-uuid');
var validator	= require('validator');
var tools		= require('../common/tools');

/**
 * 保存事件
 * @param  {[string]}   topic_title   [事件标题]
 * @param  {[string]}   topic_type    [事件类型]
 * @param  {[string]}   topic_content [事件内容]
 * @param  {[string]}   topic_images  [事件图片数组]
 * @param  {[string]}   user_Id		[用户ID]
 * @param  {Function}	callback      [description]
 */
exports.newAndSave = function (topic_title, topic_type, topic_content, topic_images, user_Id, callback) {
	var topic = new Topic();
	topic.topic_title = topic_title;
	topic.topic_type = topic_type;
	topic.topic_content = topic_content;
	topic.topic_images = topic_images;
	topic.user_Id = user_Id;
	topic.topic_id = uuid.v4();
	topic.save(callback);
};

exports.newAndSaveEnvent = function(topic_title, topic_time, topic_content, topic_images, user_Id, callback){
	var topic = new Topic();
	topic.topic_title = topic_title;
	if (!validator.isNull(topic_time)) {
		topic.topic_time = topic_time;
	}
	topic.topic_content = topic_content;
	topic.topic_images = topic_images;
	topic.user_Id = user_Id;
	topic.topic_id = uuid.v4();
	topic.save(callback);
};

/**
 * 通过事件ID获取事件
 * @param  {[type]}   id       [事件id]
 * @param  {Function} callback [返回事件详情]
 * @return {[type]}            [description]
 */
exports.getTopicById = function (id, callback) {
  if (!id) {
    return callback();
  }
  Topic.findOne({topic_id: id}, callback);
};

/**
 * 通过事件ID数组获取一组事件
 * @param  {[type]}   ids      [事件ID数组]
 * @param  {Function} callback [返回一组事件]
 * @return {[type]}            [description]
 */
exports.getTopicByIds = function (ids, callback) {
  Topic.find({'topic_id': {'$in': ids}}, callback);
};


/**
 * 获取事件
 * @param  {[type]} user_id 用户ID 
 * @param  {[type]} page    页数
 * @param  {[type]} limit   [分页限制]
 * @return {[type]}         []
 */
exports.getTopics = function(user_id, page, limit, callback){
	var limitInt = validator.toInt(limit);
	var pageInt = validator.toInt(page);

	if (validator.isNull(user_id)) {
		Topic.find({},'',{sort: {topic_time : -1}, limit : limitInt, skip : pageInt}, callback);
	}
	else {
		Topic.find({user_id: user_id}, '', {sort: {topic_time : -1}, limit : limitInt, skip : pageInt}, callback);
	}
};

/**
 * 删除自己的事件
 * @param  {[type]}   topic_id 事件ID
 * @param  {[type]}   user_id  用户ID
 * @param  {Function} callback 
 */
exports.removeByTopicId = function(topic_id, user_id, callback){
	Reply.remove({topic_id: topic_id, user_Id: user_Id}, callback);
};



