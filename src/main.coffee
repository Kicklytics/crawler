#!/usr/bin/env node

ProjectPageCrawler = require './crawler'

crawler = new ProjectPageCrawler()
crawler.crawlProject("https://www.kickstarter.com/projects/agbulleteric/cthulhu-letterpress-printed-and-foil-stamped-holid")

crawler.on 'project', (project) ->
  console.log "Project: #{JSON.stringify project}"

crawler.on 'backer', (backer) ->
  console.log "Backer: #{JSON.stringify backer}"
