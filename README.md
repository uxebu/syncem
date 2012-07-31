Sync'em
=======

Synchronizes multiple async calls, to return one callback when all are done.
Our initial use case was synchronizing some DB calls with other async calls.
Like so:

~~~js
  function doMultipleThingsInParallel(){
    job.create(callback); // the `callback` is not synchronized with the `finalCallback` below
    upload.start(finalCallback);
  }
~~~

Syncem helps like this:

~~~js
  function doMultipleThingsInParallel(){
    var sync = new SyncEm(finalCallback);
    job.create( sync.toBeSynced() );
    upload.start( sync.toBeSynced() );
  }
~~~

when both async jobs are done, the `finalCallback` is executed.
