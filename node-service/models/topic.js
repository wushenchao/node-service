var mongoose  = require('mongoose');
var Schema = mongoose.Schema;
var BaseModel = require('./base_models');
var tools = require('../common/tools');

var TopicSchema = new Schema({
  topic_id: { type: String },
  topic_title: { type: String },
  topic_content: { type: String },
  topic_images: { type: Array },
  topic_time: { type: String, default: tools.formatDate(new Date(), false) },
  topic_type: { type: Number, default: 0 },

  // 位置 经纬度
  topic_location: { type: String },
  topic_longitude: { type: Number, default: 0},
  topic_latitude: { type: Number, default: 0},

  topic_praiseNumber: { type: Number, default: 0},
  topic_praiseUser: { type: Array},//user_id

  topic_replyNumber: { type: Number, default: 0},
  topic_replyUsers: { type: Array},//user_id

  user_Id: { type: String },//发布人id
});

mongoose.model('Topic', TopicSchema);