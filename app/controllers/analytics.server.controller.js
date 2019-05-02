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
  Revision.find2MostNumRev(numberofarticle, function(err, result){
    if(err){console.log("ERROR");}
    else{
      allResult.mostNumRev1 = result[0]._id;
      allResult.mostNumRev2 = result[1]._id;
      count++;
      parseAllResult(allResult, res, count, 'main.ejs');
    }
  });

  Revision.find2LeastNumRev(parseInt(numberofarticle), function(err, result){
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
};

function parseAllResult(allResult, res, count, viewfile){
  if(count < 6){return;}
  else{res.render(viewfile, {allResult: allResult});}
}

module.exports.getHighestRevision = function(req, res) {
  var allResult = {};
  allResult.mostNumRev = [];
  allResult.leastNumRev = [];
  var count = 0;
  var numberofarticle = parseInt(req.query.numberofarticle);
  Revision.find2MostNumRev(numberofarticle, function(err, result){
    if(err){console.log("ERROR");}
    else{
      for(var i=0;i<numberofarticle;i++){
        allResult.mostNumRev[i] = result[i]._id;
      }
      //res.render('highestRevision.ejs', {allResult: allResult});
      count++;
      parseHighestRevResult(allResult, res, count, 'highestRevision.ejs');
    }
  });
  Revision.find2LeastNumRev(numberofarticle, function(err, result){
    if(err){console.log("ERROR");}
    else{
      for(var i=0;i<numberofarticle;i++){
        allResult.leastNumRev[i] = result[i]._id;
      }
      count++;
      parseHighestRevResult(allResult, res, count, 'highestRevision.ejs');
    }
  });
};

function parseHighestRevResult(allResult, res, count, viewfile){
  if(count < 2){return;}
  else{res.render(viewfile, {allResult: allResult});}
}

/*
module.exports.showResult = function(req, res) {

  title = req.query.title;
    console.log(title);

    Revision.findTitleLatestRev(title, function(err,result){
  		if (err){
  			console.log("Cannot find " + title + ",s latest revision!")
  		}else{
  			// console.log(result)
        if(result[0] != null){
          //revision = result[0];
          allResult.pop(result[0]);
          //renderMain(res, revision);

          $.get('/main/getResult', title, function(res,req){

          });
    			//res.render('main.ejs',{title: title, revision:revision})
        }
        else{
          console.log("Cannot find " + title + "'s latest revision!")
        }

  		}
  	})


};*/
