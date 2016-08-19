app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
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
}]);