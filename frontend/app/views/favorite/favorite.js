'use strict';

angular.module('myApp.favorite', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/favorite', {
    templateUrl: 'views/favorite/favorite.html',
    controller: 'FavoriteCtrl'
  });
}])

.controller('FavoriteCtrl', ['$scope', 'httpUtil', function($scope, httpUtil) {
    httpUtil.get("/")
    .then(function(response) {
        if (response !== null) {

        }
    }, function(error) {
        
    })
}]);
