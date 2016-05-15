// FOR THE PATHS, CHECK IF IT'S A NEW PATH OR WHATEVER ELSE MIGHT CHANGE

var Paths = require('./paths');
var paths = Paths.getPaths();

var View = require('./views/main');

var emitter;
var subscriptions;

var query = '';

var compiledSelector = '';

var showTogetherWithFindPanel = true;

var Crawler = require('./highlights/crawler-instance');

var events = require('./events');

Paths.emitter.on('paths-updated', function onPathsUpdated(paths) {
  console.log(paths);
});

function toggleSearchPanel() {
  View.togglePanel('bottom', null, true);
  View._selectorInput.focus();
}

// match.selection.range.start
function onMatchClicked(selection) {
  // console.log(selection);
  Crawler.setCurrentMatch(selection.path, selection.range.start);
}

function onSearch(data) {
  var forward = typeof data.forward === 'boolean' ? data.forward : true;
  // console.log(forward);

  // check previous query
  Crawler.makeOrUpdateCrawler(emitter, data, forward);
}

function onFindCommand() {
  console.log('onFindCommand');
  if (showTogetherWithFindPanel) {
    // console.log(View)
    View.togglePanel('bottom', true);
  }
}

function cancel() {
  // debugger;
  Crawler.destroyCrawler();
  View.togglePanel('all', false);
}

function setPaths(paths) {
  Crawler.setPaths(paths);
}

var app = {
  activate: function activate() {
    // console.log('ACTIVATE');
    var obj = events.addEvents({
      commands: [
        { 'project-find:show': onFindCommand },
        { 'find-and-replace:show': onFindCommand },
        { 'atom-stylus:toggle': toggleSearchPanel },
        { 'core:cancel': cancel }
      ],
      emitter: { // use the same format as the commands object
        'match-clicked': onMatchClicked,
        'search': onSearch
      }
    }, View);
    // console.log(obj);
    emitter = obj.emitter;
    subscriptions = obj.subscriptions;
    View.initialize(emitter, true); // visible = true (replace this second parameter with options object)
    setPaths(paths); // this can be used to update the thing
  },

  deactivate: function deactivate() {
    Crawler.destroyCrawler();
    subscriptions && subscriptions.dispose();
    View && View.destroy();
  }
};

module.exports.setPaths = setPaths;
module.exports.app = app;
