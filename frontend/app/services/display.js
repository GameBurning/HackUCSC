angular.module('myApp')
  .service('display', ['utility', function(utility) {
      var self = this;

      let translate = {
          "zh" : {
              "Difficulty" : "难度",
              "Sentence Size" : "乐句长度",
              "Add to favorite" : "添加到收藏夹",
              "Treble" : "高音谱号",
              "Bass" : "低音谱号",
              "Sentence" : "乐句",
              "Favorite" : "收藏夹",
              "History" : "历史记录",
              "Composer" : "作曲家",
              "sentence size" : "小节数"
          },
          "en" : {
              "Difficulty" : "Difficulty",
              "Sentence Size" : "Sentence Size",
              "Add to favorite" : "Add to favorite",
              "Treble" : "Treble",
              "Bass" : "Bass",
              "Sentence" : "Sentence",
              "Favorite" : "Favorite",
              "History" : "History",
              "Composer" : "Composer",
              "sentence size" : "sentence size"
          }
      };

      self.show = function(text) {
          if(utility.language.indexOf("en") != -1) {
              if(translate['en'].hasOwnProperty(text))
                return translate["en"][text];
          }
          else if(utility.language.indexOf("zh") != -1) {
              if(translate['zh'].hasOwnProperty(text))
                return translate["zh"][text];
          }
      }
  }]);
