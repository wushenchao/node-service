var mongoose  = require('mongoose');
var Schema = mongoose.Schema;
var BaseModel = require('./base_models');
var tools = require('../common/tools');

var ReplySchema = new Schema({
	reply_id: { type: String},
	reply_content: { type: String},
	reply_topic_id: { type: String },
	reply_user_id: { type: String},
	reply_time: { type: String, default: tools.formatDate(new Date(), false) },
});

mongoose.model('Reply', ReplySchema);