var CrawlModel = function(mongoose, connection){

  this.CrawlSchema = new mongoose.Schema({
    start_time : Object,
    end_time : Object,
    cloud : String,
    type : String,
    origin: String,
    data : Object
  })

  this.Crawl = connection.model('Crawl', this.CrawlSchema);

  /*
  this.CrawlRequestSchema = new mongoose.Schema({
    request_time : Object,
    target_uri : String,
    params : Object
  })

  this.CrawlRequest = connection.model('CrawlRequest', this.CrawlRequestSchema);

  this.CrawlResultSchema = new mongoose.Schema({
    start_time : Object,
    end_time : Object,
    cloud : String,
    crawler : String,
    type : String,
    origin_uri : String,
    data : Object
  })
  */

  return this;
}

module.exports = CrawlModel;
