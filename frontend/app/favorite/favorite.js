'use strict';

angular.module('myApp.favorite', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/favorite', {
    templateUrl: 'favorite/favorite.html',
    controller: 'FavoriteCtrl'
  });
}])

.controller('FavoriteCtrl', [function() {
    
}]);
