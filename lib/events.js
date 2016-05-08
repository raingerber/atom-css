var CompositeDisposable = require('atom').CompositeDisposable;

function addSubscriptionGetter(subscriptions) {
  function addWorkspaceSubscription(options) {
    subscriptions.add(atom.commands.add('atom-workspace', options || {}));
  }
}

function onSearch(data) {
  var forward = typeof data.forward === 'boolean' ? data.forward : true;
  // console.log(forward);
  // updateSearch(data, forward);
}

function onMatchClicked(match) {
  crawler && crawler.setCurrentMatch(match.path, match.match.range.start);
}

function addEvents(subscriptions, emitter, crawler, controller) {

  var subscriptions = new CompositeDisposable();

  // add these to the disposable as well
  emitter.on('search', onSearch);
  emitter.on('match-clicked', onMatchClicked);

  var addSubscription = addSubscriptionGetter(subscriptions);

  addSubscription([
    { 'find-and-replace:show': controller.onFindCommand },
    { 'project-find:show': controller.onFindCommand },
    { 'atom-stylus:toggle': controller.togglePanel },
    { 'core:cancel': controller.cancel }
  ]);

  return subscriptions;
}

// function cancel() {
  // destroyCrawler();
  // View.toggleSearchInputPanel(false)
// }

// updateSearch onFindCommand togglePanel destroyCrawler cancel View.toggleSearchInputPanel(false)

module.exports.addEvents = addEvents;
