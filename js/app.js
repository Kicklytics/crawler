var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser')
var errorHandler = require('errorhandler')
var methodOverride = require('method-override')
var compression = require('compression')
var path = require('path');
var http = require('http').createServer(app);
var io = require('socket.io')(http);

//var favicon = require('static-favicon');
var debug = require('debug')('app');

//Routes

var async = require('async');

//app.use(logger('dev'));
/*app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())*/


//app.use(express.static(__dirname + '/public')); 	// set the static files location /public/img will be /img for users
app.use(morgan('dev')); 					// log every request to the console

/*
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
*/

app.use(express.static(__dirname + '/../public'));


app.get("/", function (req, res) {
  res.redirect("/index.html");
});

//app.use(compression());
//app.use(app.router);

var CrawlerManager = require('./crawler_manager');

var manager = new CrawlerManager( {crawlers: ['kickstarter', 'github']} );


//Downloads header, pics right lib crawls and indexes
app.get('/crawl/:path', function(req, res){
  if(req.params.path === undefined){
    res.status(400).json({ err: "Bad Request" });
  }

  manager.enque.bind(manager)(decodeURIComponent(req.params.path));

  res.status(200).json({ status: "ok" });
});




io.on('connection', function(socket){
  //Setup messge handlers
  socket.on('crawl-request', function(data){
    socket.emit('crawling', data);
  });


  debug('new socket.io client: ' + socket.conn.remoteAddress);

  //Alert the client that they are connected
  socket.emit('connected', true);
});



app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(errorHandler({
  dumpExceptions: true,
  showStack: true
}));

/*
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
*/

http.listen(3000);

module.exports = app;
