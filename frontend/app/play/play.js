'use strict';

angular.module('myApp.play', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/play', {
    templateUrl: 'play/play.html',
    controller: 'PlayCtrl'
  });
}])

.controller('PlayCtrl', [function() {
    
}]);
