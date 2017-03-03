var server = require("../code/server");
var router = require("../code/router");
var requestHandlers = require("../code/requestHandlers");

var handle = {};
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/show"] = requestHandlers.show;
handle["/uploadImg"] = requestHandlers.uploadImg;

server.start(router.route, handle);