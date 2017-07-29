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


// Quandl API
// Example : https://www.quandl.com/api/v3/datasets/WIKI/FB.json?api_key=YOURAPIKEY
// Tokyo Stock Exchange, Japan: TSE
// National Stock Exchange of India: NSE
// Frankfurt Stock Exchange, Germany: FSE
//  Boerse Stuttgart, Germany: SSE
//  London Stock Exchange, England: LSE
//  Euronext Stock Exchange: EURONEXT -> This one is international and we can return the country with this one!
//  Bombay Stock Exchange, India: BSE -> Prepend 'BOM' to each symbol

$("#symbolsubmit").on("click", function(event) {

  symbol = $("#symbolsearch").val().trim();
  var stringapi = "";

  if (exchange === "BSE") {
    symbol = "BOM" + symbol;
  }

  stringapi = queryURL + exchange + '/' + symbol + '.json?api_key=' + API_KEY,

    console.log(stringapi);


  $.ajax({
    url: queryURL + exchange + '/' + symbol + '.json?api_key=' + API_KEY,

    method: "GET"
  }).done(function(response) {
    console.log(response);
    displayStock(response);
  });


});


$('#countryDrop li').click(function() {
  var $this = $(this);
  var $clone = $this.clone();
  exchange = $this.attr("data-value");
  console.log(exchange);
  $("#listItemHolder").css('visibility', 'visible');
  $("#listItemHolder").empty();
  $clone.appendTo("#listItemHolder");
})

$("#emailSubmit").on("click", function(event) {
  var userEmail = $("#email").val();
})

function displayStock(response) {
  $("#stockName").empty();
  $("#stockSymbol").empty();
  $("#stockPrice").empty();
  $("<h3>").attr('class', 'stockNameDisplay').html('Name: ' + response.dataset.name).appendTo("#stockName");
  $("<h4>").attr('class', 'stockSymbolDisplay').html('Stock Symbol/Code: ' + response.dataset.dataset_code).appendTo("#stockSymbol");
  $("<h4>").attr('class', 'stockCurrentPrice').html('Last Closing Price (USD): ' + '$' + response.dataset.data[0][4]).appendTo("#stockPrice");
}
