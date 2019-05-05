google.charts.load('current', {packages: ['corechart']});
google.load("visualization", "1", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawOverallBarChart);
google.charts.setOnLoadCallback(drawOverallPieChart);
google.charts.setOnLoadCallback(drawArticleBarChart);
google.charts.setOnLoadCallback(drawArticlePieChart);


$(document).ready(function(){
    //For getting article by overall number of least/most revisions
    $('#numOfArticleSubmit').on('click', function(e){
      var getnumber = $('#number').val();
      console.log(getnumber);
      var parameters = {numberofarticle: $('#number').val() };
      $.get('/main/getHighLowRev', parameters, function(result) {
          drawArticleBarChart();
          drawArticlePieChart();
          $('#numHighLowResult').html(result);
      });
    });

    $('#selectArticleSubmit').on('click', function(e){
      var article = $('#selectArticle').val();
      console.log(article);
      var encodedArticle = encodeURIComponent(article);
      //var parameter = {articletitle: $('#selectArticle').val()};
      $.get("/main/article?title=" + encodedArticle, function(result) {
        $('#individualTitle').html(result);
      });
    });
});


function drawOverallBarChart(){
  var jsondata = {};
  //console.log(overallBarChart);
  overallBarChart.forEach(function(field){
    if(!jsondata[field.year]){
      jsondata[field.year] = {};
    }
    //console.log(field.numbOfRev);
    jsondata[field.year][field.usertype] = parseInt(field.numbOfRev);
  })

  var chartTitle = "Revision number distribution by year and by user type across the whole dataset";
  var htmlSection = "#overallBarChartSec";
  createBarChart(jsondata, chartTitle, htmlSection);
}


function drawArticleBarChart(){
  var jsondata = {};
  if (typeof articleBarChart === 'undefined'){
    console.log("do nothing");
  }
  else{
    articleBarChart.forEach(function(field){
      if(!jsondata[field.year]){
        jsondata[field.year] = {};
      }
      jsondata[field.year][field.usertype] = parseInt(field.numbOfRev);
    })
    var chartTitle = "Revision number distributed by year and by user type of the article: " + $('#selectArticle').val();
    var htmlSection = "#articleBarChartSec";
    createBarChart(jsondata, chartTitle, htmlSection);
  }
}

function drawOverallPieChart(){
  var usertype = [['user type', 'number of revision']];
  var pieindex;
  var i = 0;
  //console.log(overallPieChart);
  overallPieChart.forEach(function(field){
    //console.log(field.usertype + field.numbOfRev);
    var piesection = [field.usertype, field.numbOfRev];
    usertype.push(piesection);
    if(field.usertype == "admin"){pieindex = i;}
    i++;
  })
  var str = "";
  var tooltip = [];
  //console.log(overallRevAdminType);
  overallRevAdminType.forEach(function(field){
    //console.log(field._id + field.numbOfRev);
    str = str + field._id + " " + field.numbOfRev + "<br>";
  })
  tooltip.push(str);
  var chartTitle = "Revision number distribution by user type across the whole data set";
  var htmlSection = "#overallPieChartSec";
  createPieChart(usertype, chartTitle, tooltip, htmlSection, pieindex);
}

function drawArticlePieChart(){
  if (typeof articlePieChart != 'undefined'){
    var usertype = [['user type', 'number of revision']];
    var pieindex;
    var i = 0;
    articlePieChart.forEach(function(field){
      var piesection = [field.usertype, field.numbOfRev];
      usertype.push(piesection);
      if(field.usertype == "admin"){pieindex = i;}
      i++;
    })
    var str = "";
    var tooltip = [];
    articleAdminType.forEach(function(field){
      str = str + field._id + " " + field.numbOfRev + "<br>";
    })
    tooltip.push(str);
    var chartTitle = "Revision number distribution by user type of the article: " + $('#selectArticle').val();
    var htmlSection = "#articlePieChartSec";
    createPieChart(usertype, chartTitle, tooltip, htmlSection, pieindex);
  }
}






function createBarChart(jsondata, chartTitle, htmlSection){
  var bar = [['Year', 'Administrator', 'Anonymous', 'Bot', 'Regular']];
  for(var row in jsondata){
    var barRow = [row];
    barRow.push(jsondata[row].admin);
    barRow.push(jsondata[row].anon);
    barRow.push(jsondata[row].bot);
    barRow.push(jsondata[row].regular);
    bar.push(barRow);
  }
  var data = google.visualization.arrayToDataTable(bar);
  var options = {
      'title': chartTitle,
      'width':850,
      'height':450
  };
  var chart = new google.visualization.ColumnChart($(htmlSection)[0]);
  chart.draw(data, options);
}

function createPieChart(usertype, chartTitle, tooltip, htmlSection, pieindex){
  var data = google.visualization.arrayToDataTable(usertype);
  var options = {
      'title':chartTitle,
      'width':850,
      'height':450,
      tooltip: { isHtml: true }
  };
  var chart = new google.visualization.PieChart($(htmlSection)[0]);

  var sliceid = 0;
  function eventHandler(e){
    chart.setSelection([e]);
    try {
      selection = chart.getSelection();
      //console.log(selection);
      sliceid = selection[0].row - pieindex;
      //console.log("sliceid: " + sliceid);
    }
    catch(err) {
      ;
    }
    //$(".google-visualization-tooltip-item-list li:eq(0)").css("font-weight", "bold");
    $(".google-visualization-tooltip-item-list li:eq(1)").html(tooltip[sliceid]).css("font-family", "Arial");
  }
  google.visualization.events.addListener(chart, 'onmouseover', eventHandler);
  chart.draw(data, options);
}
