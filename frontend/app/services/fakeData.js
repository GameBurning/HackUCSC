angular.module('myApp')
  .factory('fakeData', function() {
      var searchList = [
          {
              id : "score_1",
              name : "score_1"
          },
          {
              id : "score_2",
              name : "score_2"
          },
          {
              id : "score_3",
              name : "score_3"
          },
          {
              id : "score_4",
              name : "score_4"
          },
          {
              id : "score_5",
              name : "score_5"
          }
      ];
    var favoriteList = [
        "score_1",
        "score_2",
        "score_3",
    ];

    var historyList = [
        "score_1",
        "score_2",
        "score_3",
        "score_4",
        "score_5",
    ];

    var musicScore = {
        metaInfo: {
            "author" : "Jamie"
        },
        scoreContent : {
            1:{
                Left : "whole D5, E3",
                Right : "D5, E3, whole C3"
            },
            2:{
                Left : "whole D5, E3 2",
                Right : "D5, E3, whole C3 2"
            },
            3:{
                Left : "whole D5, E3 3",
                Right : "D5, E3, whole C3 3"
            },
            4:{
                Left : "whole D5, E3 4",
                Right : "D5, E3, whole C3 4"
            },
            5:{
                Left : "whole D5, E3 5",
                Right : "D5, E3, whole C3 5"
            },
            6:{
                Left : "whole D5, E3 6",
                Right : "D5, E3, whole C3 6"
            },
            7:{
                Left : "whole D5, E3 7",
                Right : "D5, E3, whole C3 7"
            },
            8:{
                Left : "whole D5, E3 8",
                Right : "D5, E3, whole C3 8"
            },
            9:{
                Left : "whole D5, E3 9",
                Right : "D5, E3, whole C3 9"
            },
            10:{
                Left : "whole D5, E3 10",
                Right : "D5, E3, whole C3 10"
            },
            11:{
                Left : "whole D5, E3 11",
                Right : "D5, E3, whole C3 11"
            },
            12:{
                Left : "whole D5, E3 12",
                Right : "D5, E3, whole C3 12"
            }
        }
    }
    return {
      favoriteList: favoriteList,
      historyList: historyList,
      searchList : searchList,
      musicScore : musicScore,
    };
  });
