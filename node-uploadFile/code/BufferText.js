/*
var string, string1, string2;
var buffer, buffer1, buffer2;
var j;

console.time('write 100 string');
for (j = 0; j < 1000; j++) {
	var x = j + '';
	string += x;
}
console.timeEnd('write 100 string');

console.time('write 100 buffer');
bufstr = new Buffer(1000);

for (j = 0; j < 1000; j++) {
	var x = j + '';
	bufstr.write(x, j);
}
console.timeEnd('write 100 buffer');
*/


var os = require('os');
var leak_buf_ary = [];

var show_memory_usage = function(){
	console.log('free men :' + Math.ceil(os.freemem()/(1024 * 1024)) + 'mb');
};


var do_buf_leak = function(){
	var leak_char = 'l'; // 泄漏的几byte字符
	var loop = 100000;
	var buf1_ary = [];
	while(loop -- ){
		buf1_ary.push(new Buffer(4096));
		leak_buf_ary.push(new Buffer(loop + leak_char));
	}
	console.log("before gc");
	show_memory_usage();
	buf1_ary = null;
	return;
};

console.log("process start");

show_memory_usage();

do_buf_leak();

var j = 10000;
setInterval(function(){
	console.log("after gc");
	show_memory_usage();
},1000 * 60);









