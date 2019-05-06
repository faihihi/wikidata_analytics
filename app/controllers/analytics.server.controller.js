var express = require('express');
var Revision = require('../models/revision');
var https = require('https');
var fs = require('fs');

//ASK JOHAN if these files will also be provided
var path = '/Users/puifai/Downloads/WEB/group_assignment/group6/dataset/';
var admin_active = fs.readFileSync(path + 'admin_active.txt').toString().split("\n");
var admin_former = fs.readFileSync(path + 'admin_former.txt').toString().split("\n");
var admin_inactive = fs.readFileSync(path + 'admin_inactive.txt').toString().split("\n");
var admin_semi_active = fs.readFileSync(path + 'admin_semi_active.txt').toString().split("\n");
var bot = fs.readFileSync(path + 'bot.txt').toString().split("\n");

var nodisplay = "display: none;";
var showdisplay = "display: block;";
module.exports.showForm = function(req, res) {
    var errormsg = req.app.locals.errormsg;
    var inputemail = req.app.locals.inputemail;
    var inputfirstname = req.app.locals.inputfirstname;
    var inputlastname = req.app.locals.inputlastname;
    res.render('index.ejs', {errormsg: errormsg, inputemail:inputemail, inputfirstname:inputfirstname, inputlastname:inputlastname, registrationdisplay:nodisplay, logindisplay:showdisplay});
};

//Get query results and render main page after login/registration
module.exports.showMain = function(req, res) {
  console.log("ShowMAIN is ran");
  var title = req.app.locals.title;
  var allResult = {};
  var count = 0;

  //OVERALL Analytics
  if(req.query.numberofarticle != null){var numberofarticle = parseInt(req.query.numberofarticle);}
  else{var numberofarticle = 2;}
  console.log(numberofarticle);
  //Find 2 articles with most number of revisions
  Revision.findMostNumRev(numberofarticle, function(err, result){
    if(err){console.log("ERROR");}
    else{
      allResult.mostNumRev1 = result[0]._id;
      allResult.mostNumRev2 = result[1]._id;
      count++;
      parseAllResult(allResult, res, count, 'main.ejs');
    }
  });

  //Find 2 articles with least number of revisions
  Revision.findLeastNumRev(parseInt(numberofarticle), function(err, result){
    if(err){console.log("ERROR");}
    else{
      allResult.leastNumRev1 = result[0]._id;
      allResult.leastNumRev2 = result[1]._id;
      count++;
      parseAllResult(allResult, res, count, 'main.ejs');
    }
  });

  //Find an article that are revised by largest group of registered users
  Revision.findLargestRegisteredUsers(function(err, result){
    if(err){console.log("ERROR");}
    else{
      allResult.largestRegUserRev = result[0]._id;
      count++;
      parseAllResult(allResult, res, count, 'main.ejs');
    }
  });

  //Find an article that are revised by smallest group of registered users
  Revision.findSmallestRegisteredUsers(function(err, result){
    if(err){console.log("ERROR");}
    else{
      allResult.smallestRegUserRev = result[0]._id;
      count++;
      parseAllResult(allResult, res, count, 'main.ejs');
    }
  });

  //Find an article with the oldest age
  Revision.findLongestHistory(function(err, result){
    if(err){console.log("ERROR");}
    else{
      allResult.longestHistory1 = result[0]._id;
      allResult.longestHistory2 = result[1]._id;
      count++;
      parseAllResult(allResult, res, count, 'main.ejs');
    }
  });

  //Find an article with the youngest age
  Revision.findYoungestHistory(function(err, result){
    if(err){console.log("ERROR");}
    else{
      allResult.youngestHistory = result[0]._id;
      count++;
      parseAllResult(allResult, res, count, 'main.ejs');
    }
  });

  //Get the revision number distribution by year and by user type across the whole data set for Bar chart
  Revision.overallBarChart(function(err, result){
    if(err){console.log("ERROR");}
    else{
      allResult.overallBarChart = result;
      count++;
      parseAllResult(allResult, res, count, 'main.ejs');
    }
  });

  //Get the revision number distribution by user type across the whole data set for Pie chart
  Revision.overallPieChart(function(err, result){
    if(err){console.log("ERROR");}
    else{
      allResult.overallPieChart = result;
      count++;
      parseAllResult(allResult, res, count, 'main.ejs');
    }
  });

  //Get number of revisions by type of admin for Pie chart
  Revision.overallRevAdminType(function(err, result){
    if(err){console.log("ERROR");}
    else{
      allResult.overallRevAdminType = result;
      count++;
      parseAllResult(allResult, res, count, 'main.ejs');
    }
  });

  //Get all the article names for drop down list
  Revision.articleDropDownList(function(err, result){
    if(err){console.log("ERROR");}
    else{
      allResult.articleDropDownList = result;
      count++;
      parseAllResult(allResult, res, count, 'main.ejs');
    }
  });


};

//Sending Overall Data Analytics result back to browser: Before rendering, check that all the functions have been run with count and then render to Main
function parseAllResult(allResult, res, count, viewfile){
  console.log(count);
  if(count < 10){return;}
  else{res.render(viewfile, {allResult: allResult});}
}

//Get top # articles with highest/lowest revisions and render to highLowRevResult.ejs to be put in main.ejs section
module.exports.getHighLowRev = function(req, res) {
  var allResult = {};
  allResult.mostNumRev = [];
  allResult.leastNumRev = [];
  var count = 0;
  var numberofarticle = parseInt(req.query.numberofarticle);
  //Get # articles with highest number of revision
  Revision.findMostNumRev(numberofarticle, function(err, result){
    if(err){console.log("ERROR");}
    else{
      for(var i=0;i<numberofarticle;i++){
        allResult.mostNumRev[i] = result[i]._id;
      }
      allResult.numberOfArticle = numberofarticle;
      count++;
      parseHighLowRevResult(allResult, res, count, 'highLowRevResult.ejs');
    }
  });
  //Get # articles with lowest number of revision
  Revision.findLeastNumRev(numberofarticle, function(err, result){
    if(err){console.log("ERROR");}
    else{
      for(var i=0;i<numberofarticle;i++){
        allResult.leastNumRev[i] = result[i]._id;
      }
      count++;
      parseHighLowRevResult(allResult, res, count, 'highLowRevResult.ejs');
    }
  });
};

//Sending results of # articles with highest/lowest revisions back as respond and render
function parseHighLowRevResult(allResult, res, count, viewfile){
  if(count < 2){return;}
  else{res.render(viewfile, {allResult: allResult});}
}

//Get Individual data analytics results and render to individualArticleResult.ejs
module.exports.showIndividualResult = function(req, res) {
  var wikiEndpointHost = "en.wikipedia.org",
  path = "/w/api.php"
  parameters = [
    "action=query",
    "format=json",
    "prop=revisions",
    "rvdir=newer",
    "rvlimit=max",
    "rvprop=timestamp|userid|user|ids"],
  headers = {
    Accept: 'application/json',
    'Accept-Charset': 'utf-8'
  }
  var options;

  var allResult = {};
  var title = req.query.title;
  parameters.push("titles=" + encodeURIComponent(title));
  allResult.individualTitle = title;
  var latestRevTime;
  var count = 0;

  Revision.findTitleLatestRev(title, function(err, result){
    if(err){console.log("ERROR");}
    else{
      latestRevTime = result[0].timestamp;
      parameters.push("rvstart=" + latestRevTime);
      var fullPath = path + "?" + parameters.join("&");
      options = {
          host: wikiEndpointHost,
          path: fullPath,
          headers: headers
      };

      //Compare timestamp if article is older than one day
      var currentDate = new Date();
      var articleLatestRev = new Date(latestRevTime);
      console.log("current: " + currentDate.toISOString() + " Articlate Rev: " + result[0].timestamp);
      var dateDiff = currentDate - articleLatestRev;
      var oneDay = 24 * 60 * 60 * 1000;
      //console.log(dateDiff + " compare " + oneDay);
      if(dateDiff < oneDay){
        //ALREADY UPDATED
        allResult.updateMsg = "The data is Up-to-Date!";
        count++;
        parseIndividualResult(allResult, res, count, 'individualArticleResult.ejs');
        //FROM HERE
        getIndividualResult(title, res, allResult, count);
        //TO HERE

      }
      else{
        //NOT UPDATED
        console.log("not updated");
        //console.log(options);
        //Request for revisions info from Wikipedia
        pullWikiData(options, function(revisions){
            console.log('running thiisssissisiis');
            allResult.updateMsg = "There are " + revisions.length + " new revisions. The articles data have been updated!";
            count++;
            parseIndividualResult(allResult, res, count, 'individualArticleResult.ejs');

            //Set usertype, admintype, registered fields for updated users
            for(var i in revisions){
              revisions[i].title = title;
              //console.log(revisions[i]);
              if(revisions[i].hasOwnProperty("anon")){
                revisions[i].usertype = "anon";
                revisions[i].registered = false;
              }
              else if(admin_active.indexOf(revisions[i].user) > -1){
                revisions[i].usertype = "admin";
                revisions[i].admintype = "active";
                revisions[i].registered = true;
              }
              else if(admin_former.indexOf(revisions[i].user) > -1){
                revisions[i].usertype = "admin";
                revisions[i].admintype = "former";
                revisions[i].registered = true;
              }
              else if(admin_inactive.indexOf(revisions[i].user) > -1){
                revisions[i].usertype = "admin";
                revisions[i].admintype = "inactive";
                revisions[i].registered = true;
              }
              else if(admin_semi_active.indexOf(revisions[i].user) > -1){
                revisions[i].usertype = "admin";
                revisions[i].admintype = "semi-active";
                revisions[i].registered = true;
              }
              else if(bot.indexOf(revisions[i].user) > -1){
                revisions[i].usertype = "bot";
                revisions[i].registered = true;
              }
              else{
                revisions[i].usertype = "regular";
                revisions[i].registered = false;
              }
            }
            //Insert data to mongoDB
            Revision.addData(revisions, function(err, result){
              if(err){console.log("ERROR");}
              else{
                console.log("this function called AFTER UPDATE");
                //FROM HERE
                getIndividualResult(title, res, allResult, count);
                //TO HERE
              }
            });
          });
        }
      }
    });
}

function parseIndividualResult(allResult, res, count, viewfile){
  console.log(count);
  if(count < 7){return;}
  else{
    res.render(viewfile, {allResult: allResult});
  }
}

//Get new revisions data from Wikipedia
pullWikiData = function(options, callback){
  console.log("pullwiki data function ran!!");
  https.get(options,function(res){
      var data ='';
      res.on('data',function(chunk){
          data += chunk;
      })
      res.on('end',function(){
          json = JSON.parse(data);
          pages = json.query.pages;
          revisions = pages[Object.keys(pages)[0]].revisions;
          revisions.splice(0, 1)
          //console.log(revisions);
          console.log("There are " + revisions.length + " new revisions.");
          var users=[]
          for (revid in revisions){
              users.push(revisions[revid].user);
          }
          uniqueUsers = new Set(users);
          console.log("The new revisions are made by " + uniqueUsers.size + " unique users");
          //return revisions;
          callback(revisions);
      })
  }).on('error',function(e){
      console.log(e);
  })
}

function getIndividualResult(title, res, allResult, count){
  Revision.articleRevNumber(title, function(err, result){
    if(err){console.log("ERROR");}
    else{
      allResult.articleRevNumber = result;
      count++;
      parseIndividualResult(allResult, res, count, 'individualArticleResult.ejs');
    }
  });

  Revision.top5RegUsers(title, function(err, result){
    if(err){console.log("ERROR");}
    else{
      allResult.top5users = [];
      //allResult.top5RegUsers1 = result[0];
      for(var i=0;i<result.length;i++){
        allResult.top5users[i] = result[i]._id;
      }
      count++;
      parseIndividualResult(allResult, res, count, 'individualArticleResult.ejs');
    }
  });

  Revision.articleBarChart(title, function(err, result){
    if(err){console.log("ERROR");}
    else{
      allResult.articleBarChart = result;
      count++;
      parseIndividualResult(allResult, res, count, 'individualArticleResult.ejs');
    }
  });

  Revision.articlePieChart(title, function(err, result){
    if(err){console.log("ERROR");}
    else{
      allResult.articlePieChart = result;
      count++;
      parseIndividualResult(allResult, res, count, 'individualArticleResult.ejs');
    }
  });

  //Get number of revisions by type of admin for Pie chart
  Revision.articleAdminType(title, function(err, result){
    if(err){console.log("ERROR");}
    else{
      allResult.articleAdminType = result;
      count++;
      parseIndividualResult(allResult, res, count, 'individualArticleResult.ejs');
    }
  });

  Revision.articleYearList(title, function(err, result){
    if(err){console.log("ERROR");}
    else{
      for(var i=0;i<result.length;i++){
        for(var j=0;j<result.length-i-1;j++){
            if(result[j]._id > result[j+1]._id){
              //console.log("swap" + result[j]._id + " " + result[j+1]._id);
              var temp = result[j]._id;
              result[j]._id = result[j+1]._id;
              result[j+1]._id = temp;
            }
        }
      }
      allResult.articleYearList = result;

      count++;
      parseIndividualResult(allResult, res, count, 'individualArticleResult.ejs');
    }
  });
}


module.exports.getIndividualBarChartTop5 = function(req, res) {
  var title = req.query.title;
  var topusers = req.query.topusers;
  var from = req.query.from;
  var to = req.query.to;
  console.log("on server: " + topusers + " " + from + " " + to);
  var allResult = {};
  var usersArray = topusers.split(',');

  var fromTimestamp = new Date(Date.UTC(from,'00','01','00','00','00'));
  fromTimestamp = fromTimestamp.getTime()/1000;
  console.log(fromTimestamp);

  var toTimestamp = new Date(Date.UTC(to+1,'00','01','00','00','00'));
  toTimestamp = toTimestamp.getTime()/1000;
  console.log(toTimestamp);


  Revision.articleBarChartTop5(title, usersArray, fromTimestamp, toTimestamp, function(err, result){
    if(err){console.log(err);}
    else{
      allResult.articleBarChartTop5 = result;
      res.render('finalBarChartTop5.ejs', {allResult: allResult});
    }
  });
}
