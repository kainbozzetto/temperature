var app = angular.module('app', ['ui.router','btford.socket-io','chart.js','ui.bootstrap']);

app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('home', {
			url: '/',
			views: {
				'': {
					templateUrl: 'home/home.html',
					controller: 'HomeCtrl'
				}
			}
		})

		.state('history', {
			url: '/history',
			views: {
				'': {
					templateUrl: 'history/history.html',
					controller: 'HistoryCtrl'
				}
			}
		});

		$urlRouterProvider.otherwise('/');
});

app.factory('mySocket', function(socketFactory) {
	return socketFactory();
});