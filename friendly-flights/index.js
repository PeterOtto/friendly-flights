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

app.post('/', function(req, res) {
	res.sendStatus(200);
 	// sending a response does not pause the function
 	getFlights(req.body);
});

var originOne;
var originTwo;
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

	var dates = dates.substr(6,4)+"-"+dates.substr(0,2)+"-"+dates.substr(3,2)+"--"+dates.substr(19,4)+"-"+dates.substr(13,2)+"-"+dates.substr(16,2);

	console.log(originOne + " : " + originTwo + " : " + destination + " : " + dates + " : " + duration + " : " + maxPrice);

	var url = "https://api.sandbox.amadeus.com/v1.2/flights/inspiration-search?apikey=GrBn3mBuHGEGD1Xr1xf9vlzBpo7AHSLD&origin="+originOne+"&destination="+destination+"&departure_date="+dates
	
	request.get(url, function(err, res, body){
		if (err){} //TODO: handle error
		if (res.statusCode !== 200) {}
		else console.log(body);
	});
};
