var net = require('net');
var request = require('request');
var HOST = '125.88.176.8';
var PORT = 8602;
var express = require('express');
var app = exports.express = express();

app.get('/',function(req,res,next){
 // run();
  var str = "nn@=1234567/";
  console.log('before: ' + str);
  str = str.substring(0,str.length - 1);
  console.log('after: ' + str);
})

function run(){
  console.log('function run');
  var socket = net.connect(PORT,HOST,function(){
    console.log('connect success');
  });
}

app.listen(3000);
