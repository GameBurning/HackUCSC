'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', [function() {
    key('ctrl+x', function() {
          console.log('x key pressed');
          $location.path('/view2'); // problem: location doesn't change
      });
}]);
