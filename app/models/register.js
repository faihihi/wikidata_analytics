var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost/testwiki', function (err, database) {
      const dbo=database.db('testwiki');
      dbo.createCollection("registration", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    //db.close();
  });
      //var collections=db.collection('chats');
});
