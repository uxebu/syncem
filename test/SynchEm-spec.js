require('jasmine-matchers/src/matchers.js');
var SyncEm = require('../lib/SyncEm.js').SyncEm;

describe('SyncEm', function() {
  var callback;
  beforeEach(function() {
    callback = jasmine.createSpy('callback');
  });
  function callAll(funcs) {
    funcs.forEach(function(func) { func(); })
  }

  it('should fire straight', function() {
    var s = new SyncEm(callback);
    s.toBeSynced()();
    expect(callback).toHaveBeenCalled();
  });
  it('should sync two', function() {
    var funcs = [];
    var s = new SyncEm(callback);
    funcs.push(s.toBeSynced());
    // callback should not have been called yet
    expect(callback).not.toHaveBeenCalled();
    funcs.push(s.toBeSynced());
    callAll(funcs);
    // but now the callback should have been called
    expect(callback).toHaveBeenCalled();
  });
  describe('toBeSyncedWithData', function() {
    it('should return the data', function() {
      var funcs = [];
      var s = new SyncEm(callback);
      funcs.push(s.toBeSynced());
      funcs.push(s.toBeSyncedWithData());

      funcs[0]();
      var data = {};
      funcs[1](null, data);
      expect(callback)
        .toHaveBeenCalledWith(null, data);
    });
    it('should callback error', function() {
      var s = new SyncEm(callback);
      var funcs = [s.toBeSynced(), s.toBeSyncedWithData()];
      var error = new Error('first error');
      funcs[0](error);
      funcs[1](null, {});
      expect(callback.mostRecentCall.args[0])
        .toBeInstanceOf(SyncEm.Errors);
    });
  });

  describe('error', function() {
    it('should fire `callback` and return a SyncEm.Errors', function() {
      var s = new SyncEm(callback);
      var error = new Error;
      s.toBeSynced()(error);
      expect(callback.mostRecentCall.args[0])
        .toBeInstanceOf(SyncEm.Errors);
    });
    it('should return error.message of first error', function() {
      var s = new SyncEm(callback);
      var funcs = [s.toBeSynced(), s.toBeSynced()];
      var error1 = new Error('first error');
      var error2 = new Error;
      funcs[0](error1);
      funcs[1](error2);
      expect(callback.mostRecentCall.args[0].message)
        .toEqual(error1.message);
    });
    it('should fire with error after second callback is done', function() {
      var s = new SyncEm(callback);
      var funcs = [
        s.toBeSynced(),
        s.toBeSynced()
      ];
      var error = new Error;
      funcs[0](error);
      funcs[1]();
      expect(callback.mostRecentCall.args[0].allErrors)
        .toEqual([error]);
    });
    it('should also return error from last function', function() {
      var s = new SyncEm(callback);
      var funcs = [
        s.toBeSynced(),
        s.toBeSynced()
      ];
      var error = new Error;
      funcs[0]();
      funcs[1](error);
      expect(callback.mostRecentCall.args[0].allErrors)
        .toEqual([error]);
    });
    it('should return all errors in `allErrors`', function() {
      var s = new SyncEm(callback);
      var funcs = [s.toBeSynced(), s.toBeSynced()];
      var error1 = new Error;
      var error2 = new Error;
      funcs[0](error1);
      funcs[1](error2);
      expect(callback.mostRecentCall.args[0].allErrors)
        .toEqual([error1, error2]);
    });
  });
});
