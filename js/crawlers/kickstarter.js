var events = require('events');
var url = require('url');
var CrawlModel = require('../crawl_model');
var debug = require('debug')('app.Crawlers.KickStarter');
var KCrawler = require('../../lib/crawler');

var KickStarter = function(manager){
  this.crawler = new KCrawler();

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
  var startTime = new Date();

  this.crawler.crawlProject(path);

  this.crawler.on('project', function(project){
    debug("Project: " + project);

    var crawl = {
      start_time : startTime,
      end_time : new Date(),
      cloud : 'kickstarter',
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
      cloud : 'kickstarter',
      origin : path,
      type : 'backer',
      data : backer
    };

    this.emit('data', crawl);
  }.bind(this));
}



module.exports = KickStarter;
