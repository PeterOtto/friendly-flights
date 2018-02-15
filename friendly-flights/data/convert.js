/*
var csv = require('csv');
var JSONStream = require('JSONStream');
var fs = require('fs');
var _ = require('lodash');

var columns = ['id', 'name', 'city', 'country', 'iata', 'icao', 'latitude', 'longitude', 'altitude', 'timezone', 'dst', 'tz'];

var readStream = fs.createReadStream('airports.dat');
var writeStream = fs.createWriteStream('airports.json');

var transformer = csv.transform(function(data) {
  return _.object(columns, data);
});

readStream
  .pipe(csv.parse())
  .pipe(transformer)
  .pipe(JSONStream.stringify())
  .pipe(writeStream);
*/

var csv = require('csv');
var JSONStream = require('JSONStream');
var fs = require('fs');
var _ = require('lodash');

var airportsJSON = require('./airports.json');
var Backbone = require('backbone');

var airports = new Backbone.Collection(airportsJSON);

var columns = ['id', 'name'];
var oldData;

var readStream = fs.createReadStream('flight-search-cache-origin-destination.csv');
var writeStream = fs.createWriteStream('destination.json');

var transformer = csv.transform(function(data) {
	data.splice(0,1);
	data.splice(1,1);
	
	if (oldData != data[0]) {

	var city = airports.findWhere({ iata: data[0]});
	if (city === undefined) {
		city = "x";
		data.splice(1,0,city);
	} else {
		city = airports.findWhere({ iata: data[0]}).get('city')
		data.splice(1,0,city);
	}
		console.log(data);
		oldData = data[0]
		return _.object(columns, data);
	}
});

readStream
  .pipe(csv.parse())
  .pipe(transformer)
  .pipe(JSONStream.stringify())
  .pipe(writeStream);
