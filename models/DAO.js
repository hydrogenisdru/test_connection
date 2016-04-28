var pool = require('./pool');
var Food = {
  name: this.name,
  type: this.type,
  qty: this.qty,
  price: this.price
};

var insertDoc = function(info,callback){
  pool.acquire(function(err,db){
    console.log('connect collection@function insert');
    if(err) callback(err);
    db.collection('mydb',function(err,collection){
      collection.insert(info,function(err,result){
        if(err){
  	  console.log('insert failed.error:' + err);
	  callback(err,null);
        }else{
	  callback(null,result);
        }
      });
    });
  });
}

var removeDoc = function(info,callback){ 
  pool.acquire(function(err,db){
    console.log('connect collection@function remove');
    if(err) callback(err);
    db.collection('mydb',function(err,collection){
      collection.remove({name:info},function(err,result){
        if(err){
  	  console.log('remove failed.error:' + err);
	  callback(err,null);
        }else{
	  callback(null,result);
        }
      });
    });
  });
}

var findDoc = function(info,callback){
  pool.acquire(function(err,db){
    console.log('connect collection@function find');
    if(err) callback(err,null);
    db.collection('mydb',function(err,collection){
      collection.find({name:info}).toArray(function(err,docs){
        if(err){
  	  console.log('find failed.error:' + err);
	  callback(err,null);
        }else{
	  callback(null,docs);
        }
      });
    });
  });
}

exports.add = function(user,callback){
  insertDoc(user,function(err,result){
    callback(err,result);
  });
}

exports.remove = function(user,callback){
  removeDoc(user,function(err,result){
    callback(err,result);
  }); 
}

exports.find = function(user,callback){
  findDoc(user,function(err,result){
    callback(err,result);
  }); 
}

exports.modify = function(user){
  
}
//pool.open(function(err,db){
//  console.log('function db open');
//  if(err) return callback(err);
//  db.collection('mydb',function(err,collection){
//    console.log('function collection in');
//    if(err){
//       pool.close();
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
