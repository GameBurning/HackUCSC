'use strict';

angular.module('myApp.history', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/history', {
    templateUrl: 'views/history/history.html',
    controller: 'HistoryCtrl'
  });
}])

.controller('HistoryCtrl', ['$scope', 'httpUtil', 'fakeData', '$location','navigation', 'utility', 'display',
function($scope, httpUtil, fakeData, $location, navigation, utility, display) {
    $scope.historyList = [];
    $scope.selected = null;
    $scope.showResult = false;
    $scope.show = display.show;

    var clearKeys = function() {
        for(var i = 0 ; i < utility.registered_keys.length; i++) {
            key.unbind(utility.registered_keys[i]);
        }
    }

    clearKeys();

    var sound = new Howl({
        src: ['/resources/sounds/history.wav'],
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

    httpUtil.get("/")
    .then(function(response) {

        var response = fakeData.historyList; // TODO: Change to real API data
        //TODO: PUT ALL THESE CODE INTO "THEN"
        if (response !== null) {
            $scope.historyList = response;
            if($scope.historyList.length > 0) $scope.selected = 0;
            $scope.showResult = true;
        }

    }, function(error) {

        //TODO: PUT ALL THESE CODE INTO "THEN"
        var response = fakeData.historyList; // TODO: Change to real API data

        if (response !== null) {
            $scope.historyList = response;
            if($scope.historyList.length > 0) $scope.selected = 0;
            $scope.showResult = true;
        }

    })

    $scope.select = function(ind) {
        $scope.selected = ind;
        console.log(ind);
    }

    $scope.prev = function(ind) {
        if($scope.selected != null) {
            if($scope.selected > 0) {
                $scope.selected --;
                $scope.$apply();
            }
            setTimeout(function(){
                utility.get_voice_by_text($scope.historyList[$scope.selected].name)
                    .then(function(sound_url){
                        var sound = new Howl({
                            src: [sound_url],
                            autoplay: true,
                            loop: false,
                            onload: function() {
                                utility.stop_all_sounds();
                                utility.active_sounds.push(sound);
                            },
                            onend: function() {
                                console.log('Finished!');
                            }
                          });
                    }, function(error){

                    });
            },1500);

        }
    }

    $scope.next = function(ind) {
        if($scope.selected != null) {
            if($scope.selected < $scope.historyList.length - 1) {
                $scope.selected ++;
                $scope.$apply();
            }
            utility.get_voice_by_text($scope.historyList[$scope.selected])
                .then(function(sound_url){
                    var sound = new Howl({
                        src: [sound_url],
                        autoplay: true,
                        loop: false,
                        onload: function() {
                            utility.stop_all_sounds();
                            utility.active_sounds.push(sound);
                        },
                        onend: function() {
                            console.log('Finished!');
                        }
                      });
                }, function(error){

                });
        }
    }

    if($location.path() == '/history') {

        key('left', function() {
          console.log('up key pressed');
          $scope.prev();
        });

        key('right', function() {
          console.log('down key pressed');
          $scope.next();
        });

        key('enter', function() {
          console.log('enter key pressed');
          navigation('play', {"id" : $scope.historyList[$scope.selected].id});
          $scope.$apply();
        });

    }

}]);
