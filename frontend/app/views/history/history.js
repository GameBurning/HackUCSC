'use strict';

angular.module('myApp.history', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/history', {
    templateUrl: 'views/history/history.html',
    controller: 'HistoryCtrl'
  });
}])

.controller('HistoryCtrl', ['$scope', 'httpUtil', 'fakeData', '$location', function($scope, httpUtil, fakeData, $location) {
    $scope.historyList = [];
    $scope.selected = null;

    key.unbind('up');
    key.unbind('down');

    httpUtil.get("/")
    .then(function(response) {


    }, function(error) {
        //TODO: PUT ALL THESE CODE INTO "THEN"
        var response = fakeData.historyList; // TODO: Change to real API data

        if (response !== null) {
            $scope.historyList = response;
            if($scope.historyList.length > 0) $scope.selected = 0;
        }

    })

    $scope.select = function(ind) {
        $scope.selected = ind;
        console.log(ind);
    }

    $scope.up = function(ind) {
        if($scope.selected != null) {
            if($scope.selected > 0) {
                $scope.selected --;
                $scope.$apply();
            }
        }
    }

    $scope.down = function(ind) {
        if($scope.selected != null) {
            if($scope.selected < $scope.historyList.length - 1) {
                $scope.selected ++;
                $scope.$apply();
            }
        }
    }

    if($location.path() == '/history') {

        key('up', function() {
          console.log('up key pressed');
          $scope.up();
        });

        key('down', function() {
          console.log('down key pressed');
          $scope.down();
        });
    }

}]);
