var express = require('express');
var app = express();

app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.get('/hello', function(req, res){
  res.send(200);
});

app.listen(6000);
console.log('Listening on port 6000');