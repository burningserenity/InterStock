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

var API_KEY = '8cvtFcrz_qNR_g2U9tGK';
var queryURL = 'https://www.quandl.com/api/v3/datasets/'
var exchange;
var symbol;

$.ajax({
  url: queryURL + exchange + '/' + symbol + '.json?api_key=' + API_KEY,
  method: "GET"
}).done(function(response) {
  console.log(response);
});

$("#submit").on("click", function(event){
  event.preventDefault;
  exchange = dropdownData-value;
  symbol = $("#search").val();
  getStock(exchange, symbol);
})
