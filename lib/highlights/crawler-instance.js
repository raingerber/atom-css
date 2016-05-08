var View = require('../views/main');
var Filter = require('../utils/rule-filter');
var HighlightCrawler = require('./highlight-crawler');
var FileSearch = require('../file-utils/file-search');

var crawler;
var files;

function makeOrUpdateCrawler(data, forward) {
  // console.log('crawler', crawler);
  if (crawler) {
    updateCrawler(forward);
    return crawler;
  }

  var queries = View.getQueries();
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

var emitter;

function makeCrawler(_emitter, searchType, query, filterRules) {
  emitter = _emitter;
  var matches = files.searchFiles(searchType, query, filterRules); // matches is an array of start points

  if (!matches || !matches.length) {
    console.log('No matches found; crawler not initialized.');
    return null;
  }

  View._matchList.setFileMatches(emitter, matches);
  View.togglePanel('bottom', true, true);

  return new HighlightCrawler(matches, function inputCallback() {
    View._selectorInput.editor.element.focus();
  });
}

function setCurrentMatch(path, startPoint) {
  crawler && crawler.setCurrentMatch(path, startPoint);
}

function destroyCrawler() {
  View.togglePanel('left', false);
  View.togglePanel('bottom', false);
  crawler && crawler.destroy();
  crawler = null;
}

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
