var SyncEm = require('../lib/SyncEm.js').SyncEm;

function printObj(obj) {
  console.log('incrementAsync:', obj.value==14);
}

function inc(numObj, cb) {
  numObj.value++;
  setTimeout(cb, 10);
}

function incrementAsync() {
  var numObj = {value:0};
  var s = new SyncEm(function() {printObj(numObj);});
  inc(numObj, s.toBeSynced());
  inc(numObj, s.toBeSynced());
  inc(numObj, s.toBeSynced());
  inc(numObj, s.toBeSynced());
  inc(numObj, s.toBeSynced());
  inc(numObj, s.toBeSynced());
  inc(numObj, s.toBeSynced());
  inc(numObj, s.toBeSynced());
  inc(numObj, s.toBeSynced());
  inc(numObj, s.toBeSynced());
  inc(numObj, s.toBeSynced());
  inc(numObj, s.toBeSynced());
  inc(numObj, s.toBeSynced());
  inc(numObj, s.toBeSynced());
}


function printErr(err) {
  console.log('collectError:', err.message=='jo');
}
function collectError() {
  var s = new SyncEm(printErr);
  (function(cb){
    setTimeout(function() {cb(new Error('jo'))}, 1);
  })(s.toBeSynced());
  inc({value:0}, s.toBeSynced());
  inc({value:0}, s.toBeSynced());
  inc({value:0}, s.toBeSynced());

}


function printAllErrors(err) {
  // is the first error the initial error?
  var success = err.message=='first error';
  success = success && (err.allErrors.length == 2);
  success = success && (err.allErrors[1].message == 'second error');
  console.log('collectAllErrors:', success);
}
function collectAllErrors() {
  var s = new SyncEm(printAllErrors);
  (function(cb){
    setTimeout(function() {cb(new Error('first error'))}, 1);
  })(s.toBeSynced());
  (function(cb){
    setTimeout(function() {cb(new Error('second error'))}, 1);
  })(s.toBeSynced());
  inc({value:0}, s.toBeSynced());
  inc({value:0}, s.toBeSynced());
  inc({value:0}, s.toBeSynced());

}


function printData(err, data) {
  console.log('passOnData', JSON.stringify(data));
}
function passOnData() {
  var s = new SyncEm(printData);
  (function(cb){
    setTimeout(function() {cb(null, {data:true})}, 1);
  })(s.toBeSyncedWithData());
  inc({value:0}, s.toBeSynced());
  inc({value:0}, s.toBeSynced());
}


incrementAsync();
collectError();
collectAllErrors();
passOnData();
