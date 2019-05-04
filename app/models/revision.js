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
RevisionSchema.statics.findMostNumRev = function(number, callback){
	var query = [
		{$group: {_id:"$title", numOfRevisions:{$sum:1}}},
		{$sort: {numOfRevisions:-1}},
		{$limit: number}
	]
	return this.aggregate(query)
	.exec(callback)
}

//Overall #2 : Title of 2 articles with lowest number of revisions
RevisionSchema.statics.findLeastNumRev = function(number, callback){
	var query = [
		{$group: {_id:"$title", numOfRevisions:{$sum:1}}},
		{$sort: {numOfRevisions:1}},
		{$limit: number}
	]
	return this.aggregate(query)
	.exec(callback)
}

//Overall #4 : The article edited by largest group of registered users. Each wiki article is edited by a number of users, some making multiple revisions. The number of unique users is a good indicator of an article’s popularity.
RevisionSchema.statics.findLargestRegisteredUsers = function(callback){
	var query = [
		{$match:{anon:{$exists:false}}},
		{$group:{_id:{title:"$title",user:"$user"}}},
		{$group:{_id:"$_id.title",count:{$sum:1}}},
		{$sort:{count:-1}},
  	{$limit:1}
	]
	return this.aggregate(query)
	.exec(callback)
}

//Overall #5 : The article edited by smallest group of registered users.
RevisionSchema.statics.findSmallestRegisteredUsers = function(callback){
	var query = [
		{$match:{anon:{$exists:false}}},
		{$group:{_id:{title:"$title",user:"$user"}}},
		{$group:{_id:"$_id.title",count:{$sum:1}}},
		{$sort:{count:1}},
  	{$limit:1}
	]
	return this.aggregate(query)
	.exec(callback)
}


//Overall #6 : The top 2 articles with the longest history (measured by age)
RevisionSchema.statics.findLongestHistory = function(callback){
	var query = [
		{$group: {_id: "$title", timestamp: {"$min": "$timestamp"}}},
		{$sort: {timestamp: 1}},
	  {$limit: 2}
	]
	return this.aggregate(query)
	.exec(callback)
}

//Overall #7 : Article with the shortest history (measured by age)
RevisionSchema.statics.findYoungestHistory = function(callback){
	var query = [
		{$group: {_id: "$title", timestamp: {"$min": "$timestamp"}}},
		{$sort: {timestamp: -1}},
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

//Individual Article: Dropdown List
RevisionSchema.statics.articleDropDownList = function(callback){
	return this.distinct("title")
	.exec(callback)
}

//Individual Article: check latest revision time
RevisionSchema.statics.findTitleLatestRev = function(title, callback){
	return this.find({'title':title}).sort({'timestamp':-1}).limit(1).exec(callback)
}

//Individual Article #2: Total number of revisions
RevisionSchema.statics.articleRevNumber = function(title, callback){
	return this.find({'title':title}).count().exec(callback)
}

//Individual Article #3: Top 5 regular users ranked by total revision numbers on this article, and the respective revision numbers
RevisionSchema.statics.top5RegUsers = function(title, callback){
	var query = [
		{$match: {"title": title}},
		{$group: {_id: "$user", numbOfRev:{$sum:1}}},
		{$sort: {numbOfRev:-1}},
		{$limit: 5}
	]
	return this.aggregate(query)
	.exec(callback)
}

//Update data after calling API
RevisionSchema.statics.updateData = function(wikiData, callback){
	return this.insertMany(wikiData, {}, function(error, result){callback();});
}

var Revision = mongoose.model('Revision', RevisionSchema, 'revisions')

module.exports = Revision
