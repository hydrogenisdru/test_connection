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
	this.socket = io.connect('ws://172.20.10.5:3000');
	this.socket.on('message',function(obj){
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
