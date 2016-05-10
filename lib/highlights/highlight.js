
var markerParams = { invalidate: 'never' };

function Highlight(editor, range, text) {
  this.range = range;
  this.editor = editor;
  this.text = text || '';
  this.marker = editor.markBufferRange(range, markerParams);
  this.decoration = editor.decorateMarker(this.marker, getDecorationProps(false));
}

Highlight.prototype.focus = focus;
Highlight.prototype.clear = clear;

function focus(active) {
  if (active) {
    // console.log(this.range.start);
    this.editor.scrollToBufferPosition(this.range.start);
  }

  return this.decoration.setProperties(getDecorationProps(active));
}

function getDecorationProps(active) {
  return { type: 'highlight', class: getClass(active) };
}

function getClass(active) {
  return active ? 'stylus-search-match-active' : 'stylus-search-match';
}

function clear() {
  this.marker.destroy();
}

module.exports = Highlight;
