// use this to add support for other preprocessors
// the file being required should export a single render function
// render(inputPath, outputPath, content, createMappings)
// createMappings(css, sourcemap) is a callback

var renderers = {
  'styl': require('./stylus')
};

function getRenderFnUsingPath(path) {
  return getRenderFnUsingExtension(getExtension(path));
}

function getRenderFnUsingExtension(extension) {
  return renderers[extension] || dummyRender;
}

function dummyRender(inputPath, outputPath, content, createMappings) {
  console.log('Using the dummy render function!');
  createMappings('', null); // create a new, empty sourcemap
}

// move this elsewhere
// can be used to make a getBasePath fn too
function getExtension(sourcePath) {
  if (!sourcePath) {
    return '';
  }

  var nextIndex = sourcePath.lastIndexOf('.') + 1;
  if (0 < nextIndex && nextIndex < sourcePath.length) {
    return sourcePath.substring(nextIndex);
  }

  return '';
}

module.exports.supportedExtensions = Object.keys(renderers);
module.exports.getRenderFnUsingPath = getRenderFnUsingPath;
