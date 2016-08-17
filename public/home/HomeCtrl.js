app.controller('HomeCtrl', function($scope, mySocket) {

	$scope.temperature = {
		ir: 0,
		ambient: 0
	};

	$scope.series = ['IR Temperature', 'Ambient Temperature'];

	$scope.recordings = {
		time: [],
		temperature: [[],[]]
	};

	$scope.chartOptions = {
		animation: false,
		legend: {
			display: true
		},
		scales: {
			yAxes: [{
				scaleLabel: {
					display: true,
					labelString: 'Temperature (°C)'
				}
			}]
		}
	};

	$scope.datasetOverride = [{
		pointRadius: 0
	}, {
		pointRadius: 0,
	}];

	$scope.colors = ['#45b7cd','#ff6384'];

	mySocket.on('connect', function() {
		$scope.recordings = {
			time: [],
			temperature: [[],[]]
		};

		mySocket.emit('dataHistory');
	});

	mySocket.emit('dataHistory');

	mySocket.on('dataHistory', function(data) {
		$scope.recordings = data;
	});

	mySocket.on('temp', function(data) {
		$scope.temperature = data;
		
		$scope.recordings.temperature[0].push(data.ir)
		$scope.recordings.temperature[1].push(data.ambient)
		$scope.recordings.time.push(data.time);

		if ($scope.recordings.temperature[0].length > 150) {
			$scope.recordings.temperature[0].shift();
		}

		if ($scope.recordings.temperature[1].length > 150) {
			$scope.recordings.temperature[1].shift();
		}

		if ($scope.recordings.time.length > 150) {
			$scope.recordings.time.shift();
		}
	});
});