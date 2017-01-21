'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.favorite',
  'myApp.history',
  'myApp.play',
  'myApp.search',
  'myApp.view2',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({redirectTo: '/search'});
}])

.run( function($rootScope, $location) {

    key('ctrl+1', function() {
      console.log('ctrl + 1 key pressed');
      $rootScope.$apply(function() {
          $location.path("/search");
          console.log($location.path());
      });
    });

    key('ctrl+2', function() {
      console.log('ctrl + 2 key pressed');
      $rootScope.$apply(function() {
          $location.path("/favorite");
          console.log($location.path());
      });
    });

    key('ctrl+3', function() {
      console.log('ctrl + 3 key pressed');
      $rootScope.$apply(function() {
          $location.path("/history");
          console.log($location.path());
      });
    });

});
