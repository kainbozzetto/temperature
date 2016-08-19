var app = angular.module('app', ['ui.router','btford.socket-io','chart.js','ui.bootstrap']);

app.factory('mySocket', function(socketFactory) {
	return socketFactory();
});