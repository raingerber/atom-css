var View = require('../views/main');
var Filter = require('../utils/rule-filter');
var HighlightCrawler = require('./highlight-crawler');
var FileSearch = require('../file-utils/file-search');

var crawler;
var files;

// data.type === 'source' | 'output' for what to search
// queries.selector, queries.filter -- query and filter input
function makeOrUpdateCrawler(emitter, data, forward) {
  // console.log('crawler', crawler);
  if (crawler) {
    updateCrawler(forward);
    return crawler;
  }

  var queries = View.getQueries();
  // console.log(queries, data);
  var filterRules = Filter.createFilterRules(queries.filter);

  return crawler = makeCrawler(emitter, data.type, queries.selector, filterRules);
}

function updateCrawler(forward) {
  if (forward) {
    crawler.next();
  } else {
    crawler.prev();
  }
}

// this also creates the search results menu -- that should be moved out of here
function makeCrawler(emitter, searchType, query, filterRules) {
  var matches = files.searchFiles(searchType, query, filterRules); // matches is an array of start points

  if (!matches || !matches.length) {
    // console.log('No matches found; crawler not initialized.');
    return null;
  }

  var moreThanOneMatch = matches.length > 1;

  View._matchList.setFileMatches(emitter, matches);
  View.togglePanel('left', moreThanOneMatch);
  View.togglePanel('bottom', true, true);

  return new HighlightCrawler(matches, function inputCallback() {
    View._selectorInput.focus();
  });
}

function setCurrentMatch(path, startPoint) {
  crawler && crawler.setCurrentMatch(path, startPoint);
}

function destroyCrawler() {

  // with this panel stuff here, it shouldn't just be called destroyCrawler
  View.togglePanel('left', false);
  View.togglePanel('bottom', false);
  crawler && crawler.destroy();
  crawler = null;
}

// should trigger the change/delete events, etc.
function setPaths(paths) {
  files = new FileSearch(paths);
}

function getFiles() {
  return files;
}

module.exports.makeOrUpdateCrawler = makeOrUpdateCrawler;
module.exports.destroyCrawler = destroyCrawler;
module.exports.setCurrentMatch = setCurrentMatch;
module.exports.setPaths = setPaths;
module.exports.getFiles = getFiles;
