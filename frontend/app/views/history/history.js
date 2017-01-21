'use strict';

angular.module('myApp.history', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/history', {
    templateUrl: 'views/history/history.html',
    controller: 'HistoryCtrl'
  });
}])

.controller('HistoryCtrl', ['$scope', 'httpUtil', function($scope, httpUtil) {

}]);
