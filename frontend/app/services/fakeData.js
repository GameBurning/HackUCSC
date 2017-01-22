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
        {
            id : "score_1",
            name : "score_1",
        },
        {
            id : "score_2",
            name : "score_2",
        },
        {
            id : "score_3",
            name : "score_3",
        }
    ];

    var historyList = [
        {
            id : "score_2",
            name : "score_2",
        },
        {
            id : "score_3",
            name : "score_3",
        },
    ];

    var musicScore = {
        metaInfo: {
            "author" : "Jamie"
        },
        scoreContent : {
            1:{
                Left : "oh my god",
                Right : "oh shit"
            },
            2:{
                Left : "oh my god 2",
                Right : "oh shit 2"
            },
            3:{
                Left : "oh my god 3",
                Right : "oh shit 3"
            },
            4:{
                Left : "oh my god 4",
                Right : "oh shit 4"
            },
            5:{
                Left : "oh my god 5",
                Right : "oh shit 5"
            },
            6:{
                Left : "oh my god 6",
                Right : "oh shit 6"
            },
            7:{
                Left : "oh my god 7",
                Right : "oh shit 7"
            },
            8:{
                Left : "oh my god 8",
                Right : "oh shit 8"
            },
            9:{
                Left : "oh my god 9",
                Right : "oh shit 9"
            },
            10:{
                Left : "oh my god 10",
                Right : "oh shit 10"
            },
            11:{
                Left : "oh my god 11",
                Right : "oh shit 11"
            },
            12:{
                Left : "oh my god 12",
                Right : "oh shit 12"
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
