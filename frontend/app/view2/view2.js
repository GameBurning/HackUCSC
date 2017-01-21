'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', ['$location',function($location) {
    key('x', function() {
          console.log('x key pressed');
          $location.path('/view2'); // problem: location doesn't change
      });
}]);
