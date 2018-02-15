var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var fs = require('file-system');
var mustache = require('mustache');
var airportsJSON = require('./data/airports.json');
var Backbone = require('backbone');

var airports = new Backbone.Collection(airportsJSON);

var app = express();
app.use( express.static( __dirname + '/public' ));
var path = require('path');
var port = process.env.PORT || 8080;
 
app.get('/', function (req, res) {
  res.sendFile( path.join( __dirname, 'public', 'index.html' ));
})

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
 
app.listen(port);

var fligtRes;
app.post('/', function(req, res) {
	fligtRes = res;
 	// sending a response does not pause the function
 	getFlights(req.body);
});

var destinations = [];

function getFlights(postData){
	var url = "https://api.sandbox.amadeus.com/v1.2/flights/inspiration-search?apikey=GrBn3mBuHGEGD1Xr1xf9vlzBpo7AHSLD"

	var urlOne;
	var originOne;
	var destinationsOne;

	var urlTwo;
	var originTwo;
	var destinationsTwo;

	var destination;
	var dates;
	var duration;
	var maxPrice;

	originOne = postData.originOneIata;
	originTwo = postData.originTwoIata;
	originOneCity = postData.originOne;
	originTwoCity = postData.originTwo;
	destination = postData.destination;
	dates = postData.daterange;
	duration = postData.duration;
	maxPrice = postData.maxPrice;
	//rearanging the dates so they match what the api is expecting
	dates = dates.substr(6,4)+"-"+dates.substr(0,2)+"-"+dates.substr(3,2)+"--"+dates.substr(19,4)+"-"+dates.substr(13,2)+"-"+dates.substr(16,2);

	if (destination !== "undefined") {
		url += "&destination="+destination;
	}

	if (dates !== "undefined") {
		url += "&departure_date="+dates;
	}

	if(maxPrice) {
		url += "&max_price="+maxPrice;
	}

	if(duration) {
		url += "&duration="+duration;
	}

	console.log("originOne : " + originOne + " originTwo : " + originTwo);

	if (originOne !== "undefined") {
		urlOne = url;
		urlOne  += "&origin="+originOne;
	}

	if (originTwo !== "undefined") {
		urlTwo = url;
		urlTwo  += "&origin="+originTwo;
	}
	
	request.get(urlOne, function(err, res, body){
		if (err){} //TODO: handle error
		if (res.statusCode !== 200) {
			fligtRes.sendFile( path.join( __dirname, 'public', 'noflights.html' ));
		}
		else {
			destinationsOne = JSON.parse(body);
			if (destinationsOne && destinationsTwo) {
				sortFlights(destinationsOne, destinationsTwo, originOneCity, originTwoCity);
			}
		}
	});

	request.get(urlTwo, function(err, res, body){
		if (err){} //TODO: handle error
		if (res.statusCode !== 200) {
			fligtRes.sendFile( path.join( __dirname, 'public', 'noflights.html' ));
		}
		else {
			destinationsTwo = JSON.parse(body);
			if (destinationsOne && destinationsTwo) {
				sortFlights(destinationsOne, destinationsTwo, originOneCity, originTwoCity);
			}
		}
	});
};

function sortFlights(destinationsOne, destinationsTwo, originOne, originTwo){

	for (var i = destinationsOne.results.length - 1; i >= 0; i--) {
		for (var e = destinationsTwo.results.length - 1; e >= 0; e--) {
			if (destinationsOne.results[i].destination == destinationsTwo.results[e].destination) {
				if (destinationsOne.results[i].departure_date == destinationsTwo.results[e].departure_date) {
					
					var city = airports.findWhere({ iata: destinationsOne.results[i].destination});
					if (city === undefined) {
						city = destinationsOne.results[i].destination + " - All Airports";
						var country = "Country unknown";
						console.log("this is not a place we know");
					} else {
						city = airports.findWhere({ iata: destinationsOne.results[i].destination }).get('city')
						var country = airports.findWhere({ iata: destinationsOne.results[i].destination }).get('country')
					}
			
					
					var objToAdd = {
						"Destination" : city,
						"country" : country,
						"DepartureDate" : destinationsOne.results[i].departure_date,
						"ReturnDate" : destinationsOne.results[i].return_date,
						"originOne" : originOne,
						"originOnePrice" : destinationsOne.results[i].price,
						"originOneCurrency" : destinationsOne.currency,
						"originTwo" : originTwo,
						"originTwoPrice" : destinationsTwo.results[e].price,
						"originTwoCurrency" : destinationsTwo.currency,
					};
					destinations.push(objToAdd);
				}
			}
		}
	}
	if (fligtRes.statusCode === 200) {
		var destinationsObj = {"destinations" : destinations};
		
		fs.readFile("public/template.html", function (err, data) {
		  if (err) throw err;
		  var output = mustache.render(data.toString(), destinationsObj);
		  fligtRes.write(output);
		  fligtRes.end();
		});
	}
}
