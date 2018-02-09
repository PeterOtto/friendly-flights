var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')

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

function getFlights(postData){
	originOne = postData.originOne;
	originTwo = postData.originTwo;
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
		if (res.statusCode !== 200) {}
		else {
			destinationsOne = JSON.parse(body);
			if (destinationsOne && destinationsTwo) {
				sortFlights(destinationsOne, destinationsTwo);
			}
		}
	});

	request.get(urlTwo, function(err, res, body){
		if (err){} //TODO: handle error
		if (res.statusCode !== 200) {}
		else {
			destinationsTwo = JSON.parse(body);
			if (destinationsOne && destinationsTwo) {
				sortFlights(destinationsOne, destinationsTwo);
			}
		}
	});
};
var buf = '<div> <p> These are the result that we found </p> </div>';
function sortFlights(destinationsOne, destinationsTwo){
	console.log("We have destinations");
	console.log("destinationsOne : " + destinationsOne);
	console.log("destinationsTwo : " + destinationsTwo);

	for (var i = destinationsOne.results.length - 1; i >= 0; i--) {
		for (var e = destinationsTwo.results.length - 1; e >= 0; e--) {
			if (destinationsOne.results[i].destination == destinationsTwo.results[e].destination) {
				if (destinationsOne.results[i].departure_date == destinationsTwo.results[e].departure_date) {
					var tmp = '<ul><li> Destination : ' + destinationsOne.results[i].destination + '</li><li>Departure date : ' + destinationsOne.results[i].departure_date + '</li><li>Return date : ' + destinationsOne.results[i].return_date + '</li><li>From ' + originOne + ' : ' + destinationsOne.results[i].price + ' ' + destinationsOne.currency + '</li><li>From ' + originTwo + ' : ' + destinationsTwo.results[e].price + ' ' + destinationsTwo.currency + '</li></ul>';
					buf += tmp;
				}
			}
		}
	}
	console.log("I RAN");
	if (fligtRes.statusCode === 200) {
        fligtRes.write('<html><body><p>' + buf + '</p></body></html>');
        fligtRes.end();
		//fligtRes.sendFile( path.join( __dirname, 'public', 'flights.html' ));
	}
}
