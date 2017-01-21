'use strict';

angular.module('myApp.play', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/play', {
    templateUrl: 'views/play/play.html',
    controller: 'PlayCtrl'
  });
}])

.controller('PlayCtrl', ['$scope', 'httpUtil', function($scope, httpUtil) {
    
}]);
