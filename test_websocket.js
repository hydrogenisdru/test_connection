var io = require('socket.io');
 
module.exports = function(server){
  this.server = io.listen(server);
  this.on = function(){
    server.on('connection',function(socket){
    console.log('websocket connection on');
    });
  };
  this.send = function(obj){
    server.emit('message',obj);
    console.log('send message. owner: ' + obj.username + ' content: ' + obj.content);
  };
};
