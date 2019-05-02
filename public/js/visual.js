google.charts.load('current', {packages: ['corechart']});
google.load("visualization", "1", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawOverallBarChart);
google.charts.setOnLoadCallback(drawOverallPieChart);


$(document).ready(function(){
    $('#numHighest').on('click', function(e){
      var getnumber = $('#number').val();
      console.log(getnumber);
      var parameters = {numberofarticle: $('#number').val() };
      $.get('/main/getHighestRevision', parameters, function(result) {
          $('#testtt').html(result);
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
  //console.log(overallPieChart);
  overallPieChart.forEach(function(field){
    //console.log(field.usertype + field.numbOfRev);
    var piesection = [field.usertype, field.numbOfRev];
    usertype.push(piesection);
  })

  var str = "";
  var tooltip = [];
  console.log(overallRevAdminType);
  overallRevAdminType.forEach(function(field){
    console.log(field._id + field.numbOfRev);
    //var eachtype = [field._id, field.numbOfRev];
    //admintype.push(eachtype);
    str = str + field._id + " " + field.numbOfRev + "<br>";
  })
  tooltip.push(str);
  console.log(tooltip);
  console.log(str);

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
      sliceid = selection[0].row -1;
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



//Drawing bar chart for individual article
function drawBarChartofArticle(json){
  var jsondata = {};
  json.forEach(function(field){
    if(!jsondata[field.year]){
      jsondata[field.year] = {};
    }
    jsondata[field.year][field.usertype] = field.numOfUser;
  })

  var bar = [['year', 'admin', 'anon', 'bot', 'regular']];
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
      'title':"Revision distribution by year and by user type for this article",
      'width':870,
      'height':300
  };
  var chart = new google.visualization.ColumnChart($("#barChartforArticle")[0]);
  chart.draw(data, options);
}
