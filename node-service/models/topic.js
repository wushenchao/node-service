var mongoose  = require('mongoose');
var Schema = mongoose.Schema;
var BaseModel = require("./base_models");

var TopicSchema = new Schema({
  topic_id: { type: String },
  topic_title: { type: String},
  topic_content: { type: String},
  topic_time: { type: String },
  topic_images: { type: Array},
  
  user_Id: { type: String },
});

mongoose.model('Topic', TopicSchema);