var crypto = require('crypto');

var len = 128;

var iterations = 12000;

/*
*@param {string} password to hash
*@param {string} optional salt
*@param {function} callback
*/

exports.hash = function(pwd,salt,fn){
  console.log('function hash generate.pwd: %s',pwd);
  if(3 == arguments.length){
    crypto.pbkdf2(pwd,salt,iterations,len,function(err,hash){
      fn(err,hash.toString('base64'));
    });
  }else{
    fn = salt;
    crypto.randomBytes(len,function(err,salt){
      if(err) return fn(err);
      salt = salt.toString('base64');
      crypto.pbkdf2(pwd,salt,iterations,len,function(err,hash){
        if(err) return fn(err);
        fn(null,salt,hash.toString('base64'));
      });
    });
  }
};
