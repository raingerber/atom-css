
function getIndex() {
  return this.currentIndex;
}

function setIndex(index) {
  return this.currentIndex = index;
}

function getNewIndex(increment, min, max, wrap) {
  var overflow = false;
  var newIndex = this.currentIndex + increment;
  if (newIndex > max) {
    overflow = true;
    newIndex = wrap ? min : max;
  }
  if (newIndex < min) {
    overflow = true;
    newIndex = wrap ? max : min;
  }
  return {
    newIndex: newIndex,
    overflow: overflow
  };
}

function addIteratorMethods(obj) {
  obj.getIndex = getIndex;
  obj.setIndex = setIndex;
  obj.getNewIndex = getNewIndex;
}

module.exports.addIteratorMethods = addIteratorMethods;
