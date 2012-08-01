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
    return this.oneCallback.bind(this);
  },

  _successData: null,
  toBeSyncedWithData: function() {
    this._syncCount++;
    return this.oneCallbackWithData.bind(this);
  },

  oneCallbackWithData: function(err, success) {
    this._successData = success;
    this.oneCallback(err, success);
  },

  // Array
  _errors: null,
  oneCallback: function(error) {
    if (error) {
      this._errors.push(error);
    }
    this._syncCount--;
    if (this._syncCount == 0) {
      if (this._errors.length) {
        this._errorCallback();
      } else {
        this._finalCallback(null, this._successData);
      }
    }
  },

  _errorCallback: function() {
    var error = new SyncEm.Errors(this._errors[0].message, this._errors);
    this._finalCallback(error, this._successData);
  }

};

SyncEm.Errors = function(message, allErrors) {
  this.message = message;
  this.allErrors = allErrors;
};
SyncEm.Errors.prototype = Error.prototype;
SyncEm.Errors.prototype.allErrors = null;

module.exports.SyncEm = SyncEm;
