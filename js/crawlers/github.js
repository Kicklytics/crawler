var events = require('events');
var url = require('url');
var CrawlModel = require('../crawl_model');
var debug = require('debug')('app.Crawlers.GitHub');
var KCrawler = require('../../lib/crawler');

var GitHub = function(manager){
  this.crawl_status = {};

  events.EventEmitter.call(this);

  manager.on('request', this.onRequest.bind(this));

  return this;
}

GitHub.prototype.__proto__ = events.EventEmitter.prototype;

GitHub.prototype.onRequest = function(path){
  var target = url.parse(path);

  //debug(target);

  if(target.host !== undefined){
    if(target.host == 'www.github.com'){
      debug("Requested UI crawl: " + target.path);
      //Accept request
      //this.crawl(path);
    }
    else if(target.host == 'www.api.github.com'){
      //this.
      debug("Requested API crawl: " + target.path);
    }
  }
}

GitHub.prototype.crawl = function(path){
  var startTime = new Date();

  //DO CRAWL HERE

  this.crawler.on('project', function(project){
    debug("Project: " + project);

    var crawl = {
      start_time : startTime,
      end_time : new Date(),
      cloud : 'GitHub',
      origin : path,
      type : 'project',
      data : project
    };

    this.emit('data', crawl);
  }.bind(this));

  this.crawler.on('backer', function(backer){
    debug("Backer: " + backer);
    var crawl = {
      start_time : startTime,
      end_time : new Date(),
      cloud : 'GitHub',
      origin : path,
      type : 'backer',
      data : backer
    };

    this.emit('data', crawl);
  }.bind(this));
}



module.exports = GitHub;
