var net = require('net');
var request = require('request');
var HOST = '125.88.176.8';
var PORT = 8602;
var express = require('express');
var app = exports.express = express();

app.get('/',function(req,res,next){
  run();
})

function run(){
  console.log('function run');
  var socket = net.connect(PORT,HOST,function(){
    console.log('connect success');
  });
}

app.listen(3000);
