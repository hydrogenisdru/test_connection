var express = require('express');
var hash = require('./pass').hash;
var bodyParser = require('body-parser');
var session = require('express-session');

var app = module.exports = express();
var monitorRoom = require('./danmu').monitorRoom;

//app.use(express.static('public'));
app.set('view engine','ejs');
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
  monitorRoom(req.body.roomid);
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
      req.session.error = 'authenticate failed,please check your ' +
      'username and password' + '(use "tj " and " foobar")';
      res.redirect('/login');
    }
  });
});

if(!module.parent){
  app.listen(3000);
  console.log('Express is running at port 3000.');
}
