angular.module('myApp')
  .service('httpUtil', ['$http', '$q', function($http, $q) {
    var self = this;
    // Digital Ocean
    // var server_base = "http://jamiewang.me:8000/"

    //Localhost
    // var server_base = "http://localhost:8000/"

    //RealServer

    //http://gameburning.com:5000/api/musicscores

    var csrfcookie = function() {
      var cookieValue = null,
        name = 'csrftoken';
      if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) == (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
  };

    /**
     * General purpose server http get. Handles single server call
     * for multiple function calls. Resolves all promises when data arrives.
     * @param {string} url The server location of the service call.
     * @param {Object} [params] Optional parameters sent with the call.
     * @returns {*}
     */
    self.get = function(url, params) {
      if (!!params) {
        //With value of only number and string : params = {key_1:value_1, key_2:value_2}
        //For the style of "http://api.com/api/v0.1/key_1/value_1/key_2/value_2"
        if (url[url.length - 1] !== '/') url += '/';
        for (var prop in params) {
          if (params.hasOwnProperty(prop) && params[prop]) {
            url += prop + "/" + params[prop];
          }
        }
      }
      var deferred = $q.defer();

      $http.get(url)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err, status) {
          deferred.reject({
            err: err,
            status: status
          })
        });

      return deferred.promise;
    };

    /**
     * General purpose server http post. Handles single server call
     * for multiple function calls. Resolves all promises when data arrives.
     * @param {string} url The server location of the service call.
     * @param {Object} [params] Optional parameters sent with the call.
     * @returns {*}
     */
    self.post = function(url, params) {

      if (url[url.length - 1] !== '/') url += '/';

      if (params === undefined || params == null) {
        params = {};
      }

      var deferred = $q.defer();

      $http.post(url, params, {
          headers: {
            'Content-Type': 'application/json',
            'charset': 'UTF-8',
            'X-CSRFToken': csrfcookie()
          }
        })
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err, status) {
          deferred.reject({
            err: err,
            status: status
          })
        });

      return deferred.promise;
    };

    /**
     * General purpose server http put. Handles single server call
     * for multiple function calls. Resolves all promises when data arrives.
     * @param {string} url The server location of the service call.
     * @param {Object} [params] Optional parameters sent with the call.
     * @param {Function} finishCallback A callback.
     * @returns {*}
     */
    self.put = function(url, params) {

      if (url[url.length - 1] !== '/') url += '/';

      if (params === undefined || params == null) {
        params = {};
      }

      var deferred = $q.defer();

      $http.put(url, params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          }
        })
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err, status) {
          deferred.reject({
            err: err,
            status: status
          })
        });

      return deferred.promise;
    };

    /**
     * General purpose server http delete. Handles single server call
     * for multiple function calls. Resolves all promises when data arrives.
     * @param {string} url The server location of the service call.
     * @param {Function} finishCallback A callback.
     * @returns {*}
     */
    self.delete = function(url) {

      var deferred = $q.defer();

      $http.delete(url)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err, status) {
          deferred.reject({
            err: err,
            status: status
          })
        });

      return deferred.promise;
    };

  }]);
