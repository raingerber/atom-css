
var _ = require('lodash');

var Highlight = require('./highlight');

// a list of all the decorations/highlights in a particular TextEditor
// all of them are styled in the same way (using the 'stylus-search-match' class)
// one of them at a time can be set to active, which can be styled differently

function Highlights(editor, rangesData) {
  this.editor = editor;
  this.highlights = [];
  this.rangesData = rangesData || []; // rename variable
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

Highlights.prototype.populate = function populate() {
  this.setIndex(0);
  this.highlights = this.rangesData.map(_.partial(createHighlight, this.editor));
  this.toggleFocus(true);
  return this;
};

Highlights.prototype.clear = function clear() {
  _.forEach(this.highlights, 'clear');
  this.highlights = [];
  this.setIndex(-1);
};

require('./iterator').addIteratorMethods(Highlights.prototype);

module.exports = Highlights;

////////////////////////////////////////////////////////////////////////////////

function createHighlight(editor, rangeData) {
  return new Highlight(editor, rangeData.range, rangeData.text);
}
