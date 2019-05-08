var mongoose = require('./db');
var fs = require('fs');

var RegistrationSchema = new mongoose.Schema({
	email: String,
	password:String,
	firstname:String,
	lastname:String
},{
	versionKey: false
});

// Insert new user
RegistrationSchema.statics.addNewUser = function(parameter, callback){
  return this.insertMany(parameter, function(err, result){
    if(err){console.log(err);}
    callback();
  });
}

// Check if email match with existing email
RegistrationSchema.statics.userExist = function(email, callback){
	return this.find({'email':email}).count().exec(callback)
}

var Registration = mongoose.model('Registration', RegistrationSchema, 'registration')

module.exports = Registration
