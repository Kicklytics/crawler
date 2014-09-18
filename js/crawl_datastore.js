var mongoose = require('mongoose');
var events = require('events');
var debug = require('debug')('app.CrawlStore');
var db_connection = mongoose.createConnection('mongodb://localhost/streamline-webcrawler');

var model = require('./crawl_model');
var CrawlModel = undefined;

var reportError = function(value){
  debug('ERROR: Value = ' + value);
}

db_connection.on('error', reportError);
db_connection.on('connecting', function(){ debug('mongoose connecting'); });
db_connection.on('connected', function(){ debug('mongoose connected'); });
db_connection.on('disconnecting', function(){ debug('mongoose disconnecting'); });
db_connection.on('disconnected', function(){ debug('mongoose disconnected'); });
db_connection.on('close', function(){ debug('mongoose close'); });
db_connection.on('reconnected', function(){ debug('mongoose reconnected'); });
db_connection.on('open',
  function(){
    debug('mongoose open');
    CrawlModel = new model(mongoose, db_connection);
    debug('models ready');
  }
);

var CrawlStore = function(options){
  events.EventEmitter.call(this);

  this.on('data', this.onData.bind(this.tiler));
  return this;
}

CrawlStore.prototype.__proto__ = events.EventEmitter.prototype;

CrawlStore.prototype.getModel = function(){
  return CrawlModel;
}

CrawlStore.prototype.onData = function(data){
  debug('Storing data: ' + {type: data.type, origin: data.origin});

  var crawl = new CrawlModel.Crawl( data );
  crawl.save(function(err){
    if(!err){return};
    console.warn('failed to save data:' + {type: data.type, origin: data.origin} + ' err:' + err);
  });
}

module.exports = CrawlStore;
