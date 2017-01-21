angular.module('myApp')
.controller('mainCtrl', ['$scope','$rootScope','$location','navigation',function($scope, $rootScope, $location, navigation) {

    $scope.nav = function(dest){
        navigation(dest);
    }

}]);
