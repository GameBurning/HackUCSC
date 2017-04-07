angular.module('myApp')
  .service('display', ['utility', function(utility) {
      var self = this;

      var translate = {
          "chinese" : {
              "Difficulty" : "难度",
              "Sentence Size" : "乐句长度",
              "Add to favorite" : "添加到收藏夹",
              "Treble" : "高音谱号",
              "Bass" : "低音谱号",
              "Sentence" : "乐句",
              "Favorite" : "收藏夹",
              "History" : "历史记录",
              "Composer" : "作曲家",
              "sentence size" : "小节数",
              "Fail: Get the musicScore" : "错误：获取该乐谱失败"
          },
          "english" : {
              "Difficulty" : "Difficulty",
              "Sentence Size" : "Sentence Size",
              "Add to favorite" : "Add to favorite",
              "Treble" : "Treble",
              "Bass" : "Bass",
              "Sentence" : "Sentence",
              "Favorite" : "Favorite",
              "History" : "History",
              "Composer" : "Composer",
              "sentence size" : "sentence size",
              "Fail: Get the musicScore" : "Fail: Get the musicScore"
          }
      };

      self.show = function(text) {
          if(utility.language == "english") {
              if(translate['english'].hasOwnProperty(text))
                return translate["english"][text];
          }
          else if(utility.language == "chinese") {
              if(translate['chinese'].hasOwnProperty(text))
                return translate["chinese"][text];
          }
      }
  }]);
