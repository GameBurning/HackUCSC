angular.module('myApp')
  .service('config', [function() {
      return {
          api : {
            text_to_speech : "http://localhost:8001",
            music_score : "http://gameburning.com:5000/api",
            user : "http://gameburning.com:5000/api"
        }
      };
  }]);
