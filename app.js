var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const winston = require('winston');
winston.add(winston.transports.File, { filename: 'application_log.log' });
winston.remove(winston.transports.Console);
winston.info('logging started');
winston.info('logging working in app.js');

var actors = require('./routes/actors');

var app = express();

app.use(favicon(path.join(__dirname, 'public', 'favicon-96x96.png')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/actors', actors);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  winston.error('app.js error handler - %j', { err });

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
