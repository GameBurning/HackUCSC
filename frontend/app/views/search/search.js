'use strict';

angular.module('myApp.search', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/search', {
    templateUrl: 'views/search/search.html',
    controller: 'SearchCtrl'
  });
}])

.controller('SearchCtrl', ['$scope', 'httpUtil', 'navigation', 'fakeData', function($scope, httpUtil, navigation, fakeData) {

    $scope.shouldFocus = true;
    $scope.showResult = false;
    $scope.searchString = "";
    $scope.searchList = [];
    $scope.selected = null;

    $scope.setUnfocus = function() {
        $scope.onFocus = false;
    }

    $scope.setFocus = function() {
        $scope.onFocus = true;
    }

    $scope.focus = function () {
      $scope.searchString = "";
      $scope.shouldFocus = true;
      $scope.showResult = false;
      $scope.setFocus();

      key.unbind('up');
      key.unbind('down');
      key.unbind('esc');
      key.unbind('backspace');

    };

    $scope.blur = function () {
      $scope.shouldFocus = false;
      $scope.setUnfocus();

    };

    $scope.focus();

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
            if($scope.selected < $scope.searchList.length - 1) {
                $scope.selected ++;
                $scope.$apply();
            }
        }
    }

    $scope.search = function() {
        if($scope.showResult == true) return;
        $scope.showResult = true;
        $scope.blur();
        key.unbind('enter');
        key.unbind('up');
        key.unbind('down');
        key.unbind('esc');
        key.unbind('backspace');

        key('enter', function() {
          console.log('enter key pressed');
          $scope.focus();
          $scope.showResult = false;
          $scope.$apply();
          navigation('play', {"id" : $scope.searchList[$scope.selected]});
        });

        key('up', function() {
          console.log('up key pressed');
          $scope.up();
        });

        key('down', function() {
          console.log('down key pressed');
          $scope.down();
        });

        key('esc', function() {
          console.log('esc key pressed');
          $scope.focus();
          $scope.showResult = false;
          $scope.$apply();
        });

        key('backspace', function() {
          console.log('backspace key pressed');
          $scope.focus();
          $scope.showResult = false;
          $scope.$apply();
        });

        httpUtil.get("http://gameburning.com:5000/api/musicscores/?keyword="+$scope.searchString)
        .then(function(response) {
            //TODO: PUT ALL THESE CODE INTO "THEN"
            // var response = fakeData.searchList; // TODO: Change to real API data
            if (response !== null) {
                $scope.searchList = response;
                if($scope.searchList.length > 0) $scope.selected = 0;
            }
        }, function(error) {
            var response = fakeData.searchList; // TODO: Change to real API data
            if (response !== null) {
                $scope.searchList = response;
                if($scope.searchList.length > 0) $scope.selected = 0;
            }
        });

    }

    $scope.getKey = function(event) {
        if(event.code == 'Enter') {
            console.log($scope.searchString);
            $scope.search();
        }
        if(event.key == '1' && event.ctrlKey == true && !$scope.onFocus) {
            navigation('favorite');
            $scope.open();
            $scope.searchString = "";
        }
        if(event.key == '2' && event.ctrlKey == true) {
            navigation('favorite');
        }
        if(event.key == '3' && event.ctrlKey == true) {
            navigation('history');
        }
    }



}]);
