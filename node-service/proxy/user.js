var models  = require('../models');
var User    = models.User;
var utility = require('utility');
var uuid    = require('node-uuid');
var common  = require('../common/tools');

/**
 * 注册用户数据
 * @param  {[string]}   user_name      [姓名]
 * @param  {[string]}   user_loginname [description]
 * @param  {[string]}   user_pass      [description]
 * @param  {[string]}   user_imId      [description]
 * @param  {Function}   callback       [description]
 */
exports.newAndSave = function (user_name, user_loginname, user_pass, user_imId, callback) {
  var user = new User();
  user.user_name = user_name;
  user.user_loginname = user_loginname;
  user.user_pass = user_pass;
  user.user_imId = user_imId;
  
  var uid = uuid.v4();
  user.user_id = uid;
  user.user_token = uid;
  user.save(callback);
};

/**
 * 根据用户名列表查找用户列表
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {Array} names 用户名列表
 * @param {Function} callback 回调函数
 */
exports.getUsersByNames = function (names, callback) {
  if (names.length === 0) {
    return callback(null, []);
  }
  User.find({user_name: { $in: names } }, callback);
};

/**
 * 根据登录名查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} user_loginname 登录名
 * @param {Function} callback 回调函数
 */
exports.getUserByLoginName = function (user_loginname, callback) {
  User.findOne({user_loginname: user_loginname}, callback);
};

/**
 * 根据用户ID，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} id 用户ID
 * @param {Function} callback 回调函数
 */
exports.getUserById = function (id, callback) {
  if (!id) {
    return callback();
  }
  User.findOne({user_id: id}, callback);
};

/**
 * 根据用户ID列表，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {Array} ids 用户ID列表
 * @param {Function} callback 回调函数
 */
exports.getUsersByIds = function (ids, callback) {
  User.find({'_id': {'$in': ids}}, callback);
};

/**
 * 根据关键字，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {String} query 关键字
 * @param {Object} opt 选项
 * @param {Function} callback 回调函数
 */
exports.getUsersByQuery = function (query, opt, callback) {
  User.find(query, '', opt, callback);
};

/**
 * 根据查询条件，获取一个用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} name 用户名
 * @param {String} key 激活码
 * @param {Function} callback 回调函数
 */
exports.getUserByNameAndKey = function (loginname, key, callback) {
  User.findOne({user_loginname: loginname, retrieve_key: key}, callback);
};

