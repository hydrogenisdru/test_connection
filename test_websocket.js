var io = require('socket.io')();

io.on('connection',function(socket){
  console.log(socket.id + ': connection');
  socket.on('message',function(obj){
    console.log('msg received.')
  });
  socket.on('test',function(obj){
    console.log('test received.');
  });
});

exports.listen = function(server){
  return io.listen(server);
}
