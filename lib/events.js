function addEvents(subscriptions, emitter, crawler, controller) {

  emitter.on('match-clicked', function(match) {
    crawler && crawler.setCurrentMatch(match.path, match.match.range.start);
  });

  subscriptions.add(atom.commands.add('atom-workspace', {
    'find-and-replace:show': controller.onFindCommand
  }));

  subscriptions.add(atom.commands.add('atom-workspace', {
    'project-find:show': controller.onFindCommand
  }));

  subscriptions.add(atom.commands.add('atom-workspace', {
    'atom-stylus:toggle': controller.togglePanel
  }));

  subscriptions.add(atom.commands.add('atom-workspace', {
    'core:cancel': function() {
      // destroyCrawler();
      // View.toggleSearchInputPanel(false)
    }
  }));

}

module.exports.addEvents = addEvents;
