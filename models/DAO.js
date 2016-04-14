var mongodb = require('./db');
var Food = {
  name: this.name,
  type: this.type,
  qty: this.qty,
  price: this.price
};

var insertDoc = function(info,callback,db){
  if(3 == arguments.length){
    db.collection('mydb',function(err,collection){
      collection.insert(info,function(err,result){
        if(err){
	  console.log('insert failed.error: ' + err);
        }else{
	  callback(result);
        }
      });
    });
  }else{
    mongodb.collection('mydb',function(err,collection){
      console.log('connect collection@function insert');
      
    });
  }
}

var removeDoc = function(info,callback,db){ 
  if(3 == arguments.length){
    db.collection('mydb',function(err,collection){
      collection.remove(info,function(err,result){
        if(err){
	  console.log('insert failed.error: ' + err);
        }else{
	  callback(result);
        }
      });
    });
  }else{
    mongodb.collection('mydb',function(err,collection){
      console.log('connect collection@function remove');
      
    });
  }
}

exports.setDb = function(ipAddr,dbName){
  
}

exports.close = function(){
  mongodb.close();
}

exports.add = function(user,callback){
  if(!mongodb.openCalled){
    mongodb.open(function(err,db){
      console.log('function db open');
      if(err) return callback(err);
      insertDoc(user,function(result){
	//console.log('insert result: %s',result);
	callback(result);
      },db); 
    });
  }else{   
    insertDoc(user,function(result){
      //console.log('insert result: ' + result);
      callback(result);
    });
  }
}

exports.remove = function(user,callback){
  if(!mongodb.openCalled){
    mongodb.open(function(err,db){
      console.log('function db open');
      if(err) return callback(err);
      removeDoc(user,function(result){
	//console.log('remove result: ' + result);
	callback(result);
      },db); 
    });
  }else{   
    removeDoc(user,function(result){
      //console.log('remove result: ' + result);
      callback(result);
    });
  }
}

exports.find = function(userInfo,callback){

}


exports.modify = function(user){
  
}
//mongodb.open(function(err,db){
//  console.log('function db open');
//  if(err) return callback(err);
//  db.collection('mydb',function(err,collection){
//    console.log('function collection in');
//    if(err){
//       mongodb.close();
//       return callback(err);
//    }else{
//      collection.find({name : 'fish'}).toArray(function(err,docs){
//        console.log('function found docs');
//        if(err) callback(err,null);
//        docs.forEach(function(doc,index){
//          console.log(doc.name);
//        });
//      });
//    }
//  });
//});
