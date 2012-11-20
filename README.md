```javascript

var group = require("group"),
EventEmitter = require("events").EventEmitter;



var emGroup = group(EventEmitter);
emGroup.add(new EventEmitter());
emGroup.add(new EventEmitter(), new EventEmitter());

emGroup.on("test", function() {
  
});

```