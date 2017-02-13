'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.favorite',
  'myApp.history',
  'myApp.play',
  'myApp.search'
]).

config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({redirectTo: '/search'});
}])

.run( ['$rootScope','$location','navigation', 'utility',
 function($rootScope, $location, navigation, utility) {
    var lang = window.navigator.userLanguage || window.navigator.language;
    utility.language = lang;

    key('ctrl+1', function() {
      console.log('ctrl + 1 key pressed');
      $rootScope.$apply(function() {
          navigation('search');
      });
    });

    key('ctrl+2', function() {
      console.log('ctrl + 2 key pressed');
      $rootScope.$apply(function() {
          navigation('favorite');
      });
    });

    key('ctrl+3', function() {
      console.log('ctrl + 3 key pressed');
      $rootScope.$apply(function() {
          navigation('history');
      });
    });

}]);
