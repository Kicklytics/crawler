var CrawlModel = function(mongoose, connection){

  this.CrawlSchema = new mongoose.Schema({
    timestamp : Object,
    type : String,
    origin : String,
    data : Object
  })

  this.Crawl = connection.model('Crawl', this.CrawlSchema);

  return this;
}

module.exports = CrawlModel;
