var socketio = require('socket.io');
var SerialPort = require('serialport');
var db = require('./models');

module.exports = function(http) {

	var io = socketio(http);

	var serialport = new SerialPort('COM5', {
		parser: SerialPort.parsers.readline('\n')
	});

	var recordings = {
		temperature: [[],[]],
		time: []
	};

	io.on('connection', function(socket) {
		// send full recent recordings to client
		socket.on('dataHistory', function() {
			socket.emit('dataHistory', recordings);
		});
	});

	serialport.on('open', function() {
		console.log('Serial Port Opened');

		serialport.update({ baudRate: 9600 });

		serialport.on('data', function(data) {
			var parsedData = data.slice(0, data.length-1).split(',');
			var date = new Date();
			var dateString = date.toLocaleString();

			// saves to MongoDB
			var tempData = new db.Temperature();

			tempData.temperature.ir = parsedData[0];
			tempData.temperature.ambient = parsedData[1];
			tempData.date = date;

			tempData.save(function(err) {
				if (err) console.log(err);
			});

			// saves to recent recordings
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

			// sends data to clients
			io.emit('temp', { 
				time: dateString,
				ir: parsedData[0], 
				ambient: parsedData[1]
			});
		});
	});
};