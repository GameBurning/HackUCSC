angular.module('myApp')
  .service('utility', ['httpUtil', '$q', 'config', function(httpUtil, $q, config) {
    var self = this;

    self.registered_keys = ['up','down','left','right','space','enter','-','_','+','=','f'];
    self.active_sounds = [];

    self.stop_all_sounds = function() {
        for(var i = 0; i < self.active_sounds.length; i++) {
            self.active_sounds[i].stop();
        }
    }
    
    self.get_voice_by_text = function(text) {
        var deferred = $q.defer();
        httpUtil.get( config.api.text_to_speech + "/speak?sentence='"+ text +"'")
            .then(function(response) {
              if (response !== null) {
                deferred.resolve(config.api.text_to_speech + response);
              }
              else {
                  deferred.reject({
                    err: "Ah!.. response is null",
                    status: 1
                  })
              }
            }, function(error) {
                deferred.reject({
                  err: error,
                  status: 0
                })
            });
        return deferred.promise;
    }

    self.get_voices_by_list = function(list) {
        let promises = [];
        var deferred = $q.defer();
        for(var i = 0; i < list.length; i++) {
            promises.push(httpUtil.get(config.api.text_to_speech + "/speak?sentence='"+list[i]+"'"));
        }
        $q.all(promises)
            .then(function(values) {
                  for(var i = 0; i < values.length; i++) {
                      values[i] = config.api.text_to_speech + values[i];
                  }
                  deferred.resolve(values);
              }, function(error){
                  deferred.reject({
                    err: error,
                    status: 0
                  })
              });
        return deferred.promise;
    }

    self.get_score = function(score_id) {
        var deferred = $q.defer();
        httpUtil.get(config.api.music_score + "/musicscores/" + score_id)
        .then(function(response) {
            if (response !== null) {
                deferred.resolve(response);
            }
            else {
                deferred.reject({
                  err: "Ah!.. response is null",
                  status: 1
                })
            }
        }, function(error) {
            deferred.reject({
              err: error,
              status: 0
            })
        });
        return deferred.promise;
    }

    self.search_score = function(search_text) {
        var deferred = $q.defer();
        httpUtil.get(config.api.music_score + "/musicscores/?keyword=" + search_text)
        .then(function(response) {
            if (response !== null) {
                deferred.resolve(response);
            }
            else {
                deferred.reject({
                  err: "Ah!.. response is null",
                  status: 1
                })
            }
        }, function(error) {
            deferred.reject({
              err: error,
              status: 0
            })
        });
        return deferred.promise;
    }

  }]);
