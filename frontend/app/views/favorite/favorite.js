'use strict';

angular.module('myApp.favorite', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/favorite', {
    templateUrl: 'views/favorite/favorite.html',
    controller: 'FavoriteCtrl'
  });
}])

.controller('FavoriteCtrl', ['$scope', 'httpUtil', 'fakeData', '$location', 'navigation','utility', 'display',
function($scope, httpUtil, fakeData, $location, navigation, utility, display) {
    $scope.favoriteList = [];
    $scope.selected = null;
    $scope.showResult = false;
    $scope.show = display.show;

    let clearKeys = function() {
        for(var i = 0 ; i < utility.registered_keys.length; i++) {
            key.unbind(utility.registered_keys[i]);
        }
    }

    clearKeys();

    var sound = new Howl({
        src: ['/resources/sounds/viewFavorites.wav'],
        preload: true,
        autoplay: true,
        rate : 1,
        onend: function() {
            console.log('Finished!');
        },
      });

    httpUtil.get("/")
    .then(function(response) {

        var response = fakeData.favoriteList; // TODO: Change to real API data
        //TODO: PUT ALL THESE CODE INTO "THEN"
        if (response !== null) {
            $scope.favoriteList = response;
            if($scope.favoriteList.length > 0) $scope.selected = 0;
            $scope.showResult = true;
            setTimeout(function(){
                utility.get_voice_by_text($scope.favoriteList[$scope.selected].name)
                    .then(function(sound_url){
                        var sound = new Howl({
                            src: [sound_url],
                            autoplay: true,
                            loop: false
                          });
                    }, function(error){

                    });
            },1500);

        }

    }, function(error) {
        //TODO: PUT ALL THESE CODE INTO "THEN"
        var response = fakeData.favoriteList; // TODO: Change to real API data

        if (response !== null) {
            $scope.favoriteList = response;
            if($scope.favoriteList.length > 0) $scope.selected = 0;
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
            utility.get_voice_by_text($scope.favoriteList[$scope.selected].name)
                .then(function(sound_url){
                    var sound = new Howl({
                        src: [sound_url],
                        autoplay: true,
                        loop: false
                      });
                }, function(error){

                });
        }
    }

    $scope.next = function(ind) {
        if($scope.selected != null) {
            if($scope.selected < $scope.favoriteList.length - 1) {
                $scope.selected ++;
                $scope.$apply();
            }
            utility.get_voice_by_text($scope.favoriteList[$scope.selected].name)
                .then(function(sound_url){
                    var sound = new Howl({
                        src: [sound_url],
                        autoplay: true,
                        loop: false
                      });
                }, function(error){

                });
        }
    }

    console.log($location.path());
    if($location.path() == '/favorite') {

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
          navigation('play', {"id" : $scope.favoriteList[$scope.selected].id});
          $scope.$apply();
        });
    }

}]);
