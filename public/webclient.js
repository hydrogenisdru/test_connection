(function(){
  var d = document,
  w = window,
  p = parseInt,
  dd = d.documentElement,
  db = d.body,
  dc = d.compatMode == 'CSSCompat',
  dx = dc ? dd : db,
  ec = encodeURIComponent;
  
  w.CHAT = {
    msgObj: d.getElementById("message"),
    screenheight: w.innerHeight ? w.innerHeight : dx.clientHeight,
    
    scrollToBottom:function(){
	w.scrollTo(0,this.msgObj.clientHeight);
    },
    init:function(){
        console.log('function init');
	this.socket = io.connect('ws://192.168.11.109:3000');
        this.socket.emit('test',{username:'client',content:'test'});
        console.log('emit');
        this.socket.on('welcome',function(obj){
	  console.log('welcome msg');
        });
	this.socket.on('message',function(obj){
          console.log('msg received. owner: ' + obj.username + ' content: ' + obj.content);
	  var usernameDiv = '<span>' + obj.username + '</span>';
	  var contentDiv = '<div>' + obj.content + '</div>';
	  var section = d.createElement('section');
	  section.className = 'user';
	  section.innerHTML = contentDiv + usernameDiv;
	  CHAT.msgObj.appendChild(section);
	  CHAT.scrollToBottom();
	});
    }
  }
  
})();
