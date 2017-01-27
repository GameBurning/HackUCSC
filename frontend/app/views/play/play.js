'use strict';

angular.module('myApp.play', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/play', {
    templateUrl: 'views/play/play.html',
    controller: 'PlayCtrl'
  });
}])

.controller('PlayCtrl', ['$scope', 'httpUtil','$location','fakeData','$q', 'utility', 'display',
function($scope, httpUtil, $location, fakeData, $q, utility, display) {
    console.log($location.search());
    $scope.show = display.show;
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

    let clearKeys = function() {
        for(var i = 0 ; i < utility.registered_keys.length; i++) {
            key.unbind(utility.registered_keys[i]);
        }
    }

    clearKeys();

    $scope.like = function() {

    }

    if($location.search() && $location.search().id) {
        let score_id = $location.search().id;
        utility.get_score(score_id)
            .then(function(response) {
                $scope.score_meta = response.metaInfo;
                let meta_info_text = [];
                meta_info_text.push(score_id);
                for(var prop in $scope.score_meta) {
                    meta_info_text.push(prop + ". " +$scope.score_meta[prop]);
                }
                playSentencesList(meta_info_text);

                $scope.score_content = response.scoreContent;
                for (var prop in $scope.score_content) {
                    $scope.measures.push($scope.score_content[prop]);
                }
                $scope.size = $scope.measures.length;
                $scope.start();
            }, function(error) {
                console.log(error);
                var response = fakeData.musicScore; // TODO: Change to real API data
                if (response !== null) {
                    $scope.score_meta = response.metaInfo;
                    let meta_info_text = [];
                    meta_info_text.push(score_id);
                    for(var prop in $scope.score_meta) {
                        meta_info_text.push(prop + ". " +$scope.score_meta[prop]);
                    }
                    playSentencesList(meta_info_text);

                    $scope.score_content = response.scoreContent;
                    for (var prop in $scope.score_content) {
                        $scope.measures.push($scope.score_content[prop]);
                    }
                    $scope.size = $scope.measures.length;
                    $scope.start();
                }
            })
    }

    $scope.start = function() {
        for(var i = 0; i < $scope.blockSize && i + $scope.offset < $scope.size; i++) {
            $scope.display_list.push("Measure No."+(i+$scope.offset+1));
        }
    }

    $scope.increaseBlock = function() {
        if($scope.blockSize == $scope.size || $scope.size == 0) return;
        let oldblockSize = $scope.blockSize;
        let newblockSize = $scope.blockSize + 1;
        let newOffset = (($scope.offset / oldblockSize) > 0? ($scope.offset / oldblockSize)-1: ($scope.offset / oldblockSize)) * newblockSize;

        $scope.blockSize = newblockSize;
        $scope.offset = newOffset;

        $scope.prevBlock();

        utility.get_voice_by_text("sentence size," + $scope.blockSize)
            .then(function(sound_url){
                var sound = new Howl({
                    src: [sound_url],
                    autoplay: true,
                    loop: false,
                    onload: function() {
                        utility.stop_all_sounds();
                        utility.active_sounds.push(sound);
                    }
                  });
            }, function(error){

            });
    }

    $scope.decreaseBlock = function() {
        if($scope.blockSize == 1) return;
        let oldblockSize = $scope.blockSize;
        let newblockSize = $scope.blockSize - 1;
        let newOffset = (($scope.offset / oldblockSize) < $scope.size-1? ($scope.offset / oldblockSize)+1: ($scope.offset / oldblockSize)) * newblockSize;

        $scope.blockSize = newblockSize;
        $scope.offset = newOffset;

        $scope.prevBlock();

        utility.get_voice_by_text("sentence size," + $scope.blockSize)
            .then(function(sound_url){
                var sound = new Howl({
                    src: [sound_url],
                    autoplay: true,
                    loop: false,
                    onload: function() {
                        utility.stop_all_sounds();
                        utility.active_sounds.push(sound);
                    }
                  });
            }, function(error){

            });
    }

    $scope.nextBlock = function() {
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
        console.log($scope.hand + "Hand");
        $scope.$apply();
    }

    $scope.setRightHand = function(){
        $scope.hand = "Right";
        console.log($scope.hand + "Hand");
        $scope.$apply();
    }

    // input : urls of voices
    let play = function(str_or_list_to_play) {
        let list = [];
        if(typeof str_or_list_to_play == "string") {
            if(str_or_list_to_play == "") return;
            list = [str_or_list_to_play];
        }
        else {
            if(str_or_list_to_play.length == 0) return;
            else list = str_or_list_to_play;
        }
        var sound = new Howl({
            src: [list[0]],
            preload: true,
            autoplay: true,
            rate : 1,
            onload: function() {
                utility.active_sounds.push(sound);
            },
            onend: function() {
                console.log('Finished!');
                list.splice(0, 1);
                setTimeout(function(){ play(list); }, 500);
            },
          });
        utility.active_sounds.push(sound);
    }

    let playSentence = function(sentence) {
        utility.get_voice_by_text(sentence)
            .then(function(sound_url){
                utility.stop_all_sounds();
                play(sound_url);
            }, function(error){

            });
    }

    // input : urls of voices
    let playSentencesList = function(list) {
        if(list.length == 0) return;
        utility.get_voices_by_list(list)
            .then(function(urls){
                utility.stop_all_sounds();
                play(urls);
            }, function(error){

            });
    }

    key('f', function() {
      console.log('F key pressed');
      $scope.like();
    });

    key('=', function() {
      console.log('= key pressed');
      $scope.increaseBlock();
    });

    key('-', function() {
      console.log('- key pressed');
      $scope.decreaseBlock();
    });

    key('+', function() {
      console.log('+ key pressed');
      $scope.increaseBlock();
    });

    key('_', function() {
      console.log('down key pressed');
      $scope.decreaseBlock();
    });

    key('down', function() {
      console.log('down key pressed');
      $scope.setLeftHand();
    });

    key('up', function() {
      console.log('up key pressed');
      $scope.setRightHand();
    });

    key('left', function() {
      console.log('left key pressed');
      $scope.prevBlock();
    });

    key('right', function() {
      console.log('right key pressed');
      $scope.nextBlock();
    });

    key('space, enter', function() {
      console.log('space/enter key pressed')
      let sentences = [];
      for(var i = 0; i < $scope.blockSize && i + $scope.offset < $scope.size; i++) {
          sentences.push("measure " + (i+$scope.offset+1));
          let cutted = $scope.measures[i+$scope.offset][$scope.hand].split(',');
          for(var j = 0 ; j < cutted.length; j++ ) {
                sentences.push(cutted[j]);
          }
      }
      console.log(sentences);
      playSentencesList(sentences);
    });

}]);
