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

.run( ['$rootScope','$location','navigation', 'utility', 'config',
 function($rootScope, $location, navigation, utility, config) {
    var lang = window.navigator.userLanguage || window.navigator.language;
    utility.language = lang;
    debugger

    if(lang.indexOf("zh") != -1) {
        config.api.music_score = config.api.music_score_chinese;
    }
    else if(lang.indexOf("en") != -1) {
        config.api.music_score = config.api.music_score_english;
    }
    else {
        config.api.music_score = config.api.music_score_english;
    }

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
