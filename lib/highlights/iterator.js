
function getIndex() {
  return this.currentIndex;
}

function setIndex(index) {
  return this.currentIndex = index;
}

function getNewIndex(increment, min, max, wrap) {
  // console.log(arguments);
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
  console.log(arguments);
  console.log({
    newIndex: newIndex,
    overflow: overflow
  });

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
