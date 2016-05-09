var writeCSS = require('./write-css').writeCSS;
var sass = require('node-sass');

function render(inputPath, outputPath, content, createMappings) {
  // use the sass api, and have this final callback:
  // createMappings(css, sourcemap)
}

module.exports = render;
