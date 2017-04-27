'use strict';

angular.module('myApp.play', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/play', {
      templateUrl: 'views/play/play.html',
      controller: 'PlayCtrl'
    });
  }])

  .controller('PlayCtrl', ['$scope', 'httpUtil', '$location', 'fakeData', '$q', 'utility', 'display', 'config', '$timeout',
    function($scope, httpUtil, $location, fakeData, $q, utility, display, config, $timeout) {
      console.log($location.search());

      var changingBlockSize = false;

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
              if(response.metaInfo == null) {
                  alert(display.show('Fail: Get the musicScore'));
              }
              else {
                  $scope.score_meta = response.metaInfo;
                  var meta_info_text = [];
                  for (var i = 0; i < $scope.score_meta.length; i++) {
                    for (var prop in $scope.score_meta[i]) {
                      meta_info_text.push(prop + ". " + $scope.score_meta[i][prop]);
                    }
                  }

                  play([config.api.fetch_mp3 + $scope.score_meta.mp3]);

                  $scope.score_content = response.scoreContent;
                  for (var prop in $scope.score_content) {
                    $scope.measures.push($scope.score_content[prop]);
                  }
                  $scope.size = $scope.measures.length;
                  $scope.start();
              }
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

        tellCurrentBlockSize();

        $scope.prevBlock(false);

      }

      $scope.decreaseBlock = function() {
        if ($scope.blockSize == 1) return;
        var oldblockSize = $scope.blockSize;
        var newblockSize = $scope.blockSize - 1;
        var newOffset = (($scope.offset / oldblockSize) < $scope.size - 1 ? ($scope.offset / oldblockSize) + 1 : ($scope.offset / oldblockSize)) * newblockSize;

        $scope.blockSize = newblockSize;
        $scope.offset = newOffset;

        tellCurrentBlockSize();

        $scope.prevBlock(false);

      }

      function tellCurrentOffset() {
          utility.stop_all_sounds();
          let sound_source =
              config.api.fetch_mp3
              + ($scope.offset + 1)
              + (lang=="chinese"? "_zh.mp3" : "")
              + (lang=="english"? "_en.ogg" : "")
          play([sound_source]);

      }

      var timeout_promise = null;

      function tellCurrentBlockSize() {
          utility.stop_all_sounds();
          if(changingBlockSize == false) {
              if(lang=="chinese") {
                play([config.api.fetch_mp3 + 'length' + "_zh.mp3", config.api.fetch_mp3 + 'length/' + $scope.blockSize + ".mp3"]);
              }
              else if(lang=="english") {
                  play([config.api.fetch_mp3 + 'length' + "_en.ogg", config.api.fetch_mp3 + 'length/' + $scope.blockSize + "_en.ogg"]);
              }
              changingBlockSize = true;
          }
          else {
              if(lang=="chinese") {
                  play([config.api.fetch_mp3 + 'length/' + $scope.blockSize + ".mp3"]);
              }
              else if(lang == "english") {
                  play([config.api.fetch_mp3 + 'length/' + $scope.blockSize + "_en.ogg"]);
              }
          }
          console.log($scope.blockSize);
          if(timeout_promise != null) {
              $timeout.cancel(timeout_promise);
          }
          timeout_promise = $timeout(function () {
              console.log("changingBlockSize = false;");
              changingBlockSize = false;
          }, 3000);
      }

      $scope.nextBlock = function(readout) {
        if ($scope.offset + $scope.blockSize < $scope.size) {
          $scope.offset += $scope.blockSize;
        }
        if(readout == undefined || readout == true) tellCurrentOffset();
        // $scope.display_list = [];
        // for (var i = 0; i < $scope.blockSize && i + $scope.offset < $scope.size; i++) {
        //   if (lang == "chinese") {
        //     $scope.display_list.push("第 " + (i + $scope.offset + 1) + " 小节");
        //   } else if (lang.indexOf("en") != -1) {
        //     $scope.display_list.push("Measure No." + (i + $scope.offset + 1));
        //   }
        // }
        $scope.$apply();
      }

      $scope.prevBlock = function(readout) {
        if ($scope.offset - $scope.blockSize > 0) {
          $scope.offset -= $scope.blockSize;
        } else {
          $scope.offset = 0;
        }

        if(readout == undefined || readout == true) tellCurrentOffset();
        // $scope.display_list = [];
        //
        // for (var i = 0; i < $scope.blockSize && i + $scope.offset < $scope.size; i++) {
        //   if (lang == "chinese") {
        //     $scope.display_list.push("第 " + (i + $scope.offset + 1) + " 小节");
        //   } else if (lang.indexOf("en") != -1) {
        //     $scope.display_list.push("Measure No." + (i + $scope.offset + 1));
        //   }
        // }
        $scope.$apply();
      }

      $scope.handFeekback = function() {
          var sound_source = "/resources/sounds/" + $scope.hand
                +(lang=="chinese"?".mp3":"")
                +(lang=="english"?"_en.ogg":"");
          var sound = new Howl({
              src: [sound_source],
              preload: true,
              autoplay: true,
              rate : 1,
              onload: function() {
                  utility.stop_all_sounds();
                  utility.active_sounds.push(sound);
              },
              onend: function() {
                  console.log('Finished!');
              },
              onloaderror: function(e){
                  debugger
              }
            });
      }

      $scope.setLeftHand = function() {
        $scope.hand = "Left";
        console.log($scope.hand + "Hand");
        $scope.handFeekback();
        $scope.$apply();
      }

      $scope.setRightHand = function() {
        $scope.hand = "Right";
        console.log($scope.hand + "Hand");
        $scope.handFeekback();
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
            }, 0);
            },
          onloaderror: function(e){
              debugger
          }
        });
        utility.active_sounds.push(sound);
      }


      // input : voice text
      var playSentence = function(sentence) {
        // utility.get_voice_by_text(sentence)
        //   .then(function(sound_url) {
        //     utility.stop_all_sounds();
        //     play(sound_url);
        //   }, function(error) {
        //
        //   });
      }

      // input : list of voices text
      var playSentencesList = function(list) {
        // if (list.length == 0) return;
        // utility.get_voices_by_list(list)
        //   .then(function(urls) {
        //     utility.stop_all_sounds();
        //     console.log(urls);
        //     play(urls);
        //   }, function(error) {
        //     console.log("getting voice list fail");
        //   });
      }

      key('f', function() {
        // console.log('F key pressed');
        changingBlockSize = false;
        $scope.like();
      });

      key('=', function() {
        // console.log('= key pressed');
        $scope.increaseBlock();
      });

      key('-', function() {
        // console.log('- key pressed');
        $scope.decreaseBlock();
      });

      key('+', function() {
        // console.log('+ key pressed');
        $scope.increaseBlock();
      });

      key('_', function() {
        // console.log('down key pressed');
        $scope.decreaseBlock();
      });

      key('down', function() {
        // console.log('down key pressed');
        changingBlockSize = false;
        $scope.setLeftHand();
      });

      key('up', function() {
        // console.log('up key pressed');
        changingBlockSize = false;
        $scope.setRightHand();
      });

      key('left', function() {
        // console.log('left key pressed');
        changingBlockSize = false;
        $scope.prevBlock();
      });

      key('right', function() {
        // console.log('right key pressed');
        changingBlockSize = false;
        $scope.nextBlock();
      });

      key('space, enter', function() {
        // console.log('space/enter key pressed');
        changingBlockSize = false;
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
