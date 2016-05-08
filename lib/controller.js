// CHECK IF IT'S A NEW PATH OR WHATEVER ELSE MIGHT CHANGE

function activate() {
  View.initialize(emitter, true); // visible = true
  fileSearch = new FileSearch(paths); // put in a function so you can change the paths dynamically
  subscriptions.add(atom.workspace.observeTextEditors(
    _.partial(addTextEditorObserver, View._display)
  ));
}

function deactivate() {
  crawler && crawler.destroy();
  subscriptions.dispose();
  View.destroy();
}

function destroyCrawler() {
  View.toggleSearchPanel(false);
  crawler && crawler.destroy();
  crawler = null;
}

function stepHighlights(forward) {
  if (forward) {
    crawler.next();
  } else {
    crawler.prev();
  }
}

function makeCrawler(searchType, query, filterRules) {
  // matches is an array of start points
  var matches = fileSearch.searchFiles(searchType, query, filterRules);

  // console.log(matches);

  if (!matches || !matches.length) {
    console.log('No matches found; crawler not initialized.');
    return null;
  }

  // console.log(matches);
  View._matchList.setFileMatches(emitter, matches);
  View.toggleSearchPanel(true);

  return new HighlightCrawler(matches, function inputCallback() {
    View._selectorInput.editor.element.focus();
  });

}

function updateSearch(data, forward) {
  if (crawler) {
    stepHighlights(forward);
    return crawler;
  }

  var queries = View.getQueries();
  var filterRules = Filter.createFilterRules(queries.filter);

  crawler = makeCrawler(data.type, queries.selector, filterRules);
  return crawler;
}
