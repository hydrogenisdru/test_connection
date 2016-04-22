var io = require('socket.io')();

exports.fetchSocket = function(callback){
  io.on('connection',function(socket){
    console.log(socket.id + ': connection');
    callback(socket);
   // io.emit('welcome',data);
    //socket.on('message',function(obj){
     // console.log('msg received.')
   // });
    //socket.on('test',function(obj){
    //  console.log('test received.');
    //  setInterval(io.emit('welcome',{username:'system',content:'test received'}),2000);
    //});
  });
}

exports.listen = function(server){
  return io.listen(server);
}
