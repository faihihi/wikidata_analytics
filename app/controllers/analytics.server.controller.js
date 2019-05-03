var express = require('express');
var Revision = require('../models/revision');

var nodisplay = "display: none;";
var showdisplay = "display: block;";
module.exports.showForm = function(req, res) {
    var errormsg = req.app.locals.errormsg;
    var inputemail = req.app.locals.inputemail;
    var inputfirstname = req.app.locals.inputfirstname;
    var inputlastname = req.app.locals.inputlastname;
    res.render('index.ejs', {errormsg: errormsg, inputemail:inputemail, inputfirstname:inputfirstname, inputlastname:inputlastname, registrationdisplay:nodisplay, logindisplay:showdisplay});
};

module.exports.showMain = function(req, res) {
  console.log("ShowMAIN is ran");
  var title = req.app.locals.title;
  var allResult = {};
  var count = 0;

  //OVERALL Analytics
  if(req.query.numberofarticle != null){var numberofarticle = parseInt(req.query.numberofarticle);}
  else{var numberofarticle = 2;}
  console.log(numberofarticle);
  Revision.findMostNumRev(numberofarticle, function(err, result){
    if(err){console.log("ERROR");}
    else{
      allResult.mostNumRev1 = result[0]._id;
      allResult.mostNumRev2 = result[1]._id;
      count++;
      parseAllResult(allResult, res, count, 'main.ejs');
    }
  });

  Revision.findLeastNumRev(parseInt(numberofarticle), function(err, result){
    if(err){console.log("ERROR");}
    else{
      allResult.leastNumRev1 = result[0]._id;
      allResult.leastNumRev2 = result[1]._id;
      count++;
      parseAllResult(allResult, res, count, 'main.ejs');
    }
  });

  Revision.findLargestRegisteredUsers(function(err, result){
    if(err){console.log("ERROR");}
    else{
      allResult.largestRegUserRev = result[0]._id;
      count++;
      parseAllResult(allResult, res, count, 'main.ejs');
    }
  });

  Revision.findSmallestRegisteredUsers(function(err, result){
    if(err){console.log("ERROR");}
    else{
      allResult.smallestRegUserRev = result[0]._id;
      count++;
      parseAllResult(allResult, res, count, 'main.ejs');
    }
  });

  Revision.findLongestHistory(function(err, result){
    if(err){console.log("ERROR");}
    else{
      allResult.longestHistory1 = result[0]._id;
      allResult.longestHistory2 = result[1]._id;
      count++;
      parseAllResult(allResult, res, count, 'main.ejs');
    }
  });

  Revision.findYoungestHistory(function(err, result){
    if(err){console.log("ERROR");}
    else{
      allResult.youngestHistory = result[0]._id;
      count++;
      parseAllResult(allResult, res, count, 'main.ejs');
    }
  });

  Revision.overallBarChart(function(err, result){
    if(err){console.log("ERROR");}
    else{
      allResult.overallBarChart = result;
      count++;
      parseAllResult(allResult, res, count, 'main.ejs');
    }
  });

  Revision.overallPieChart(function(err, result){
    if(err){console.log("ERROR");}
    else{
      allResult.overallPieChart = result;
      count++;
      parseAllResult(allResult, res, count, 'main.ejs');
    }
  });

  Revision.overallRevAdminType(function(err, result){
    if(err){console.log("ERROR");}
    else{
      allResult.overallRevAdminType = result;
      count++;
      parseAllResult(allResult, res, count, 'main.ejs');
    }
  });

  Revision.articleDropDownList(function(err, result){
    if(err){console.log("ERROR");}
    else{
      allResult.articleDropDownList = result;
      count++;
      parseAllResult(allResult, res, count, 'main.ejs');
    }
  });


};

function parseAllResult(allResult, res, count, viewfile){
  console.log(count);
  if(count < 10){return;}
  else{res.render(viewfile, {allResult: allResult});}
}

module.exports.getHighLowRev = function(req, res) {
  var allResult = {};
  allResult.mostNumRev = [];
  allResult.leastNumRev = [];
  var count = 0;
  var numberofarticle = parseInt(req.query.numberofarticle);
  Revision.findMostNumRev(numberofarticle, function(err, result){
    if(err){console.log("ERROR");}
    else{
      for(var i=0;i<numberofarticle;i++){
        allResult.mostNumRev[i] = result[i]._id;
      }
      //res.render('highestRevision.ejs', {allResult: allResult});
      allResult.numberOfArticle = numberofarticle;
      count++;
      parseHighLowRevResult(allResult, res, count, 'highLowRevResult.ejs');
    }
  });
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

function parseHighLowRevResult(allResult, res, count, viewfile){
  if(count < 2){return;}
  else{res.render(viewfile, {allResult: allResult});}
}

module.exports.getIndividualResult = function(req, res) {
  console.log("getIndividualRestult ran");
  var allResult = {};
  var title = req.query.title;
  allResult.individualTitle = title;
  var count = 0;
  console.log("onserver" + title);

  Revision.findTitleLatestRev(title, function(err, result){
    if(err){console.log("ERROR");}
    else{
      var currentDate = new Date();
      var articleLatestRev = new Date(result[0].timestamp);
      console.log("current: " + currentDate.toISOString() + " Articlate Rev: " + result[0].timestamp);
      var dateDiff = currentDate - articleLatestRev;
      var oneDay = 24 * 60 * 60 * 1000;
      console.log(dateDiff + " compare " + oneDay);
      if(dateDiff < oneDay){
        //ALREADY UPDATED
        allResult.updateMsg = "The data is Up-to-Date!";
        count++;
        parseIndividualResult(allResult, res, count, 'individualArticleResult.ejs');
        //FROM HERE
        Revision.articleRevNumber(title, function(err, result){
          if(err){console.log("ERROR");}
          else{
            allResult.articleRevNumber = result;
            count++;
            parseHighLowRevResult(allResult, res, count, 'individualArticleResult.ejs');
          }
        });

        Revision.top5RegUsers(title, function(err, result){
          if(err){console.log("ERROR");}
          else{
            allResult.top5RegUsers = result;
            count++;
            parseHighLowRevResult(allResult, res, count, 'individualArticleResult.ejs');
          }
        });
        //TO HERE

      }
      else{
        //NOT UPDATED
        console.log("not updated");
        allResult.updateMsg = "The data is not up to date";
        parseIndividualResult(allResult, res, count, 'individualArticleResult.ejs');

        //FROM HERE
        Revision.articleRevNumber(title, function(err, result){
          if(err){console.log("ERROR");}
          else{
            allResult.articleRevNumber = result;
            console.log("This is rannnnnn!");
            count++;
            parseHighLowRevResult(allResult, res, count, 'individualArticleResult.ejs');
          }
        });

        Revision.top5RegUsers(title, function(err, result){
          if(err){console.log("ERROR");}
          else{
            allResult.leastNumRev = [];
            //allResult.top5RegUsers1 = result[0];
            for(var i=0;i<5;i++){
              allResult.leastNumRev[i] = result[i]._id;
            }
            count++;
            parseHighLowRevResult(allResult, res, count, 'individualArticleResult.ejs');
          }
        });
        //TO HERE
      }
    }
  });
}

function parseIndividualResult(allResult, res, count, viewfile){
  console.log(count);
  if(count < 3){return;}
  else{res.render(viewfile, {allResult: allResult});}
}
