var group = require("../"),
EventEmitter = require("events").EventEmitter;


var GroupEventEmitter = group(EventEmitter).create();


var em = new GroupEventEmitter([new EventEmitter(), new EventEmitter()]);


em.on("hello", function(hello) {
	console.log(hello);
}).
emit("hello", "world!");