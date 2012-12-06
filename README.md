


```javascript

var group = require("group"),
EventEmitter = require("events").EventEmitter;



var emGroup = group(EventEmitter);
emGroup.add(new EventEmitter());
emGroup.add(new EventEmitter(), new EventEmitter());

emGroup.on("test", function() {
  
});

group(emGroup.on("test", function(){})).dispose(); //wrapped method

```



```javascript

var group = require("group");

var EmitterGroup = group.flow({
	"par each": ["on", "emit"]
}).
pre("on", function(item, next) {
	
}).
pos("emit", function() {
	
}).
create();



var eg = new EmitterGroup([new EventEmitter(), new EventEmitter()]);
eg.on("emit", function() {
	
});

```