angular.module('myApp')
.factory('navigation', ['$rootScope','$location', function($rootScope, $location) {
    return function(dest) {
        $location.path('/' + dest);
        console.log($location.path());
   };
}]);
