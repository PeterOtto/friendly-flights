var express = require('express')
var app = express();
app.use( express.static( __dirname + '/public' ));
var path = require('path');
 
app.get('/', function (req, res) {
  res.sendFile( path.join( __dirname, 'public', 'index.html' ));
})
 
app.listen(3000);

var originOne;
var originTwo;
var destination;
var dates;
var duration;
var maxPrice;

function getFlights(){
	var originOne = document.getElementById("originOne").value;
	var originTwo = document.getElementById("originTwo").value;
	var destination = document.getElementById("destination").value;
	var dates = document.getElementById("datePicker").value;
	var duration = document.getElementById("duration").value;
	var maxPrice = document.getElementById("maxPrice").value;
	
	console.log("originOne" + originOne);
	console.log("originTwo" + originTwo);
	console.log("destination" + destination);
	console.log("dates" + dates);
	console.log("duration" + duration);
	console.log("maxPrice" + maxPrice);
};