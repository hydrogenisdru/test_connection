var events = require('events');
//var emitter = new events.EventEmitter();
var util = require('util');

function MyStream(){
  events.EventEmitter.call(this);
}

util.inherits(MyStream,events.EventEmitter);

MyStream.prototype.write = function(data){
  this.emit("data",data);
}

var stream = new MyStream();
var cnt = 0;

setInterval(function(){
  stream.write(cnt++);
},5000);

stream.on("data",function(data){
  console.log('Received: "' + data + '"');
});

console.log('last line.');
