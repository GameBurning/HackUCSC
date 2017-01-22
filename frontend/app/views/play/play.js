'use strict';

angular.module('myApp.play', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/play', {
    templateUrl: 'views/play/play.html',
    controller: 'PlayCtrl'
  });
}])

.controller('PlayCtrl', ['$scope', 'httpUtil','$location','fakeData', function($scope, httpUtil, $location, fakeData) {
    console.log($location.search());
    $scope.score_meta = null;
    $scope.score_content = null;
    $scope.measures = [];
    $scope.display_list = [];
    $scope.blockSize = {"size":4};
    $scope.offset = {"offset":0};
    $scope.current_measure = 1;
    $scope.size = 0;
    $scope.start = 0;
    $scope.hand = "Right";

    key.unbind('up');
    key.unbind('down');
    key.unbind('left');
    key.unbind('right');
    key.unbind('space');

    //TODO: FIX BUG OF SCOPE NOT UPDATE VIEW
    if($location.search()) {
        let score_id = $location.search().id;

        httpUtil.get("http://gameburning.com:5000/api/musicscores/" + score_id)
        .then(function(response) {

            //TODO: PUT ALL THESE CODE INTO "THEN"
            // var response = fakeData.searchList; // TODO: Change to real API data
            if (response !== null) {
                $scope.score_meta = response.metaInfo;
                $scope.score_content = response.scoreContent;
                for (var prop in $scope.score_content) {
                    $scope.measures.push($scope.score_content[prop]);
                }
                $scope.size = $scope.measures.length;
                $scope.start();
            }
        }, function(error) {

            var response = fakeData.musicScore; // TODO: Change to real API data
            if (response !== null) {
                $scope.score_meta = response.metaInfo;
                $scope.score_content = response.scoreContent;
                for (var prop in $scope.score_content) {
                    $scope.measures.push($scope.score_content[prop]);
                }
                $scope.size = $scope.measures.length;
                $scope.start();
            }
        });
    }

    $scope.start = function() {
        for(var i = 0; i < $scope.blockSize.size && i + $scope.offset.offset < $scope.size; i++) {
            $scope.display_list.push("Measure No."+(i+$scope.offset.offset+1));
        }
    }

    $scope.increaseBlock = function() {

        if($scope.blockSize.size == $scope.size) return;
        let oldblockSize = $scope.blockSize.size;
        let newblockSize = $scope.blockSize.size + 1;
        let newOffset = (($scope.offset.offset / oldblockSize) > 0? ($scope.offset.offset / oldblockSize)-1: ($scope.offset.offset / oldblockSize)) * newblockSize;

        $scope.blockSize.size = newblockSize;
        $scope.offset.offset = newOffset;
        $scope.prevBlock();
    }

    $scope.decreaseBlock = function() {
        if($scope.blockSize.size == 1) return;
        let oldblockSize = $scope.blockSize.size;
        let newblockSize = $scope.blockSize.size - 1;
        let newOffset = (($scope.offset.offset / oldblockSize) < $scope.size-1? ($scope.offset.offset / oldblockSize)+1: ($scope.offset.offset / oldblockSize)) * newblockSize;

        $scope.blockSize.size = newblockSize;
        $scope.offset.offset = newOffset;

        $scope.prevBlock();
    }

    $scope.nextBlock = function() {
        if($scope.offset.offset + $scope.blockSize.size < $scope.size) {
            $scope.offset.offset += $scope.blockSize.size;
        }
        $scope.display_list = [];
        for(var i = 0; i < $scope.blockSize.size && i + $scope.offset.offset < $scope.size; i++) {
            $scope.display_list.push("Measure No."+(i+$scope.offset.offset+1));
        }
        $scope.$apply();
    }

    $scope.prevBlock = function() {
        if($scope.offset.offset - $scope.blockSize.size > 0) {
            $scope.offset.offset -= $scope.blockSize.size;
        }
        else {
            $scope.offset.offset = 0;
        }
        $scope.display_list = [];
        for(var i = 0; i < $scope.blockSize.size && i + $scope.offset.offset < $scope.size; i++) {
            $scope.display_list.push("Measure No."+(i+$scope.offset.offset+1));
        }
        $scope.$apply();
    }


    $scope.setLeftHand = function(){
        $scope.hand = "Left";
        console.log($scope.hand);
    }

    $scope.setRightHand = function(){
        $scope.hand = "Right";
        console.log($scope.hand);
    }

    key('=', function() {
      console.log('up key pressed');
      $scope.increaseBlock();
    });

    key('-', function() {
      console.log('down key pressed');
      $scope.decreaseBlock();
    });

    key('+', function() {
      console.log('up key pressed');
      $scope.increaseBlock();
    });

    key('_', function() {
      console.log('down key pressed');
      $scope.decreaseBlock();
    });

    key('down', function() {
      console.log('up key pressed');
      $scope.setLeftHand();
    });

    key('up', function() {
      console.log('down key pressed');
      $scope.setRightHand();
    });

    key('left', function() {
      console.log('enter key pressed');
      $scope.prevBlock();
    });

    key('right', function() {
      console.log('enter key pressed');
      $scope.nextBlock();
    });

    key('space', function() {
      let sentences = [];
      for(var i = 0; i < $scope.blockSize.size && i + $scope.offset.offset < $scope.size; i++) {
          sentences.push( $scope.measures[i+$scope.offset.offset][$scope.hand] );
      }
      console.log(sentences);

      for(var i = 0; i < sentences.length; i++) {
          httpUtil.get("http://localhost:8001/speak?sentence='"+sentences[i]+"'")
          .then(function(response) {
              //TODO: PUT ALL THESE CODE INTO "THEN"
              // var response = fakeData.searchList; // TODO: Change to real API data

              if (response !== null) {
                  var snd = new Audio("http://localhost:8001" + response);
                  snd.play();
              }

          }, function(error) {
              debugger
              var response = fakeData.searchList; // TODO: Change to real API data

              if (response !== null) {
                  $scope.searchList = response;
                  if($scope.searchList.length > 0) $scope.selected = 0;
              }

          });
      }

    });

}]);
