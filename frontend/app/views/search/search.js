'use strict';

angular.module('myApp.search', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/search', {
    templateUrl: 'views/search/search.html',
    controller: 'SearchCtrl'
  });
}])

.controller('SearchCtrl', ['$scope', 'httpUtil', 'navigation', 'fakeData', 'utility', 'display', 'config',
    function($scope, httpUtil, navigation, fakeData, utility, display, config) {
    $scope.shouldFocus = true;
    $scope.showResult = false;
    $scope.searchString = "";
    $scope.searchList = [];
    $scope.selected = null;
    $scope.show = display.show;

    var clearKeys = function() {
        for(var i = 0 ; i < utility.registered_keys.length; i++) {
            key.unbind(utility.registered_keys[i]);
        }
    }

    clearKeys();

    var sound = new Howl({
        src: ['/resources/sounds/search.wav'],
        preload: true,
        autoplay: true,
        rate : 1,
        onload: function() {
            utility.stop_all_sounds();
            utility.active_sounds.push(sound);
        },
        onend: function() {
            console.log('Finished!');
        }
      });

    $scope.setUnfocus = function() {
        $scope.onFocus = false;
    }

    $scope.setFocus = function() {
        $scope.onFocus = true;
    }

    $scope.focus = function () {
      $scope.searchString = "";
      $scope.shouldFocus = true;
      $scope.showResult = false;
      $scope.setFocus();

      clearKeys();
    };

    $scope.blur = function () {
      $scope.shouldFocus = false;
      $scope.setUnfocus();

    };

    $scope.focus();

    $scope.up = function(ind) {
        if($scope.selected != null) {
            if($scope.selected > 0) {
                $scope.selected --;
                $scope.$apply();
            }
        }
    }

    $scope.down = function(ind) {
        if($scope.selected != null) {
            if($scope.selected < $scope.searchList.length - 1) {
                $scope.selected ++;
                $scope.$apply();
            }
        }
    }

    $scope.search = function() {
        if($scope.showResult == true) return;
        $scope.showResult = true;
        $scope.blur();

        clearKeys();

        utility.search_score($scope.searchString)
            .then(function(response) {
                if (response !== null) {
                    $scope.searchList = response;
                    debugger
                    if($scope.searchList.length > 0) {
                        $scope.selected = 0;
                        var sound = new Howl({
                          src: [config.api.fetch_mp3 + $scope.searchList[$scope.selected].title_mp3],
                          preload: true,
                          autoplay: true,
                          rate: 1,
                          onload: function() {
                            utility.active_sounds.push(sound);
                          },
                          onend: function() {
                            console.log('Finished!');
                            list.splice(0, 1);
                            setTimeout(function() {
                              play(list);
                            }, 0);
                            },
                          onloaderror: function(e){
                              debugger
                          }
                      });
                    }
                }
                $scope.$apply();
            }, function(error) {
                debugger
            });

        key('enter', function() {
          console.log('enter key pressed');
          $scope.focus();
          $scope.showResult = false;
          $scope.$apply();
          navigation('play', {"id" : $scope.searchList[$scope.selected].title});
        });

        key('left', function() {
          console.log('up key pressed');
          $scope.up();
        });

        key('right', function() {
          console.log('down key pressed');
          $scope.down();
        });

        key('esc', function() {
          console.log('esc key pressed');
          $scope.focus();
          $scope.showResult = false;
          $scope.$apply();
        });

        key('backspace', function() {
          console.log('backspace key pressed');
          $scope.focus();
          $scope.showResult = false;
          $scope.$apply();
        });
    }

    $scope.getKey = function(event) {
        if(event.code == 'Enter') {
            console.log($scope.searchString);
            $scope.search();
        }
        if(event.key == '1' && event.ctrlKey == true && !$scope.onFocus) {
            navigation('favorite');
            $scope.open();
            $scope.searchString = "";
        }
        if(event.key == '2' && event.ctrlKey == true) {
            navigation('favorite');
        }
        if(event.key == '3' && event.ctrlKey == true) {
            navigation('history');
        }
    }



}]);
