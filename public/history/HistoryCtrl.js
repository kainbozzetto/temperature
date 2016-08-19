app.controller('HistoryCtrl', function($scope, $http) {

	$scope.from = {
		date: new Date(),
		time: new Date(),
		opened: false,
		dateOptions: {
			formatYear: 'yy',
			minDate: new Date(2016, 0, 1),
			maxDate: new Date()
		},
		open: function() {
			$scope.from.opened = true;
		},
		changeTime: function() {
			$scope.from.date.setHours($scope.from.time.getHours());
			$scope.from.date.setMinutes($scope.from.time.getMinutes());
			if ($scope.from.date > $scope.to.date) {
				$scope.from.date = new Date($scope.to.date.getTime());
				$scope.from.time = new Date($scope.to.time.getTime());
			}
		},
		changeDate: function() {
			$scope.from.date.setHours($scope.from.time.getHours());
			$scope.from.date.setMinutes($scope.from.time.getMinutes());
			if ($scope.from.date > $scope.to.date) {
				$scope.from.date = new Date($scope.to.date.getTime());
				$scope.from.time = new Date($scope.to.time.getTime());
			}
			$scope.to.dateOptions.minDate = $scope.from.date;
		}
	};


	$scope.to = {
		date: new Date(),
		time: new Date(),
		opened: false,
		dateOptions: {
			formatYear: 'yy',
			minDate: $scope.from.date,
			maxDate: new Date()
		},
		open: function() {
			$scope.to.opened = true;
		},
		changeTime: function() {
			$scope.to.date.setHours($scope.to.time.getHours());
			$scope.to.date.setMinutes($scope.to.time.getMinutes());
			if ($scope.to.date < $scope.from.date) {
				$scope.to.date = new Date($scope.from.date.getTime());
				$scope.to.time = new Date($scope.from.time.getTime());
			}
		},
		changeDate: function() {
			if ($scope.to.date < $scope.from.date) {
				$scope.to.date = new Date($scope.from.date.getTime());
				$scope.to.time = new Date($scope.from.time.getTime());
			}
			$scope.from.dateOptions.maxDate = $scope.to.date;
		}
	};

	$scope.temperatureData = [];
	$scope.temperaturePlot = {
		time: [],
		temperature: [[],[]]
	};

	$scope.series = ['IR Temperature', 'Ambient Temperature'];

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

	$scope.retrieveData = function() {
		$scope.retrievedDate = {
			from: new Date($scope.from.date.getTime()),
			to: new Date($scope.to.date.getTime())
		};

		$http.get('/api/data', {
			params: {
				fromDate: $scope.from.date,
				toDate: $scope.to.date
			}
		}).then(function(response) {
			$scope.temperatureData = response.data;
			$scope.temperaturePlot.time = $scope.temperatureData.map(function(t) { return new Date(t.date).toLocaleString(); });
			$scope.temperaturePlot.temperature[0] = $scope.temperatureData.map(function(t) { return t.temperature.ir; });
			$scope.temperaturePlot.temperature[1] = $scope.temperatureData.map(function(t) { return t.temperature.ambient; });
		}, function(response) {
			console.log('error: ', response);
		});
	}

	$scope.downloadData = function() {
		jQuery('<form action="/api/download" method="get"><input type="hidden" name="fromDate" value="' + $scope.retrievedDate.from + '"><input type="hidden" name="toDate" value="' + $scope.retrievedDate.to + '"></form>').appendTo('body').submit().remove();
	}
});