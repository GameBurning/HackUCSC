'use strict';

angular.module('myApp.play', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/play', {
    templateUrl: 'views/play/play.html',
    controller: 'PlayCtrl'
  });
}])

.controller('PlayCtrl', ['$scope', 'httpUtil','$location','fakeData','$q', function($scope, httpUtil, $location, fakeData, $q) {
    console.log($location.search());
    $scope.score_meta = null;
    $scope.score_content = null;
    $scope.measures = [];
    $scope.display_list = [];
    $scope.blockSize = 4;
    $scope.offset = 0;
    $scope.current_measure = 1;
    $scope.size = 0;
    $scope.start = 0;
    $scope.hand = "Right";

    key.unbind('up');
    key.unbind('down');
    key.unbind('left');
    key.unbind('right');
    key.unbind('space');

    $scope.like = function() {
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
        for(var i = 0; i < $scope.blockSize && i + $scope.offset < $scope.size; i++) {
            $scope.display_list.push("Measure No."+(i+$scope.offset+1));
        }
    }

    $scope.increaseBlock = function() {
        debugger
        if($scope.blockSize == $scope.size || $scope.size == 0) return;
        let oldblockSize = $scope.blockSize;
        let newblockSize = $scope.blockSize + 1;
        let newOffset = (($scope.offset / oldblockSize) > 0? ($scope.offset / oldblockSize)-1: ($scope.offset / oldblockSize)) * newblockSize;

        $scope.blockSize = newblockSize;
        $scope.offset = newOffset;
        $scope.prevBlock();
    }

    $scope.decreaseBlock = function() {
        debugger
        if($scope.blockSize == 1) return;
        let oldblockSize = $scope.blockSize;
        let newblockSize = $scope.blockSize - 1;
        let newOffset = (($scope.offset / oldblockSize) < $scope.size-1? ($scope.offset / oldblockSize)+1: ($scope.offset / oldblockSize)) * newblockSize;

        $scope.blockSize = newblockSize;
        $scope.offset = newOffset;

        $scope.prevBlock();
    }

    $scope.nextBlock = function() {
        debugger
        if($scope.offset + $scope.blockSize < $scope.size) {
            $scope.offset += $scope.blockSize;
        }
        $scope.display_list = [];
        for(var i = 0; i < $scope.blockSize && i + $scope.offset < $scope.size; i++) {
            $scope.display_list.push("Measure No."+(i+$scope.offset+1));
        }
        $scope.$apply();
    }

    $scope.prevBlock = function() {
        debugger
        if($scope.offset - $scope.blockSize > 0) {
            $scope.offset -= $scope.blockSize;
        }
        else {
            $scope.offset = 0;
        }
        $scope.display_list = [];
        for(var i = 0; i < $scope.blockSize && i + $scope.offset < $scope.size; i++) {
            $scope.display_list.push("Measure No."+(i+$scope.offset+1));
        }
        $scope.$apply();
    }

    $scope.setLeftHand = function(){
        $scope.hand = "Left";
        console.log($scope.hand);
        $scope.$apply();
    }

    $scope.setRightHand = function(){
        $scope.hand = "Right";
        console.log($scope.hand);
        $scope.$apply();
    }

    key('f', function() {
      console.log('F key pressed');
      $scope.like();
    });

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

    var play = function(list) {
        if(list.length == 0) return;
        var sound = new Howl({
            src: [list[0]],
            preload: true,
            autoplay: true,
            rate : 1,
            onend: function() {
                console.log('Finished!');
                list.splice(0, 1);
                setTimeout(function(){ play(list); }, 500);
            },
          });

    }

    var playAList = function(list) {
        if(list.length == 0) return;
          let promises = [];
          for(var i = 0; i < list.length; i++) {
              promises.push(httpUtil.get("http://localhost:8001/speak?sentence='"+list[i]+"'"));
          }
          $q.all(promises)
          .then(function(values) {
                console.log(values);
                for(var i = 0; i < values.length; i++) {
                    values[i] = "http://localhost:8001" + values[i];
                }

                play(values);

            });

        // httpUtil.get("http://localhost:8001/speak?sentence='"+list[0]+"'")
        // .then(function(response) {
        //     //TODO: PUT ALL THESE CODE INTO "THEN"
        //     // var response = fakeData.searchList; // TODO: Change to real API data
        //
        //     if (response !== null) {
        //         //var snd = new Audio("http://localhost:8001" + response);
        //         //snd.play();
        //
        //         var sound = new Howl({
        //             src: ["http://localhost:8001" + response],
        //             autoplay: true,
        //             loop: false,
        //             volume: 0.5,
        //             onend: function() {
        //                 list.splice(0, 1);
        //                 playAList(list);
        //             }
        //           });
        //     }
        //
        // }, function(error) {
        //     debugger
        //     var response = fakeData.searchList; // TODO: Change to real API data
        //
        //     if (response !== null) {
        //         $scope.searchList = response;
        //         if($scope.searchList.length > 0) $scope.selected = 0;
        //     }
        //
        // });
    }

    key('space', function() {
      let sentences = [];
      for(var i = 0; i < $scope.blockSize && i + $scope.offset < $scope.size; i++) {
          sentences.push( $scope.measures[i+$scope.offset][$scope.hand] );
      }
      console.log(sentences);

      playAList(sentences);

      //
    //   for(var i = 0; i < 1; i++) {
    //       httpUtil.get("http://localhost:8001/speak?sentence='"+sentences[i]+"'")
    //       .then(function(response) {
    //           //TODO: PUT ALL THESE CODE INTO "THEN"
    //           // var response = fakeData.searchList; // TODO: Change to real API data
      //
    //           if (response !== null) {
    //               //var snd = new Audio("http://localhost:8001" + response);
    //               //snd.play();
      //
    //               var sound = new Howl({
    //                   src: ["http://localhost:8001" + response],
    //                   autoplay: true,
    //                   loop: false,
    //                   volume: 0.5,
    //                   onend: function() {
    //                     console.log('Finished!');
    //                   }
    //                 });
      //
    //           }
      //
    //       }, function(error) {
    //           debugger
    //           var response = fakeData.searchList; // TODO: Change to real API data
      //
    //           if (response !== null) {
    //               $scope.searchList = response;
    //               if($scope.searchList.length > 0) $scope.selected = 0;
    //           }
      //
    //       });
    //   }

    });

}]);
