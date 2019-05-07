var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/testwiki', { useNewUrlParser: true }, function () {
  console.log('mongodb connected to testwiki!');
});

module.exports = mongoose;
