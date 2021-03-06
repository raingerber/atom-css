
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
  console.log('incrementing focus');
  // debugger;
  var max = Math.max(0, this.getLength() - 1);

  // if (max <= 1) {
  //   return false;
  // }

  // console.error('MAX:', max, this);
  var data = this.getNewIndex(increment, 0, max, true);

  var didNotOverflow = !data.overflow;
  // console.log('in incrementFocus');
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
  // console.log(index, this.getLength(), this.highlights);
  // typeof index !== 'undefined' &&
  if (index < this.getLength()) {
    return this.highlights[index].focus(state);
  } else {
    console.log('Unable to focus on that index.');
  }
};

Highlights.prototype.populate = function populate(startIndex) {
  var editor = this.editor;
  var i = startIndex * 1; // this was being passed as a string for some reason (?)

  this.highlights = this.selections.map(function(fSel) {
    return createHighlight(editor, fSel);
  });

  if (startIndex >= 0) {
    this.setIndex(i);
    this.toggleFocus(true);
  }

  return this;
};

Highlights.prototype.clear = function clear() {
  _.forEach(this.highlights, _.method('clear'));
  this.highlights = [];
  this.setIndex(-1);
};

require('./iterator').addIteratorMethods(Highlights.prototype);

module.exports = Highlights;

////////////////////////////////////////////////////////////////////////////////

function createHighlight(editor, fSel) {
  // console.log(editor, fSel.range, fSel.text);
  var x = fSel.range.copy();
  x.start.row -= 1
  x.end.row -= 1
  return new Highlight(editor, x, fSel.text);
}
