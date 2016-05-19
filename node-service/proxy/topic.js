var models  = require('../models');
var Topic    = models.Topic;
var utility = require('utility');
var uuid    = require('node-uuid');
var validator = require('validator');
var tools = require('../common/tools');

/**
 * 保存事件
 * @param  {[string]}   topic_title   [事件标题]
 * @param  {[string]}   topic_time    [事件时间]
 * @param  {[string]}   topic_content [事件内容]
 * @param  {[string]}   topic_images  [事件图片数组]
 * @param  {[string]}   user_Id    [用户ID]
 * @param  {Function} callback   [description]
 * @return {[type]}              [description]
 */
exports.newAndSave = function (topic_title, topic_time, topic_content, topic_images, user_Id, callback) {
	var topic = new Topic();
	topic.topic_title = topic_title;
	var to_time = topic_time;
	if (validator.isNull(to_time)) {
		to_time = tools.formatDate(new Date(), false);
	}
	topic.topic_time = to_time;
	topic.topic_content = topic_content;
	topic.topic_images = topic_images;
	topic.user_Id = user_Id;
	topic.topic_id = uuid.v4();
	topic.save(callback);
};

