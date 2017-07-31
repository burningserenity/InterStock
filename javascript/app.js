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

// Quandl API
// Example : https://www.quandl.com/api/v3/datasets/WIKI/FB.json?api_key=YOURAPIKEY
// Tokyo Stock Exchange, Japan: TSE
// National Stock Exchange of India: NSE
// Frankfurt Stock Exchange, Germany: FSE
//  Boerse Stuttgart, Germany: SSE
//  London Stock Exchange, England: LSE
//  Euronext Stock Exchange: EURONEXT -> This one is international and we can return the country with this one!
//  Bombay Stock Exchange, India: BSE -> Prepend 'BOM' to each symbol

// API Variables for Quandl
var API_KEY = '8cvtFcrz_qNR_g2U9tGK';
var queryURL = 'https://www.quandl.com/api/v3/datasets/';
var exchange = "";
var exchangeList = [
	'TSE', 'NSE', 'FSE', 'SSE', 'LSE', 'EURONEXT', 'BSE'
];
var symbol = "";

// News API
// Example: https://newsapi.org/v1/articles?source=bloomberg&apiKey=fd8cd0087c7249fb8f5fdcd0cfda2e95
// Bloomberg: bloomberg
// Business Insider: business-insider
// Business Insider UK: business-insider-uk
// CNBC: cnbc
// Financial Times: financial-times
// Fortune: fortune
// The Economist: the-economist
// The Wall Street Journal: the-wall-street-journal

//API Variables for NewsAPI
var API_KEY_NEWS = 'fd8cd0087c7249fb8f5fdcd0cfda2e95';
var queryURL_NEWS = 'https://newsapi.org/v1/articles?source=';
var newsSrc = "";
var newsSrcList = [
	'bloomberg', 'business-insider', 'business-insider-uk', 'cnbc', 'financial-times', 'fortune',
	'the-economist',	'the-wall-street-journal'
];


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



function newsforcarousel() {

	var stringapi2 = "";

	stringapi2 = queryURL_NEWS + '?' + newsSrc + '&apiKey=' + API_KEY_NEWS

		console.log(stringapi2);

	$.ajax({
			url: stringapi2,
			method: "GET"
		}).done(function(response) {
			console.log(response);
		});
}

$("#symbolsubmit").on("click", function(event) {
	$("#stockName").empty();
	$("#stockSymbol").empty();
	$("#stockPrice").empty();
	$("#stockDate").empty();
	// FOR CLEAN CHART OF THE SCREEN
	$(".chart-container").empty();
	var newCanvas = $("<canvas id='chart'>");
	$(".chart-container").append(newCanvas);
	var stringapi = "";
	symbol = $("#symbolsearch").val().trim();

	stringapi = queryURL + exchange + '/' + symbol + '.json?api_key=' + API_KEY,

		console.log(stringapi);
	if (exchange === "") {
		for (i = 0; i < exchangeList.length; i++) {
			exchange = exchangeList[i];
			if (exchange === "BSE") {
				symbol = "BOM" + symbol;
			}
			$.ajax({
				url: queryURL + exchange + '/' + symbol + '.json?api_key=' + API_KEY,
				method: "GET"
			}).done(function(response) {
				console.log(response);
				displayStock(response);
			});
			var delay = setTimeout(delayfunc(), 100);
		}
		if ($("#stockName").find("h3").length === 0) {
					$("<h4>").attr('class', 'stockNameDisplay').html('We did not find any matches for the Information you entered. Please try again').appendTo("#stockSymbol");
		}
		exchange = "";
	} else {
		if (exchange === "BSE") {
			symbol = "BOM" + symbol;
		}
		$.ajax({
				url: queryURL + exchange + '/' + symbol + '.json?api_key=' + API_KEY,
				method: "GET"
			}).done(function(response) {
				console.log(response);
				displayStock(response);
			})
			.fail(function(XMLHttpRequest, textStatus, errorThrown) {
				$("#stockName").empty();
				$("#stockSymbol").empty();
				$("#stockPrice").empty();
				$("#stockDate").empty();
				// FOR CLEAN CHART OF THE SCREEN
				$(".chart-container").empty();
				var newCanvas = $("<canvas id='chart'>");
				$(".chart-container").append(newCanvas);
				// END CLEAN THE CHAR
				$("<h4>").attr('class', 'stockNameDisplay').html('We did not find any matches for the Information you entered. Please try again').appendTo("#stockSymbol");
			});
	}
});



$("#emailSubmit").on("click", function(event) {
	var userEmail = $("#email").val();
});

function displayStock(response) {
	$("#stockName").empty();
	$("#stockSymbol").empty();
	$("#stockPrice").empty();
	$("#stockDate").empty();
	$(".hideWell").css("visibility", "visible");
	$("<h3>").attr('class', 'stockNameDisplay').html('Name: ' + response.dataset.name).appendTo("#stockName");
	$("<h4>").attr('class', 'stockSymbolDisplay').html('Stock Symbol/Code: ' + response.dataset.dataset_code).appendTo("#stockSymbol");
	$("<h4>").attr('class', 'stockCurrentPrice').html('Last Closing Price (USD): ' + '$' + response.dataset.data[0][1]).appendTo("#stockPrice");
	$("<h4>").attr('class', 'stockCurrentDate').html('Date: ' + response.dataset.data[0][0]).appendTo("#stockDate");

	var label = [];
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

	//FOR CLEAN THE SCREEN OF CHART
	$(".chart-container").empty();

	var newCanvas = $("<canvas id='chart'>");
	$(".chart-container").append(newCanvas);
	//END CLEAN THE CHART

	Chart.Line('chart', {
		options: options,
		data: data
	});

}

$('#countryDrop li').click(function() {
	var $this = $(this);
	var $clone = $this.clone();
	exchange = $this.attr("data-value");
	console.log(exchange);
	$("#listItemHolder").css('visibility', 'visible');
	$("#listItemHolder").empty();
	$clone.appendTo("#listItemHolder");
});


$("#emailSubmit").on("click", function(event) {
	var userEmail = $("#email").val();
});

function delayfunc() {}
