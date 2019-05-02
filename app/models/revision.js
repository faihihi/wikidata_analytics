/**
 *
 */
var mongoose = require('./db');
var fs = require('fs');

var RevisionSchema = new mongoose.Schema({
	title: String,
	timestamp:String,
	user:String,
	anon:String
},{
	versionKey: false
});



//Overall #1 : Title of 2 articles with highest number of revisions
RevisionSchema.statics.find2MostNumRev = function(number, callback){
	var query = [
		{$group: {_id:"$title", numOfRevisions:{$sum:1}}},
		{$sort: {numOfRevisions:-1}},
		{$limit: number}
	]
	return this.aggregate(query)
	.exec(callback)
}

//Overall #2 : Title of 2 articles with lowest number of revisions
RevisionSchema.statics.find2LeastNumRev = function(number, callback){
	var query = [
		{$group: {_id:"$title", numOfRevisions:{$sum:1}}},
		{$sort: {numOfRevisions:1}},
		{$limit: number}
	]
	return this.aggregate(query)
	.exec(callback)
}

//Overall #3 : The article edited by largest group of registered users. Each wiki article is edited by a number of users, some making multiple revisions. The number of unique users is a good indicator of an article’s popularity.
RevisionSchema.statics.findLargestRegisteredUsers = function(callback){
	var query = [
		{$match: {'anon': {$exists: false}}},
		{$group: {_id: "$title", numOfRegisteredUser:{$sum:1}}},
		{$sort: {numOfUser:-1}},
		{$limit: 1}
	]
	return this.aggregate(query)
	.exec(callback)
}

//Overall #4 : The article edited by smallest group of registered users
RevisionSchema.statics.findSmallestRegisteredUsers = function(callback){
	var query = [
		{$match: {'anon': {$exists: false}}},
		{$group: {_id: "$title", numOfRegisteredUser:{$sum:1}}},
		{$sort: {numOfUser:1}},
		{$limit: 1}
	]
	return this.aggregate(query)
	.exec(callback)
}

//Overall #8 : Bar chart of revision number distribution by year and by user type across the whole data set
RevisionSchema.statics.overallBarChart = function(callback){
	var query = [
		{$project: {
			year: {$substr: ["$timestamp", 0, 4]},
			usertype: "$usertype"
		}},
    {$group: {_id: {year:"$year", usertype:"$usertype"}, numbOfRev: {$sum: 1}}},
    {$project: {
			_id: 0,
			year: "$_id.year",
			usertype:"$_id.usertype",
      numbOfRev: "$numbOfRev"
    }},
		{$sort: {"year": 1}}
	]
	return this.aggregate(query)
	.exec(callback)
}

//Overall #9 : Pie chart of revision number distribution by user type across the whole data set
RevisionSchema.statics.overallPieChart = function(callback){
	/*var query = [
		{$group: {_id: {usertype:"$usertype", admintype:"$admintype"}, numbOfRev: {$sum: 1}}},
    {$project: {
				_id: 0,
				usertype:"$_id.usertype",
        admintype:"$_id.admintype",
        numbOfRev: "$numbOfRev"
    }}
	]*/
	var query = [
		{$group: {_id: {usertype:"$usertype"}, numbOfRev: {$sum: 1}}},
    {$project: {
				_id: 0,
				usertype:"$_id.usertype",
        numbOfRev: "$numbOfRev"
    }}
	]
	return this.aggregate(query)
	.exec(callback)
}

//Overall #9 : Get number of revisions by type of admin
RevisionSchema.statics.overallRevAdminType = function(callback){
	var query = [
		{$match:{usertype : "admin"}},
    {$group: {_id: "$admintype", numbOfRev: {$sum: 1}}},
    {$project: {
				admintype:"$admintype",
        numbOfRev: "$numbOfRev"
    }}
	]
	return this.aggregate(query)
	.exec(callback)
}


RevisionSchema.statics.findTitleLatestRev = function(title, callback){
	return this.find({'title':title})
	.sort({'timestamp':-1})
	.limit(1)
	.exec(callback)
}

var Revision = mongoose.model('Revision', RevisionSchema, 'revisions')

module.exports = Revision
