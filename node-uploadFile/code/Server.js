var http = require("http");
var url = require("url");

/*
function onRequest(request, response){
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("hello word");
	response.end();
}
http.createServer(onRequest).listen(8888);
console.log("Server has start");
*/

function start(route, handle){
	function onRequest(request, response){
		// 请求的路由选择
		var pathname = url.parse(request.url).pathname;
		console.log("Request for" + pathname + "received.");
		route(handle, pathname, response, request);

		// response.writeHead(200, {"Content-Type": "text/plain"});
		// var content = route(handle, pathname);
		// response.write(content);
		// response.end();
	}
	http.createServer(onRequest).listen(8888);
	console.log("Server has started on port: 8888");
}
//接口暴漏
exports.start = start;



