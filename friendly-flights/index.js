var express = require('express')
var app = express();
app.use( express.static( __dirname + '/public' ));
var path = require('path');
 
app.get('/', function (req, res) {
  res.sendFile( path.join( __dirname, 'public', 'index.html' ));
})
 
app.listen(3000)