google.charts.load('current', {packages: ['corechart']});
google.charts.setOnLoadCallback(drawArticleBarChartTop5Users);

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
