'use strict';

angular.module('myApp.play', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/play', {
      templateUrl: 'views/play/play.html',
      controller: 'PlayCtrl'
    });
  }])

  .controller('PlayCtrl', ['$scope', 'httpUtil', '$location', 'fakeData', '$q', 'utility', 'display', 'config',
    function($scope, httpUtil, $location, fakeData, $q, utility, display, config) {
      console.log($location.search());
      var lang = utility.language;
      $scope.show = display.show;
      $scope.score_meta = null;
      $scope.score_content = null;
      $scope.measures = [];
      $scope.display_list = [];
      $scope.blockSize = 1;
      $scope.offset = 0;
      $scope.current_measure = 1;
      $scope.size = 0;
      $scope.start = 0;
      $scope.hand = "Right";

      var clearKeys = function() {
        for (var i = 0; i < utility.registered_keys.length; i++) {
          key.unbind(utility.registered_keys[i]);
        }
      }

      clearKeys();

      $scope.like = function() {

      }

      if ($location.search() && $location.search().id) {
        var score_id = $location.search().id;
        utility.get_score(score_id)
          .then(function(response) {
            $scope.score_meta = response.metaInfo;
            var meta_info_text = [];
            for (var i = 0; i < $scope.score_meta.length; i++) {
              for (var prop in $scope.score_meta[i]) {
                meta_info_text.push(prop + ". " + $scope.score_meta[i][prop]);
              }
            }
            playSentencesList(meta_info_text);

            $scope.score_content = response.scoreContent;
            for (var prop in $scope.score_content) {
              $scope.measures.push($scope.score_content[prop]);
            }
            $scope.size = $scope.measures.length;
            $scope.start();
          }, function(error) {
            console.log(JSON.stringify(error));
          })
      }

      $scope.start = function() {
        for (var i = 0; i < $scope.blockSize && i + $scope.offset < $scope.size; i++) {
          if (lang == "chinese") {
            $scope.display_list.push("第 " + (i + $scope.offset + 1) + " 小节");
          } else if (lang.indexOf("en") != -1) {
            $scope.display_list.push("Measure No." + (i + $scope.offset + 1));
          }
        }
      }

      $scope.increaseBlock = function() {
        if ($scope.blockSize == $scope.size || $scope.size == 0) return;
        var oldblockSize = $scope.blockSize;
        var newblockSize = $scope.blockSize + 1;
        var newOffset = (($scope.offset / oldblockSize) > 0 ? ($scope.offset / oldblockSize) - 1 : ($scope.offset / oldblockSize)) * newblockSize;

        $scope.blockSize = newblockSize;
        $scope.offset = newOffset;

        $scope.prevBlock();

        utility.get_voice_by_text(display.show("sentence size") + "," + $scope.blockSize)
          .then(function(sound_url) {
            var sound = new Howl({
              src: [sound_url],
              autoplay: true,
              loop: false,
              onload: function() {
                utility.stop_all_sounds();
                utility.active_sounds.push(sound);
              }
            });
          }, function(error) {

          });
      }

      $scope.decreaseBlock = function() {
        if ($scope.blockSize == 1) return;
        var oldblockSize = $scope.blockSize;
        var newblockSize = $scope.blockSize - 1;
        var newOffset = (($scope.offset / oldblockSize) < $scope.size - 1 ? ($scope.offset / oldblockSize) + 1 : ($scope.offset / oldblockSize)) * newblockSize;

        $scope.blockSize = newblockSize;
        $scope.offset = newOffset;

        $scope.prevBlock();

        utility.get_voice_by_text(display.show("sentence size") + "," + $scope.blockSize)
          .then(function(sound_url) {
            var sound = new Howl({
              src: [sound_url],
              autoplay: true,
              loop: false,
              onload: function() {
                utility.stop_all_sounds();
                utility.active_sounds.push(sound);
              }
            });
          }, function(error) {

          });
      }

      $scope.nextBlock = function() {
        if ($scope.offset + $scope.blockSize < $scope.size) {
          $scope.offset += $scope.blockSize;
        }
        $scope.display_list = [];
        for (var i = 0; i < $scope.blockSize && i + $scope.offset < $scope.size; i++) {
          if (lang == "chinese") {
            $scope.display_list.push("第 " + (i + $scope.offset + 1) + " 小节");
          } else if (lang.indexOf("en") != -1) {
            $scope.display_list.push("Measure No." + (i + $scope.offset + 1));
          }
        }
        $scope.$apply();
      }

      $scope.prevBlock = function() {
        if ($scope.offset - $scope.blockSize > 0) {
          $scope.offset -= $scope.blockSize;
        } else {
          $scope.offset = 0;
        }
        $scope.display_list = [];
        for (var i = 0; i < $scope.blockSize && i + $scope.offset < $scope.size; i++) {
          if (lang == "chinese") {
            $scope.display_list.push("第 " + (i + $scope.offset + 1) + " 小节");
          } else if (lang.indexOf("en") != -1) {
            $scope.display_list.push("Measure No." + (i + $scope.offset + 1));
          }
        }
        $scope.$apply();
      }

      $scope.setLeftHand = function() {
        $scope.hand = "Left";
        console.log($scope.hand + "Hand");
        $scope.$apply();
      }

      $scope.setRightHand = function() {
        $scope.hand = "Right";
        console.log($scope.hand + "Hand");
        $scope.$apply();
      }

      // input : urls of voices
      var play = function(str_or_list_to_play) {
        var list = [];
        if (typeof str_or_list_to_play == "string") {
          if (str_or_list_to_play == "") return;
          list = [str_or_list_to_play];
        } else {
          if (str_or_list_to_play.length == 0) return;
          else list = str_or_list_to_play;
        }
        var sound = new Howl({
          src: [list[0]],
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
            }, 500);
          }
        });
        utility.active_sounds.push(sound);
      }


      // input : voice text
      var playSentence = function(sentence) {
        utility.get_voice_by_text(sentence)
          .then(function(sound_url) {
            utility.stop_all_sounds();
            play(sound_url);
          }, function(error) {

          });
      }

      // input : list of voices text
      var playSentencesList = function(list) {
        if (list.length == 0) return;
        utility.get_voices_by_list(list)
          .then(function(urls) {
            utility.stop_all_sounds();
            console.log(urls);
            play(urls);
          }, function(error) {
            console.log("getting voice list fail");
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
        console.log('space/enter key pressed');
        utility.stop_all_sounds();
        var sentences = [];
        for (var i = 0; i < $scope.blockSize && i + $scope.offset < $scope.size; i++) {
          sentences.push(config.api.fetch_mp3 + $scope.measures[i + $scope.offset][$scope.hand]['mp3']);
          console.log($scope.measures[i + $scope.offset][$scope.hand]['text']);
        }

        play(sentences);
      });

    }
  ]);
