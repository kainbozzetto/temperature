var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');

var index = require('./routes/index');
var api = require('./routes/api');
var serial = require('./serial')(http);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/api', api);

http.listen(3000, '0.0.0.0', function() {
	console.log('listening on *:3000');
});