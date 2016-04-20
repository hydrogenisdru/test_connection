var express = require('express');
var hash = require('./pass').hash;
var bodyParser = require('body-parser');
var session = require('express-session');
var dao = require('./models/DAO');
var app = module.exports = express();
var monitorRoom = require('./danmu').monitorRoom;
//var http = module.exports = require('http').Server(app);
var ws = require('./test_websocket');
//app.use(express.static('public'));
//app.set('view engine','ejs');
app.use(express.static('public'));
app.engine('html',require('ejs').__express);
app.set('view engine','html');
app.set('views',__dirname + '/views');

app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
  resave:false,
  saveUninitialized:false,
  secret:'shhhh,very secret'
}));

//1
app.use(function(req,res,next){
  var err = req.session.error;
  var msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if(err) res.locals.message = '<p class="msg error">' + err + '</p>';
  if(msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
  next();
});

var users = {
  tj: {name:'tj'}
};

hash('foobar',function(err,salt,hash){
  console.log('hash password generate.');
  if(err) throw err; 
  users.tj.salt = salt;
  users.tj.hash = hash;
});

function authenticate(name,pass,fn){
  console.log('function authenticate name: %s,pass: %s',name,pass);
  if(!module.parent) console.log('authenticating %s:%s',name,pass);
  var user = users[name];
  if(!user) return fn(new Error('cannot find user'));

  hash(pass,user.salt,function(err,hash){
    if(err) return fn(err);
    if(hash == user.hash) return fn(null,user);
    fn(new Error('invalid password'));
  });
}

function restrict(req,res,next){
  console.log('redirect function.');
  if(req.session.user){
    next();
  }else{
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

app.get('/',function(req,res){
  console.log('function get');
  res.redirect('/login');
});

app.get('/restricted',restrict,function(req,res){
  res.send('click to <a href="logout">logout</a>');
});

app.get('/logout',function(req,res){
  req.session.destroy(function(){
    res.redirect('/');
  });
});

app.get('/login',function(req,res){
  console.log('function get login');
  res.render('login');
});

app.get('/rooms',function(req,res){
  console.log('function get rooms');
  res.render('rooms');
});

app.post('/rooms',function(req,res){
  console.log('function post roomid: ' + req.body.roomid);
 // monitorRoom(req.body.roomid);
  res.render('webClient');
});

app.get('/show',function(req,res){
  console.log('function get show');
  var users = [{name:"tobi",skill:"stealth"},{name:"loki",skill:"smash"}];
  res.render('users',{users:users,title:"shows"});
});

app.post('/login',function(req,res){
  authenticate(req.body.username,req.body.password,function(err,user){
    if(user){
      req.session.regenerate(function(){
        req.session.user = user;
        req.session.success = 'authenticate as ' + user.name
        + ' click to <a href="/restricted">restricted</a>.' ;
      res.redirect('back');
      });
    }else{
      req.session.error = 'authentication failed! click to <a href="/reg">regist</a>';
      res.redirect('/login');
    }
  });
});

app.get('/reg',function(req,res){
  console.log('function reg');
  res.render('regist');
});

app.post('/reg',function(req,res){
  console.log('function reg post');
  if(req.body.password != req.body.confirmpassword){
    req.session.error = 'confirm password must be the same as password!';
    res.redirect('/reg');
  }else{
    console.log('user: ' + req.body.username + ' password: ' + req.body.password);
    hash(req.body.password,function(err,hash){
      if(err){
        req.session.error = 'failed to create hash.';
	res.redirect('/reg');
      }else{
	var userInfo = {
	  name: req.body.username,
	  password:hash
	};
	dao.add(userInfo,function(err,result){
	  console.log('add user result:', result);
	  if(!err){
	    req.session.success = 'regist success.click to <a href="/login">Login</a>';
	    res.redirect('back');
	  }else{
	    req.session.error = 'failed to regist!';
	    res.redirect('/reg');
	  }
	});
      }
    });
  }
});

app.get('/remove',function(req,res){
  console.log('function get remove');
  res.render('removeUser');
});

app.post('/remove',function(req,res){
  console.log('function post remove');
  dao.remove(req.body.username,function(err,result){
    console.log('remove user:' + req.body.username + ' result:' + result);
    if(!err){
      req.session.success = 'remove user success.click to <a href="/regist">Regist</regist>';
      res.redirect('back');
    }else{
      req.session.error = 'failed to remove user.';
      res.redirect('/remove');
    }
  });
});

if(!module.parent){
  var server = app.listen(3000);
  //http.listen(3000);
  var websocket = new ws(server);
  websocket.on();
  console.log('Express is running at port 3000.');
}
