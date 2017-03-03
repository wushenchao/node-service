var exec = require("child_process").exec;
var fs = require("fs");
var url = require("url");
var querystring = require("querystring");
var formidable = require("formidable");
require('shelljs/global');

// 加载表单html
function start (response) {
	console.log("Request handler 'start' was called.");
	var formfile = cat(__dirname + '/form.html');
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(formfile);
	response.end();
}

function uploadImg(response, request) {
	console.log("Request handler 'upload' was called.");
	var form = new formidable.IncomingForm();
	form.parse(request, function(error, fileds, files) {
		console.log("parse:"+ fileds + "files:" + files);
		fs.renameSync("../tmp/2.png", "../tmp/1.png");
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write("received image:<br/>");
		response.write("<img src='/show' />");
		response.end();
	});
}

// 表单提交
function upload(response, request){
	// 简单的文字内容
	// var postData = "";
	// request.addListener("data", function(postDataChuck){
	// 	postData += postDataChuck;
	// 	console.log("received:"+postDataChuck);
	// });

	// request.addListener("end",function(postDataChuck){
	// 	response.writeHead(200,{"Content-Type" : "text/plain"});
	// 	response.write(postData);
	// 	response.end();
	// });
	


	console.log("Request handler 'upload' was called.");
	var form = new formidable.IncomingForm();
	var post = {};
	file = {};
	form.uploadDir = '../tmp';
	form
		.on('error', function(err){
			console.log(err);
		})
		.on('field', function(field, value){
			if (form.type == 'multipart') {
				if (field in post) {
					if (util.isArray(post[field]) === false) {
						post[field] = [post[field]];
					};
					post[field].push(value);
					return;
				};
			};
			post[field] = value;
		})
		.on('file', function(filed, file){
			file[filed] = file;
		})
		.on('end', function(){
			// fn();
			// console.log("parse:"+ fileds + "files:" + files);

		
		})
		form.parse(request, function(error, fileds, files) {
			console.log("parse:"+ fileds + "files:" + files);
			fs.renameSync(file.path, "../tmp/1.png");
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write("received image:<br/>");
			response.write("<img src='/show' />");
			response.end();
		});
	// form.parse(request);
}

function show(response){
	// 读取文字
	/*
	response.writeHead(200,{"Content-Type" : "text/plain"});
	var data = cat(__dirname + '/../tmp/1.txt');
	response.write(data);
	response.end();
	*/

	// 读取图片	
	var path =  __dirname + "/../tmp/1.png";
	var ps = __dirname + '/form.html';
	fs.readFile(ps,'binary',function(err, file) {
		if (err) {
			console.log(err);
		}
		else {
			response.writeHead(200, {"Content-Type": "text/html"});
			// response.writeHead(200, {"Content-Type": "image/png"});
			response.write(file,'binary');
			response.end();
		}
	});
}


exports.start = start;
exports.show = show;
exports.upload = upload;
exports.uploadImg = uploadImg;


