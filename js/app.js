var express = require('express');
var bodyParser = require('body-parser')
var compression = require('compression')
var path = require('path');
var http = require('http');
var logger = require('morgan');
var debug = require('debug')('app');

//Routes

var async = require('async');

var app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(compression());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


var CrawlerManager = require('./crawler_manager');

var manager = new CrawlerManager( {crawlers: ['kickstarter']} );


//Downloads header, pics right lib crawls and indexes
app.get('/crawl/:path', function(req, res){
  if(req.params.path === undefined){
    res.status(400).json({ err: "Bad Request" });
  }

  manager.enque.bind(manager)(decodeURIComponent(req.params.path));

  res.status(200).json({ status: "ok" });
});



/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });

        console.log(err.stack);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(3000);

module.exports = app;
