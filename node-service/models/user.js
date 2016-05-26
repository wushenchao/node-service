var mongoose  = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');
var BaseModel = require('./base_models');
var tools = require('../common/tools');

var UserSchema = new Schema({
  user_loginname: { type: String},
  user_name: { type: String},
  user_pass: { type: String },
  user_email: { type: String},
  user_head_url: {type: String},
  user_location: { type: String },
  user_level: { type: String },

  create_time: { type: String, default: tools.formatDate(new Date(), false) },
  update_time: { type: String, default: tools.formatDate(new Date(), false) },

  user_id: {type: String},
  user_imId: {type: String},//聊天ID
  user_token: {type: String},
});



mongoose.model('User', UserSchema);