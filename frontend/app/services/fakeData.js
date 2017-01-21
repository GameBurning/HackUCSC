angular.module('myApp')
  .factory('fakeData', function() {
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

    return {
      favoriteList: favoriteList,
      historyList: historyList,
    };
  });
