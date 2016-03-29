var mongodb = require('./db');

var Food = {
  name: this.name,
  type: this.type,
  qty: this.qty,
  price: this.price
};

mongodb.open(function(err,db){
  console.log('function db open');
  if(err) return callback(err);
  db.collection('mydb',function(err,collection){
    console.log('function collection in');
    if(err){
       mongodb.close();
       return callback(err);
    }else{
      collection.find({name : 'fish'}).toArray(function(err,docs){
        console.log('function found docs');
        if(err) callback(err,null);
        docs.forEach(function(doc,index){
          console.log(doc.name);
        });
      });
    }
  });
});
