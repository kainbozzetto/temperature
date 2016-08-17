var express = require('express');
var app = express();
var http = require('http').Server(app);

var io = require('socket.io')(http);

var SerialPort = require('serialport');

var mongoose = require('mongoose');

var json2csv = require('json2csv');

var randomstring = require('randomstring');

var fs = require('fs');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

http.listen(3000, '0.0.0.0', function() {
	console.log('listening on *:3000');
});

mongoose.connect('mongodb://localhost/temperature');

var Schema = mongoose.Schema;
var TemperatureSchema = new Schema({
	temperature: {
		ir: { type: Number },
		ambient: { type: Number },
	},
	date: { type: Date, default: Date.now }
});

var Temperature = mongoose.model('Temperature', TemperatureSchema);

//var router = express.Router();

app.get('/data', function(req, res) {
	var fromDate = req.query.fromDate;
	var toDate = req.query.toDate;

	Temperature.find(
		{
			date: {
				$gte: fromDate,
				$lte: toDate
			}
		},
		function(err, data) {
			res.send(data);
		}
	);
});

app.get('/download', function(req, res) {
	var fromDate = req.query.fromDate;
	var toDate = req.query.toDate;

	if (!fromDate || !toDate) {
		res.send('error');
	}

	Temperature.find(
		{
			date: {
				$gte: fromDate,
				$lte: toDate
			}
		},
		function(err, data) {
			data.forEach(function(d) {
				d.newDate = new Date(d.date).toLocaleString();
			});

			var fields = ['newDate','temperature.ir','temperature.ambient'];
			var fieldNames = ['Date', 'IR Temperature (°C)', 'Ambient Temperature (°C)'];

			var csv = json2csv({
				data: data,
				fields: fields,
				fieldNames: fieldNames
			});

			var filename = randomstring.generate(8);

			fs.writeFile('temp/' + filename + '.csv', csv, function(err) {
				if (err) throw err;

				res.download('temp/' + filename + '.csv', 'data.csv', function(err) {
					if (err) {
						console.log(err);
					} else {
						fs.unlink('temp/' + filename + '.csv');
					}
				});	
			});

			
		}
	);
});

io.on('connection', function(socket) {
	console.log('User connected');
	
	socket.on('disconnect', function(){
    	console.log('User disconnected');
	});

	socket.on('dataHistory', function() {
		socket.emit('dataHistory', recordings);
	});
});

var serialport = new SerialPort('COM5', {
	parser: SerialPort.parsers.readline('\n')
});

var recordings = {
	temperature: [[],[]],
	time: []
};

Date.prototype.toArray = function() {
	var meridian = 'AM';
	var hours = this.getHours();
	if (hours >= 12) {
		meridian = 'PM' 
	}
	if (hours > 12) {
		hours -= 12;
	}
	if (hours == 0) {
		hours = 12;
	}
	var minutes = this.getMinutes();
	var seconds = this.getSeconds();

	var day = this.getDate();
	var month = this.getMonth() + 1;
	var year = this.getFullYear();

	return [hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds) + ' ' + meridian, day + '/' + month + '/' + year];
}

serialport.on('open', function() {
	console.log('Serial Port Opened');

	serialport.update({ baudRate: 9600 });

	serialport.on('data', function(data) {
		var parsedData = data.slice(0, data.length-1).split(',');
		var date = new Date();
		var dateString = date.toLocaleString();

		var tempData = new Temperature();

		tempData.temperature.ir = parsedData[0];
		tempData.temperature.ambient = parsedData[1];
		tempData.temperature.date = date;

		tempData.save(function(err) {
			if (err) console.log(err);
		})

		recordings.temperature[0].push(parsedData[0]);
		recordings.temperature[1].push(parsedData[1]);
		recordings.time.push(dateString);

		if (recordings.temperature[0].length > 150) {
			recordings.temperature[0].shift();
		}

		if (recordings.temperature[1].length > 150) {
			recordings.temperature[1].shift();
		}

		if (recordings.time.length > 150) {
			recordings.time.shift();
		}

		io.emit('temp', { 
			time: dateString,
			ir: parsedData[0], 
			ambient: parsedData[1]
		});
	});
});