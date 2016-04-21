var net = require('net');
var uuid = require('node-uuid');
var md5 = require('md5');
var request = require('request');
var HOST = '125.88.176.8';
var PORT = 8602;
var ws = require('./auth').websocket;
//function Danmu(){}

//module.exports = Danmu;

//function content(owner,context){
//  this.owner = owner;
//  this.context = context;
//}

function send(socket,payload){
  var data = new Buffer(4 + 4 + 4 + payload.length + 1);
  data.writeInt32LE(4 + 4 + payload.length + 1,0);
  data.writeInt32LE(4 + 4 + payload.length + 1,4);
  data.writeInt32LE(0x000002b1,8);
  data.write(payload,12);
  data.writeInt8(0,4 + 4 + 4 + payload.length);
  socket.write(data);
}

function login(socket,roomid,user,password){
  console.log('function login@danmu');
  var req = 'type@=loginreq/username@=' + user + '/password@=' + password
  + '/roomid@=' + roomid;
  send(socket,req);
}

function getGroupServer(roomid,callback){
  console.log('function getGroupServer@danmu');
  request({uri:'http://www.douyutv.com/' + roomid},function(err,res,body){
    console.log('request success.');
    if(err){
      console.log(err);
       return;}
  // console.log(body);
    var server_config = JSON.parse(decodeURIComponent(JSON.parse(body.match(/"server_config":(.*?)\,/g)[0].replace('"server_config":','').replace(',',''))));
     console.log(server_config);  
// var server_config = JSON.parse(body.match(/room_args = (.*?)\}\;/g)[0].replace('room_args = ','').replace(';',''));
   // console.log(server_config);
   // server_config = JSON.parse(unescape(server_config['server_config']));
    //server_config = JSON.parse(decodeURIComponent(server_config));
    console.log(server_config);
    callback(server_config[0].ip,server_config[0].port);
  });
}

function getGroupId(roomid,callback){
  console.log('function getGroupId');
  var rt = new Date().now;
  var devid = uuid.v4().replace(/-/g,'');
  var vk = md5(rt + '7oE9nPEG9xXV69phU31FYCLUagKeYtsF' + devid);
  var req = 'type@=loginreq/username@=/password@=/roomid@=' +
  roomid + '/ct@=0/vk@=' + vk + '/devid@=' + devid + '/rt@=' + 
  rt + '/ver@=20150929/';
  
  getGroupServer(roomid,function(server,port){
    console.log('group server: ' + server + ': ' + port);
    var socket = net.connect(port,server,function(){
      send(socket,req);
    });

    socket.on('data',function(data){
      if(data.toString().indexOf('type@=setmsggroup') >= 0){
	var gid = data.toString().match(/gid@=(.*?)\//g)[0].replace('gid@=','');
	gid = gid.substring(0,gid.length - 1);
	socket.destroy();
	callback(gid);
      }
    });
  });
}

exports.monitorRoom = function(roomid){
  console.log('function monitorRoom');
  var socket = net.connect(PORT,HOST,function(){
    login(socket,'visitor1234567','1234567890123456');
  });

  setInterval(function(){
	send(socket,'type@=keeplive/tick@=70/');
  },50000);

  socket.on('data',function(data){
    if(data.toString().indexOf('type@=loginres') >= 0){
      getGroupId(roomid,function(gid){
	console.log('gid[' + gid + '] of room[' + roomid +']');
	send(socket,'type@=joingroup/rid@=' + roomid + '/gid@=' + gid + '/');
      });
    }else if(data.toString().indexOf('type@=chatmsg') >= 0){
      var msg = data.toString();
     // var snick = msg.match(/snick@(.*?)\//g)[0].replace('snick@=','');
     // var content = msg.match(/content@=(.*?)\//g)[0].replace('content@=','');
     // snick = snick.substring(0,snick.length - 1);
     // content = content.substring(0,content.length - 1);
      var owner = msg.match(/nn@*(.*?)\//g)[0].replace('nn@=','');
      var context = msg.match(/txt@*(.*?)\//g)[0].replace('txt@=','');
      owner =  owner.substring(0,owner.length - 1);
      context =  context.substring(0,context.length - 1);
      var obj = {username:owner,content:context};
      ws.send(obj);
      console.log(owner + ': ' + context);
    }else if(data.toString().indexOf('type@=uenter') >= 0){
      var msg = data.toString();
      var user = msg.match(/nn@*(.*?)\//g)[0].replace('nn@=','');
      user.substring(0,user.length - 1);
      console.log(user + ' entered room.');
    }else if(data.toString().indexOf('type@=keeplive') >=0 ||
      data.toString().indexOf('type@dgn=/gid@=131') >= 0 ||
      data.toString().indexOf('type@=blackres') >= 0 ||
      data.toString().indexOf('type@=dgn/gfid@=129') >= 0 ||
      data.toString().indexOf('type@=upgrade') >= 0 ||
      data.toString().indexOf('type@=ranklist') >= 0 ||
      data.toString().indexOf('type@=onlinegift') >= 0 ||
      data.toString().indexOf('type@=dgb') >= 0){
      //nonsence
    }else if(data.toString().indexOf('type@=spbc') >= 0){
      var drid = data.toString().match(/drid@=(.*?)\//g)[0].replace('drid@=','');
      drid = drid.substring(0,drid.length - 1);
      console.log('rocket! room id:' + drid);
    }else{
      console.log(data.toString());
    }
  });
}
