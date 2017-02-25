angular.module('myApp')
  .service('config', [function() {
      return {
          api : {
            text_to_speech : "http://localhost:8001",
            music_score_english : "http://gameburning.com:5000/api/language/english",
            music_score_chinese : "http://gameburning.com:5000/api/language/chinese",
            user : "http://gameburning.com:5000/api"
        }
      };
  }]);
