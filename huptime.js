var domain = require('domain');
var serverDomain = domain.create();
var gracefulExit = require('express-graceful-exit');
var domainError = require('express-domain-errors');
var express = require('express');
var app;
var server;

function sendOfflineMsg() {
  if (process.send) process.send('offline')
}

function doGracefulExit() {
  gracefulExit.gracefulExitHandler(app, server, {log: true})
}

serverDomain.run(function() {
  app = express()

  app.use(domainError(sendOfflineMsg, doGracefulExit))


  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);

  app.get('/hello', function(req, res){
    res.send(200);
  });

  var port = 5000;
  server = app.listen(port);

  server.on('listening', function() {
    console.log('Listening on port ', port);
    if (process.send) process.send('online')
  })

  process.on('message', function(message) {
    if (message == 'shutdown') {
      console.log('shutting down gracefully');
      doGracefulExit();
      console.log('shutdown');

    }
  })

})