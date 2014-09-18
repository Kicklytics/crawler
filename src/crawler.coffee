Krawler = require 'krawler'
events = require 'events'
Spooky = require 'spooky'

module.exports = class ProjectPageCrawler extends events.EventEmitter
  constructor: () ->
    events.EventEmitter.call(this)

  createSpooky: (callback) ->
    new Spooky({
        child: {
            transport: 'http',
            "load-images": "false",
            "web-security": "false",
            "disk-cache": "true"
        },
        casper: {
            logLevel: 'debug',
            verbose: true,
        }
    }, (err) ->
        if (err)
            e = new Error('Failed to initialize SpookyJS')
            e.details = err
            throw e
        callback()
    )

  crawlBackers: (url, project_id) ->
    spooky = @createSpooky () ->
      spooky.start url
      spooky.thenEvaluate () ->
        $mobius = $(".mobius")
        mobius = $mobius.data("mobius")
        $mobius.bind "mobius:loaded_page", () ->
          mobius.load_next()

        mobius.load_next()
      spooky.waitWhileVisible ".load_more"
      spooky.then () ->
        @emit 'backers', @evaluate(() -> 
          return (backer.dataset.cursor for backer in $(".NS_backers__backing_row"))
        )
      spooky.run()

    spooky.on 'console', (line) -> console.log line

    spooky.on 'backers', (backers) =>
      for backer in backers
        backerData =
          user_id: backer,
          project_id: project_id
        @emit 'backer', backerData

  crawlProject: (url) ->
    spooky = @createSpooky () ->
        spooky.start url
        spooky.then () ->
          @emit 'project', @evaluate(() -> return current_project.data)
        spooky.run()

    spooky.on 'project', (project) =>
      @emit 'project', project

      @crawlBackers "#{url}/backers", project.id

    return this


