var events = require('events');
var url = require('url');
var CrawlModel = require('../crawl_model');
var debug = require('debug')('app.Crawlers.KickStarter');

var KickStarter = function(manager){
  //

  events.EventEmitter.call(this);

  manager.on('request', this.onRequest.bind(this));

  return this;
}

KickStarter.prototype.__proto__ = events.EventEmitter.prototype;

KickStarter.prototype.onRequest = function(path){
  var target = url.parse(path);

  //debug(target);

  if(target.host !== undefined){
    if(target.host == 'www.kickstarter.com'){

      debug('Starting: ' + target.path);

      this.crawl(path);
    }
  }
}

KickStarter.prototype.crawl = function(path){
  var crawl = {
    timestamp : new Date(),
    type : 'kickstarter',
    origin : path,
    data : null
  };
  
  this.emit('data', crawl);
}



module.exports = KickStarter;
