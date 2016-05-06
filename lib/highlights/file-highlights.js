
var _ = require('lodash');

var Highlight = require('./highlight');

// a list of all the decorations/highlights in a particular TextEditor
// all of them are styled in the same way (using the 'stylus-search-match' class)
// one of them at a time can be set to active, which can be styled differently

function Highlights(editor, selections) {
  // console.error('CREATING');
  // console.error(selections);
  this.editor = editor;
  this.highlights = [];
  this.selections = selections || [];
}

Highlights.prototype.currentHighlight = function currentHighlight() {
  var index = this.getIndex();
  return this.getLength() ? this.highlights[index] : null;
};

Highlights.prototype.prev = function prev() {
  return this.incrementFocus(-1);
};

Highlights.prototype.next = function next() {
  return this.incrementFocus(1);
};

Highlights.prototype.getLength = function getLength() {
  return this.highlights.length;
};

Highlights.prototype.incrementFocus = function incrementFocus(increment) {
  // console.log('incrementing focus');
  var max = this.getLength() - 1;
  var data = this.getNewIndex(increment, 0, max, true);
  var didNotOverflow = !data.overflow;
  this.toggleFocus(false);
  this.setIndex(data.newIndex);
  if (didNotOverflow) {
    this.toggleFocus(true);
  }

  // return didNotOverflow;
  return data.overflow;
};

Highlights.prototype.toggleFocus = function toggleFocus(state) {
  return this.setFocus(this.getIndex(), state);
};

Highlights.prototype.setFocus = function setFocus(index, state) {
  if (this.getLength()) {
    return this.highlights[index].focus(state);
  }
};

Highlights.prototype.populate = function populate(startIndex) {
  var editor = this.editor;
  var i = _.isFinite(startIndex) ? startIndex : 0; // make sure it's within bounds
  this.setIndex(i);
  // console.log(this.selections);
  // this.highlights = this.selections.map(_.partial(createHighlight, this.editor));
  this.highlights = this.selections.map(function(fileSelection) {
    return createHighlight(editor, fileSelection);
  });

  this.toggleFocus(true);
  return this;
};

Highlights.prototype.clear = function clear() {
  // console.error('xxx');
  _.forEach(this.highlights, _.method('clear'));
  this.highlights = [];
  this.setIndex(-1);
};

require('./iterator').addIteratorMethods(Highlights.prototype);

module.exports = Highlights;

////////////////////////////////////////////////////////////////////////////////

function createHighlight(editor, fileSelection) {
  // console.log(editor, fileSelection.range, fileSelection.text);
  return new Highlight(editor, fileSelection.range, fileSelection.text);
}
