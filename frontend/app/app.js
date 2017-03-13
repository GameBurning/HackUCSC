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

.run( ['$rootScope','$location','navigation', 'utility', 'config', '$http',
 function($rootScope, $location, navigation, utility, config, $http) {

    $http.get('config.json').success(function(configProfile) {
        var lang = configProfile.language; // window.navigator.userLanguage || window.navigator.language;
        utility.language = lang;
        config.api.music_score = configProfile.api.music_score[lang] || config.api.music_score;
        config.api.fetch_mp3 = configProfile.api.fetch_mp3 || config.api.fetch_mp3;
    });

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
