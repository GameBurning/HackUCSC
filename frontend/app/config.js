angular.module('myApp')
  .service('config', [function() {
      return {
          api : {
              music_score : "http://duyuepu.com:5000/api/language/chinese"
          }
      };
  }]);
