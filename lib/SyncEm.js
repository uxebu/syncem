/**
 * The object handles the synchronization of all
 * asynchronous function calls.
 *
 * @param callback
 * @constructor
 */
var SyncEm = function(callback) {
  this._finalCallback = callback;
  this._errors = [];
};

SyncEm.prototype = {

  _finalCallback: null,
  _syncCount: 0,
  toBeSynced: function() {
    this._syncCount++;
    return this.catchingCallback.bind(this);
  },

  // Array
  _errors: null,
  catchingCallback: function(error, success) {
    if (error) {
      this._errors.push(error);
    }
    this._syncCount--;
    if (this._syncCount == 0) {
      if (this._errors.length) {
        this._errorCallback();
      } else {
        this._finalCallback();
      }
    }
  },

  _errorCallback: function() {
    var error = new SyncEm.Error(this._errors[0].message, this._errors);
    this._finalCallback(error);
  }

};

SyncEm.Error = function(message, allErrors) {
  this.message = message;
  this.allErrors = allErrors;
};
SyncEm.Error.prototype = Error.prototype;
SyncEm.Error.prototype.allErrors = null;

module.exports.SyncEm = SyncEm;
