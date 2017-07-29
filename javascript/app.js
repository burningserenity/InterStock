// Initialize Firebase
var config = {
  apiKey: "AIzaSyAl9dOoxfYyfKZAcvopxCRAhBeEkgNAQeA",
  authDomain: "interstock-9002d.firebaseapp.com",
  databaseURL: "https://interstock-9002d.firebaseio.com",
  projectId: "interstock-9002d",
  storageBucket: "interstock-9002d.appspot.com",
  messagingSenderId: "154569829116"
};
firebase.initializeApp(config);


var database = firebase.database;

var API_KEY = '8cvtFcrz_qNR_g2U9tGK';
var queryURL = 'https://www.quandl.com/api/v3/datasets/';
var exchange = "";
var symbol = "";



//mobilizing the carousel
$('.carousel[data-type="multi"] .item').each(function() {
  var next = $(this).next();
  if (!next.length) {
    next = $(this).siblings(':first');
  }
  next.children(':first-child').clone().appendTo($(this));

  for (var i = 0; i < 2; i++) {
    next = next.next();
    if (!next.length) {
      next = $(this).siblings(':first');
    }
    next.children(':first-child').clone().appendTo($(this));
  }
});

$('#countryDrop li').click(function(){
    var $this = $(this);
    exchange = $this.attr("value");
    console.log("Stock:"+exchange);
});


$("#symbolsubmit").on("click", function(event) {

  symbol = $("#symbolsearch").val().trim();

  console.log("Stock 2:"+exchange);
  
  var stringapi = "";

  if (exchange === "BSE") {
    symbol = "BOM" + symbol;
  }

  stringapi = queryURL + exchange + '/' + symbol + '.json?api_key=' + API_KEY,

    console.log(stringapi);


  $.ajax({
    url: queryURL + exchange + '/' + symbol + '.json?api_key=' + API_KEY,

    method: "GET"
  }).done (function(response) {
       console.log(response);
       displayStock(response);
     })
    .fail (function(XMLHttpRequest, textStatus, errorThrown) {
           $("#stockName").empty();
           $("#stockSymbol").empty();
           $("#stockPrice").empty();
           $("#stockDate").empty();
           $("<h4>").attr('class', 'stockSymbolDisplay').html('We did not find any matches for the Information you entered. Please try again').appendTo("#stockSymbol");   
     })
 });


$("#emailSubmit").on("click", function(event) {
  var userEmail = $("#email").val();
});

function displayStock(response) {
  $("#stockName").empty();
  $("#stockSymbol").empty();
  $("#stockPrice").empty();
  $("#stockDate").empty();
  $("#chart").empty();
  $("<h3>").attr('class', 'stockNameDisplay').html('Name: ' + response.dataset.name).appendTo("#stockName");
  $("<h4>").attr('class', 'stockSymbolDisplay').html('Stock Symbol/Code: ' + response.dataset.dataset_code).appendTo("#stockSymbol");
  $("<h4>").attr('class', 'stockCurrentPrice').html('Last Closing Price (USD): ' + '$' + response.dataset.data[0][1]).appendTo("#stockPrice");
  $("<h4>").attr('class', 'stockCurrentDate').html('Date: '+ response.dataset.data[0][0]).appendTo("#stockDate");
  
  var label =[];
  var data = [];

  for (var i = 10; i > 0; i--) {
   
    label.push(response.dataset.data[i][0]);
    data.push(response.dataset.data[i][1]);
  }

    console.log(label);
    console.log(data);

  var data = {
      //labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
       labels: label,
       datasets: [{
           label: "Price",
           backgroundColor: "rgba(0, 0, 0, 0)",
           borderColor: "rgba(0, 57, 122, 1)",
           borderWidth: 2,
           hoverBackgroundColor: "rgba(255,99,132,0.4)",
           hoverBorderColor: "rgba(255,99,132,1)",
           data: data,
       }]
   };

var options = {
  maintainAspectRatio: false,
  scales: {
    yAxes: [{
      stacked: true,
      gridLines: {
        display: true,
        color: "rgba(0, 0, 255, 0.3)"
      }
    }],
    xAxes: [{
      gridLines: {
        display: false
      }
    }]
  }
};

Chart.Line('chart', {
  options: options,
  data: data
});

}

