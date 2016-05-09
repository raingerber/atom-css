var writeCSS = require('./write-css').writeCSS;
var less = require('less');

function render(inputPath, outputPath, content, createMappings) {
  // use the less API, and have this final callback:
  // createMappings(css, sourcemap)
}

module.exports = render;
