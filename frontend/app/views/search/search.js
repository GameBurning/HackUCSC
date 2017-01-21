'use strict';

angular.module('myApp.search', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/search', {
    templateUrl: 'views/search/search.html',
    controller: 'SearchCtrl'
  });
}])

.controller('SearchCtrl', ['$scope', 'httpUtil', function($scope, httpUtil) {

    $scope.open = function () {
      $scope.isOpen = true;
    };

    $scope.close = function () {
      $scope.isOpen = false;
    };

    $scope.open();

    key.unbind('up');
    key.unbind('down');

}]);
