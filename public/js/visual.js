google.charts.load('current', {packages: ['corechart']});
//google.load("visualization", "1", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawOverallBarChart);
google.charts.setOnLoadCallback(drawOverallPieChart);

$(document).ready(function(){
    //When submitted number of article, respond with number of least/most revisions for overall data
    $('#numOfArticleSubmit').on('click', function(e){
      var getnumber = $('#number').val();
      console.log(getnumber);
      var parameters = {numberofarticle: $('#number').val() };
      $.get('/main/getHighLowRev', parameters, function(result) {
          $('#numHighLowResult').html(result);
      });
    });

    //When submitted article title, respond with that article's data analytics
    $('#selectArticleSubmit').on('click', function(e){
      var article = $('#selectArticle').val();
      console.log(article);
      var encodedArticle = encodeURIComponent(article);
      $.get("/main/article?title=" + encodedArticle, function(result) {
        //drawArticleBarChart();
        //drawArticlePieChart();
        //console.log(result);
        $('#individualTitle').html(result)
      });
    });

    //When submitted author's name, respond with that author's data analytics result
    $('#selectAuthorSubmit').on('click', function(e){
      var author = $('#selectAuthor').val();
      var encodedAuthor = encodeURIComponent(author);
      console.log(author);
      $.get("/main/author?user=" + encodedAuthor, function(result) {
        //console.log(result);
        $('#authorAnalyticsResult').html(result)
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
      'title':"Revision number distribution by year and by user type across the whole dataset",
      'width':850,
      'height':450
  };
  var chart = new google.visualization.ColumnChart($("#overallBarChartSec")[0]);
  chart.draw(data, options);
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

  var data = google.visualization.arrayToDataTable(usertype);
  var options = {
      'title':"Revision number distribution by user type across the whole data set",
      'width':850,
      'height':450,
      tooltip: { isHtml: true }
  };
  var chart = new google.visualization.PieChart($("#overallPieChartSec")[0]);

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
