'use strict';

describe('myApp.favorite module', function() {

  beforeEach(module('myApp.favorite'));

  describe('favorite controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var view1Ctrl = $controller('FavoriteCtrl');
      expect(view1Ctrl).toBeDefined();
    }));

  });
});
