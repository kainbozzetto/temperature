var express = require('express');
var router = express.Router();
var db = require('../models');

var json2csv = require('json2csv');
var randomstring = require('randomstring');
var fs = require('fs');

router.get('/data', function(req, res) {
	var fromDate = req.query.fromDate;
	var toDate = req.query.toDate;

	db.Temperature.find(
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

router.get('/download', function(req, res) {
	var fromDate = req.query.fromDate;
	var toDate = req.query.toDate;

	if (!fromDate || !toDate) {
		res.send('error');
	}

	db.Temperature.find(
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

			fs.writeFile('./temp/' + filename + '.csv', csv, function(err) {
				if (err) throw err;

				res.download('./temp/' + filename + '.csv', 'data.csv', function(err) {
					if (err) {
						console.log(err);
					} else {
						fs.unlink('./temp/' + filename + '.csv');
					}
				});	
			});

			
		}
	);
});

module.exports = router;