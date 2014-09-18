var events = require('events');
var debug = require('debug')('app.CrawlerManager');
var CrawlStore = require('./crawl_datastore');

var CrawlerManager = function(config){
  this.config = config;
  this.store = new CrawlStore();
  this.crawlers = {};


  for(i in this.config.crawlers){
    var name = this.config.crawlers[i];
    var crawler = new (require('./crawlers/' + name))(this);
    debug('Loaded crawler [' + name + ']');

    crawler.on('data', this._onData.bind(this));
    this.crawlers[name] = crawler;
  }

  return this;
}

CrawlerManager.prototype.__proto__ = events.EventEmitter.prototype;

CrawlerManager.prototype.enque = function(path, cb){
  debug("Crawl Request: " + path);
  //cb("Not Implemented", undefined);
  this.emit('request', path);
}

CrawlerManager.prototype._onData = function(data){
  this.store.emit('data', data);
}


module.exports = CrawlerManager;
