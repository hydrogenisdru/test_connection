var events = require('events');
//var emitter = new events.EventEmitter();
var util = require('util');

function MyStream(){
  events.EventEmitter.call(this);
}

util.inherits(MyStream,events.EventEmitter);

MyStream.prototype.write = function(data){
  this.emit("data",data);
  console.log('write' + data);
}

var stream = new MyStream();

//module.exports = function(){
//  this.stream = stream;
//};
//exports.Send = function(data){
//  stream.write(data);
//  console.log('function send');
//}

//stream.on("data",function(data){
//  console.log('received: ' + data);
//});

//exports.Receive = function(callback){
//  console.log('function receive'); 
//  stream.on("data",function(data){
//    console.log('function on data');
//    callback(data);
//  });
//}

//var cnt = 0;

//setInterval(function(){
//  stream.write(cnt++);
//},2000);

//stream.on("data",function(data){
//  console.log('Received: "' + data + '"');
//});

//console.log('last line.');
