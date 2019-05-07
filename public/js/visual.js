google.charts.load('current', {packages: ['corechart']});
google.load("visualization", "1", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawOverallBarChart);
google.charts.setOnLoadCallback(drawOverallPieChart);
google.charts.setOnLoadCallback(drawArticleBarChart);
google.charts.setOnLoadCallback(drawArticlePieChart);
google.charts.setOnLoadCallback(drawArticleBarChartTop5Users);


$(document).ready(function(){
    //When submitted number of article, respond with number of least/most revisions for overall data
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

    //When submitted article title, respond with that article's data analytics
    $('#selectArticleSubmit').on('click', function(e){
      var article = $('#selectArticle').val();
      console.log(article);
      var encodedArticle = encodeURIComponent(article);
      $.get("/main/article?title=" + encodedArticle, function(result) {
        //console.log(result);
        $('#individualTitle').html(result)
      });
    });

    //When submitted user lists and year range of the article, respond with bar chart
    $('#selectUserYrSubmit').on('click', function(e){
      var article = $('#selectArticle').val();
      var topusers = $('#selectUser').val();
      var from = $('#selectMinYear').val();
      var to = $('#selectMaxYear').val();
      if(from >= to){
        console.log("invalid range");
        $('#errormsg').html("Invalid year range. Please select the year range again.")
        e.preventDefault();
      }
      else if(topusers == null || from == null || to == null){
        console.log("not all selected");
        $('#errormsg').html("Some fields are not selected. Please select all fields.")
        e.preventDefault();
      }
      else{
        var encodedArticle = encodeURIComponent(article);
        var encodedUser = encodeURIComponent(topusers);
        var route = "/main/article/getBar?title=" + encodedArticle + "&topusers=" + encodedUser + "&from=" + from + "&to=" + to;
        console.log(from + " " + to + " " + topusers);
        console.log(route);
        //console.log(typeof(user));
        $.get(route, function(result) {
          console.log(result);
          drawArticleBarChartTop5Users();
          $('#individualTitleTop5BarChart').html(result)
        });
      }
    });

    //When submitted author's name, respond with that author's data analytics result
    $('#selectAuthorSubmit').on('click', function(e){
      var author = $('#selectAuthor').val();
      var encodedAuthor = encodeURIComponent(author);
      $.get("/main/author?user=" + encodedAuthor, function(result) {
        //console.log(result);
        $('#authorAnalyticsResult').html(result)
      });
    });

    //When submitted article's title of an author, respond with list of revisions' timestamps
    $('#selectAuthorArticleSubmit').on('click', function(e){
      var author = $('#selectAuthor').val();
      var encodedAuthor = encodeURIComponent(author);
      var title = $('#selectAuthorArticle').val();
      var encodedTitle = encodeURIComponent(title);
      $.get("/main/author/showTimestamp?user=" + encodedAuthor + "&title=" + encodedTitle, function(result) {
        //console.log(result);
        $('#timestampResult').html(result)
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
    //console.log("do nothing");
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

function drawArticleBarChartTop5Users(){
  var array = [['Year', 'Number of revisions']];
  if (typeof articleBarChartTop5 === 'undefined'){
    //console.log("do nothing");
  }
  else{
    articleBarChartTop5.forEach(function(field){
      //console.log(parseInt(field._id) + " " + parseInt(field.numbOfRev));
      array.push([field._id, parseInt(field.numbOfRev)]);
    })
    var data = google.visualization.arrayToDataTable(array);

    var options = {
      'width': 850,
      'height': 300,
      'title': "Revision number distributed by year made by one or a few of the top 5 users for this article",
      hAxis: {
        title: 'timestamp'
      }
    };
    var chart = new google.visualization.ColumnChart($("#articleBarChartTop5Sec")[0]);
    chart.draw(data, options);
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
