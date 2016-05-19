var mongoose  = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');
var BaseModel = require("./base_models");

var UserSchema = new Schema({
  user_loginname: { type: String},
  user_name: { type: String},
  user_pass: { type: String },
  user_email: { type: String},
  user_head_image: {type: String},
  user_location: { type: String },
  user_level: { type: String },

  create_time: { type: Date, default: Date.now },
  update_time: { type: Date, default: Date.now },

  user_id: {type: String},
  user_imId: {type: String},
  user_token: {type: String},
});



mongoose.model('User', UserSchema);