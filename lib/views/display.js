var element = document.createElement('div');

element.classList.add('atom-stylus-display');

function text(_text) {
  if (element) {
    element.innerHTML = _text;
  }
}

function clear() {
  text('');
}

module.exports.element = element;
module.exports.text = text;
module.exports.clear = clear;
