var express = require('express');
var app = module.exports = express();

//var users = a.users;

//var users = [
//  {name:'tj'},
//  {name:'tobi'},
//  {name:'loki'}
//];
app.use('/users',require('./public/users'));

function createError(status,msg){
  var err = new Error(msg);
  err.status = status;
  return err;
}

app.param(['to','from'],function(req,res,next,num,name){
  console.log('dual param method');
  console.log('name: ' + name + ',num: ' + num); 
  req.params[name] = parseInt(num,10);
  if(isNaN(req.params[name])){
      next(createError(400,'failed to parseInt' + num));
   }else{
      next();
   }
});

app.param('user', function(req, res, next, id){
  console.log('param method');
  if (req.user = users[id]) {
    next();
  } else {
    next(createError(404, 'failed to find user'));
  }
});

app.get('/',function(req,res){
  res.send('Visit /user/0 or /users/0-2');
});

app.get('/user/:user',function(req,res,next){
  console.log('get method');
  res.send('user: ' + req.user.name);
});

app.get('/users/:from-:to',function(req,res,next){
  var from = req.params.from;
  var to = req.params.to;
  console.log(users[0].name);
  var names = users.map(function(user){return user.name;});
  res.send('users: ' + names.slice(from,to).join(','));
});

if(!module.parent){
  app.listen(3000);
  console.log('Express started on port 3000');
}
