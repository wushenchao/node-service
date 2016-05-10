/**
 * nodeclub - app.js
 */

var config = require('./config');

var path = require('path');
var LoaderConnet = require('loader-connect');
var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');
var errorhandler = require('errorhandler');
var helmet = require('helmet');
var bytes = require('bytes');
var RedisStore = require('connect-redis')(session);
var compress = require('compression');
var apiRouter = require('./api_router');
var renderMiddleware = require('./middlewares/render');
var requestLog = require('./middlewares/request_log');
var logger = require('./common/logger');
var multer = require('multer');

require('./middlewares/mongoose_log'); //  mongodb log
require('./models');

var urlinfo = require('url').parse(config.host);
config.hostname = urlinfo.hostname || config.host;

var app = express();

// request logger
app.use(requestLog);

if (config.debug) {
	app.use(renderMiddleware.render);
	app.use(LoaderConnet.less(__dirname)); // 测试环境用，编译 .less on the fly
}

// 通用的中间件
app.use(require('response-time')());
app.use(helmet.frameguard('sameorigin'));
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(require('method-override')());
app.use(require('cookie-parser')(config.session_secret));
app.use(compress());
app.use(session({
  secret: config.session_secret,
  store: new RedisStore({
    port: config.redis_port,
    host: config.redis_host,
  }),
  resave: true,
  saveUninitialized: true,
}));



// error handler
if (config.debug) {
  app.use(errorhandler());
} else {
  app.use(function (err, req, res, next) {
    logger.error(err);
    return res.status(500).send('500 status');
  });
}

// routes
app.use('/', apiRouter);

if (!module.parent) {
  app.listen(config.port, function () {
    logger.info('NodeClub listening on port', config.port);
    logger.info('God bless love....');
    logger.info('You can debug your app with http://' + config.hostname + ':' + config.port);
    logger.info('');
  });
}

module.exports = app;
