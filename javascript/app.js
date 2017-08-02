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
var auth = firebase.auth;
var userEmail = "";
var userPassword = "";

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
var currency;
var exchangeList = [
	TSE = {
		name: 'Tokyo Stock Exchange',
		symbol: 'TSE',
		currencyName: 'Yen',
		currencyCode: 'JPY',
		currencySign: '¥'
	},
	NSE = {
		name: 'National Stock Exchange of India',
		symbol: 'NSE',
		currencyName: 'Indian Rupee',
		currencyCode: 'INR',
		currencySign: '₹'
	},
	FSE = {
		name: 'Boerse Frankfurt',
		symbol: 'FSE',
		currencyName: 'Euro',
		currencyCode: 'EUR',
		currencySign: '€'
	},
	SSE = {
		name: 'Boerse Stuttgart',
		symbol: 'SSE',
		currencyName: 'Euro',
		currencyCode: 'EUR',
		currencySign: '€'
	},
	LSE = {
		name: 'London Stock Exchange',
		symbol: 'LSE',
		currencyName: 'Pound Sterling',
		currencyCode: 'GBP',
		currencySign: '£'
	},
	EURONEXT = {
		name: 'Euronext',
		symbol: 'EURONEXT',
		currencyName: 'Euro',
		currencyCode: 'EUR',
		currencySign: '€'
	},
	BSE = {
		name: 'Bombay Stock Exchange',
		symbol: 'BSE',
		currencyName: 'Indian Rupee',
		currencyCode: 'INR',
		currencySign: '₹'
	}
];
var symbol = "";
var queryCount = 0;

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

// leave only four (4) source 'cause there are 4 squares for News 08-01-2017
var newsSrcList = [
	'bloomberg', 'business-insider-uk', 'cnbc', 'the-economist'
];
var newsresult = [];


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


// Function to AJAX call to API News into carousel 08-01-2017
function newsforcarousel() {

	var stringapi2 = "";
	newsresult = [];
	var p = 0;

	for (var i = 0; i < newsSrcList.length; i++) {

		newsSrc = newsSrcList[i];


		stringapi2 = queryURL_NEWS + newsSrc + '&apiKey=' + API_KEY_NEWS

		console.log(stringapi2);

		$.ajax({
			url: stringapi2,
			'data-type': "jsonp",
			method: "GET"
		}).done(function(response) {

			displaycarouselnews(response.articles[i].urlToImage,
				response.articles[i].url,
				response.articles[i].title,
				response.source, p);
			p++;


		});

	}

	console.log(newsresult);
	return newsresult;
}

// Function to display News into carousel 08-01-2017
function displaycarouselnews(newscar, newscar2, newscar3, newscar4, e) {

	var source = newscar4.charAt(0).toUpperCase() + newscar4.slice(1);

	switch (e) {

		case 0:
			$(".img1").attr("src", newscar);
			$(".hnews1").attr('href', newscar2);
			$(".news1").html('<h4>' + newscar3 + '</h4>');
			$(".srcnews1").html('<p>' + source + '</p>');
		case 1:
			$(".img2").attr("src", newscar);
			$(".hnews2").attr('href', newscar2);
			$(".news2").html('<h4>' + newscar3 + '</h4>');
			$(".srcnews2").html('<p>' + source + '</p>');
		case 2:
			$(".img3").attr("src", newscar);
			$(".hnews3").attr('href', newscar2);
			$(".news3").html('<h4>' + newscar3 + '</h4>');
			$(".srcnews3").html('<p>' + source + '</p>');
		case 3:
			$(".img4").attr("src",newscar);
			$(".hnews4").attr('href', newscar2);
			$(".news4").html('<h4>' + newscar3 + '</h4>');
			$(".srcnews4").html('<p>' + source + '</p>');
	}

}
//END

// Click event to query Quandl for stock information and display said information on the page
$("#symbolsubmit").on("click", function(event) {
	event.preventDefault();
	emptyStockDisplay();
	// Remove and add stock chart
	stockChart();
	// Empty string to hold Quandl query
	var stringapi = "";
	// Get stock symbol from user input
	symbol = $("#symbolsearch").val().toUpperCase().trim();
	// Put entire Quandl query into variable and log it to the console
	stringapi = queryURL + exchange + '/' + symbol + '.json?api_key=' + API_KEY,
		console.log(stringapi);
	// Check if the user selected a specific exchange or not
	if (exchange === "") {
		queryCount = 0;
		// If the user did not specify an exchange, check each of them for the stock requested
		for (i = 0; i < exchangeList.length; i++) {
			exchange = exchangeList[i].symbol;
			// On the Quandl API, queries to the Bombay Stock Exchange must be prefixed with "BOM"
			if (exchange === "BSE") {
				symbol = "BOM" + symbol;
			}
			$.ajax({
				url: queryURL + exchange + '/' + symbol + '.json?api_key=' + API_KEY,
				method: "GET",
				'data-type': 'jsonp'
			}).done(function(response) {
				console.log(response);
				// Display found stock on the page
				displayStock(response);
				queryCount++;
			});
		}
		// If no stock found in any exchange, display error message on page; queryCount variable
		// ensures error message isn't displayed prematurely
		if ($("#stockName").find("h3").length === 0 && queryCount === exchangeList.length) {
			$("<h4>").attr('class', 'stockNameDisplay').html('We did not find any matches for the Information you entered. Please try again').appendTo("#stockSymbol");
		}
		// When finished querying, empty exchange string
		exchange = "";
	}
	// If the user did specify an exchange, query only that exchange
	else {
		// Same as before
		if (exchange === "BSE") {
			symbol = "BOM" + symbol;
		}
		$.ajax({
				url: queryURL + exchange + '/' + symbol + '.json?api_key=' + API_KEY,
				method: "GET",
				'data-type': 'jsonp'
			}).done(function(response) {
				console.log(response);
				// Display stock on page, if found
				displayStock(response);
			})
			// Any fail status e.g. a 404 error results in error display
			.fail(function(XMLHttpRequest, textStatus, errorThrown) {
				emptyStockDisplay();
				stockChart();
				$("<h4>").attr('class', 'stockNameDisplay').html('We did not find any matches for the Information you entered. Please try again').appendTo("#stockSymbol");
			});
	}
});

function displayStock(response) {
	emptyStockDisplay();
	for (i = 0; i < exchangeList.length; i++) {
		if (exchangeList[i].symbol === response.dataset.database_code) {
			currency = exchangeList[i].currencySign;
		}
	}
	$(".hideWell").css("visibility", "visible");
	$("<h3>").attr({
		class: 'stockNameDisplay',
		'data-value': response.dataset.name
	}).html('Name: ' + response.dataset.name).appendTo("#stockName");
	$("<h4>").attr({
		class: 'stockExchangeDisplay',
		'data-value': response.dataset.database_code
	}).html('Exchange: ' + response.dataset.database_code).appendTo("#exchangeSymbol");
	$("<h4>").attr({
		class: 'stockSymbolDisplay',
		'data-value': response.dataset.dataset_code
	}).html('Stock Symbol/Code: ' + response.dataset.dataset_code).appendTo("#stockSymbol");
	$("<h4>").attr({
		class: 'stockCurrentPrice',
		'data-value': currency + response.dataset.data[0][1]
	}).html('Last Closing Price: ' + currency + response.dataset.data[0][1]).appendTo("#stockPrice");
	$("<h4>").attr({
		class: 'stockCurrentDate',
		'data-value': response.dataset.data[0][0]
	}).html('Date: ' + response.dataset.data[0][0]).appendTo("#stockDate");
	$("<button>").attr({
		type: 'button',
		class: 'btn btn-info',
		id: 'watchStock'
	}).html("Save to Watchlist").appendTo("#save-btn-col");

	// Populate stock chart
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

	stockChart();
	Chart.Line('chart', {
		options: options,
		data: data
	});

	$("#watchStock").on("click", function(event) {
		console.log("clicked");
		if ($("#watchlist-col").find("table").length === 0) {
			createWatchlist();
		}
		addToWatchlist();
	});
}

// Page Document Ready 08/01/2017
$(document).ready(function() {

	newsforcarousel();

	setInterval(function() {
		newsforcarousel();
	}, 180000);

});

// Click function to assign an exchange to be queried and display it on the Navbar
$('#countryDrop li').click(function() {
	var $this = $(this);
	var $clone = $this.clone();
	exchange = $this.attr("data-value");
	console.log(exchange);
	$("#listItemHolder").css('visibility', 'visible');
	$("#listItemHolder").empty();
	$clone.appendTo("#listItemHolder");
});


// Gets the user's email address

$("#emailSubmit").on("click", function(event) {
	userEmail = $("#email").val();
	userPassword = $("#passwordinput").val();
});

// Function to clear the stock display
function emptyStockDisplay() {
	$("#stockName").empty();
	$("#exchangeSymbol").empty();
	$("#stockSymbol").empty();
	$("#stockPrice").empty();
	$("#stockDate").empty();
	$("#save-btn-col").empty();
}

// Function to delete and reinitialize the stock chart
function stockChart() {
	$(".chart-container").empty();
	var newCanvas = $("<canvas id='chart'>");
	$(".chart-container").append(newCanvas);
}

// Function to create stock watchlist
function createWatchlist() {
	$("<table>").attr({
		class: 'table table-striped',
		id: 'watchlist-table'
	}).appendTo("#watchlist-col");
	$("<thead>").appendTo("#watchlist-table");
	$("<tr>").attr('id', 'theadRow').appendTo("thead");
	$("<th>").attr('id', 'stockNameTH').html('Stock Name').appendTo("#theadRow");
	$("<th>").attr('id', 'symbolTH').html('Symbol').appendTo("#theadRow");
	$("<th>").attr('id', 'exchangeTH').html('Exchange').appendTo("#theadRow");
	$("<th>").attr('id', 'savedPriceTH').html('Price When First Saved').appendTo("#theadRow");
	$("<th>").attr('id', 'currentPriceTH').html('Current Price').appendTo("#theadRow");
	$("<th>").attr('id', 'changeTH').html('Change').appendTo("#theadRow");
	$("<tbody>").appendTo("#watchlist-table");
}

// Function to add a new stock to the watchlist
function addToWatchlist() {
	var savedName = $(".stockNameDisplay").attr('data-value');
	var savedExchange = $(".stockExchangeDisplay").attr('data-value');
	var savedSymbol = $(".stockSymbolDisplay").attr('data-value');
	var savedPrice = $(".stockCurrentPrice").attr('data-value');
	$("tbody").append("<tr><td class='stockNameTD'>" + savedName +
		"</td> + <td class='symbolTD'>" + savedSymbol + "</td> <td class='exchangeTD'>" + savedExchange +
		"</td><td class='savedPriceTD'>" + savedPrice + "</td><td class='currentPriceTD'>" +
		savedPrice + "</td><td class='changeTD'>" + '0.00' + "</td></tr>");
}

function registerUser() {
	$("#modalError").text("");
	$("#modalRegisterError").text("");
	$("#signUpEmail").css('border-color', '#CCC');
	$("#password").css('border-color', '#CCC');
	$("#reenterpassword").css('border-color', '#CCC');
	$("#inputpassword").css('border-color', '#CCC');
	$("#Email").css('border-color', '#CCC');
	auth().createUserWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		if (errorCode === 'auth/invalid-email') {
			$("#signUpEmail").css('border-color', 'red');
			$("#modalRegisterError").text("Please enter a valid email address");
		}
		else if (errorCode === 'auth/email-already-in-use'){
			$("#signUpEmail").css('border-color', 'red');
			$("#modalRegisterError").text("User already registered with that email address");
		}
		else {
			$("#myModal").modal('hide');
		}
	});
}

function loginUser() {
	auth().signInWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		if (errorCode === 'auth/invalid-email') {
			$("#Email").css('border-color', 'red');
			$("#modalError").text("Please enter a valid email address");
		}
		else if (errorCode === 'auth/user-not-found') {
			$("#Email").css('border-color', 'red');
			$("#modalError").text("No user with that email address exists");
		}
		else if (errorCode === 'auth/wrong-password') {
			$("#inputpassword").css('border-color', 'red');
			$("#modalError").text("Wrong password");
		}
	});
	$("#myModal").modal('hide');
}

function logoutUser() {
	auth().signOut().then(function() {
		// Sign-out successful.
	}).catch(function(error) {
		// An error happened.
	});
}

auth().onAuthStateChanged(function(user) {
	if (user) {
	} else {
	}
});

$("#confirmsignup").on("click", function(event) {
	userEmail = $("#signUpEmail").val();
	if ($("#password").val() === $("#reenterpassword").val()) {
		userPassword = $("#password").val();
	}

	else {
		$("#password").css('border-color', 'red').val("");
		$("#reenterpassword").css('border-color', 'red').val("");
		$("#modalRegisterError").text("Passwords do not match");
	}

	if (userEmail !== "" && userPassword !== "") {
		console.log("Match");
		registerUser(userEmail, userPassword);
	}
	else if (userEmail === "") {
		$("#signUpEmail").css('border-color', 'red');
	}
	else if (userEmail !== "") {
		$("#signUpEmail").css('border-color', '#CCC');
	}
	if (userPassword === "") {
		$("#password").css('border-color', 'red').val("");
		$("#reenterpassword").css('border-color', 'red').val("");
	}
	else if (userPassword !== "") {
		$("#password").css('border-color', '#CCC').val("");
		$("#reenterpassword").css('border-color', '#CCC').val("");
	}
});

$("#signin1").on("click", function(event) {
	event.preventDefault();
	userEmail = $("#Email").val();
	userPassword = $("#passwordinput").val();
	loginUser(userEmail, userPassword);
});
