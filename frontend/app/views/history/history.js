'use strict';

angular.module('myApp.history', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/history', {
    templateUrl: 'views/history/history.html',
    controller: 'HistoryCtrl'
  });
}])

.controller('HistoryCtrl', ['$scope', 'httpUtil', 'fakeData', '$location','navigation', function($scope, httpUtil, fakeData, $location, navigation) {
    $scope.historyList = [];
    $scope.selected = null;
    $scope.showResult = false;

    key.unbind('left');
    key.unbind('right');
    key.unbind('enter');

    httpUtil.get("/")
    .then(function(response) {

        var response = fakeData.historyList; // TODO: Change to real API data
        //TODO: PUT ALL THESE CODE INTO "THEN"
        if (response !== null) {
            $scope.historyList = response;
            if($scope.historyList.length > 0) $scope.selected = 0;
            $scope.showResult = true;
        }

    }, function(error) {

        //TODO: PUT ALL THESE CODE INTO "THEN"
        var response = fakeData.historyList; // TODO: Change to real API data

        if (response !== null) {
            $scope.historyList = response;
            if($scope.historyList.length > 0) $scope.selected = 0;
            $scope.showResult = true;
        }

    })

    $scope.select = function(ind) {
        $scope.selected = ind;
        console.log(ind);
    }

    $scope.prev = function(ind) {
        if($scope.selected != null) {
            if($scope.selected > 0) {
                $scope.selected --;
                $scope.$apply();
            }
        }
    }

    $scope.next = function(ind) {
        if($scope.selected != null) {
            if($scope.selected < $scope.historyList.length - 1) {
                $scope.selected ++;
                $scope.$apply();
            }
        }
    }

    if($location.path() == '/history') {

        key('left', function() {
          console.log('up key pressed');
          $scope.prev();
        });

        key('right', function() {
          console.log('down key pressed');
          $scope.next();
        });

        key('enter', function() {
          console.log('enter key pressed');
          navigation('play', {"id" : $scope.historyList[$scope.selected].id});
          $scope.$apply();
        });

    }

}]);
