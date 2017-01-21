angular.module('myApp')
.factory('navigation', ['$rootScope','$location', function($rootScope, $location) {
    return function(dest, params) {
        if(params) $location.path('/' + dest).search(params);
        else $location.path('/' + dest);
        console.log($location.path());
   };
}]);
