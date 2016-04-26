function MiniEditor(placeholder, className) {
  this.element = document.createElement('atom-text-editor'); // there's an atom function for doing this
  this.element.setAttribute('mini', true);
  this.element.setAttribute('placeholder-text', placeholder || '');
  this.element.classList.add(className || '');
  this.element.classList.add('text-input');
}

MiniEditor.prototype.getText = function getText() {
  var model = this.element.getModel();
  var text = model ? model.getText() : '';
  return text;
};

MiniEditor.prototype.setText = function setText(text) {
  if (this.element) {
    this.element.getModel().setText(text);
  }
};

MiniEditor.prototype.clear = function clear() {
  this.setText('');
};

module.exports = MiniEditor;
