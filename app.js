var express = require('express');
var app = express();

function error(status,msg){
  var err = new Error(msg);
  err.status = status;
  return err;
};

app.use(express.static('public'));
app.get('/api',function(req,res){
  res.send('Hello World!');
});

var users = [
  {name: 'tobi'},
  {name: 'loki'}
];

var repos = [
  {name:'express',url:'http://github.com/expressjs/express'},
  {name:'stylus',url:'http;//github.com/learnboost/stylus'}
];

var userRepos = {
  tobi: [repos[0]],
  loki: [repos[1]]
};

app.get('/api/repos',function(req,res,next){
  res.send(repos);
});

app.get('/api/users/:name?',function(req,res,next){
  user.get(req.params.name,function(err,user){
    if(err) return next(err);
    res.send('user' + user.name);
  });
 // var name = req.params.name;
 // var user = userRepos[name];
 // if(user) res.send(user);
 // else{
    // next(new Error('cannot find user ' + req.params.name));
   // next();
 // }
});

app.get('/api/users',function(req,res,next){
  res.send(users);
});

app.use(function(req,res){ 
  // res.status(404);
  // res.send(req.params.name);
  console.log('next to here');
});

var server = app.listen(3000,function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s',host,port);
});
