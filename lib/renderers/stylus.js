var fs = require('fs');
var Stylus = require('stylus');

function render(inputPath, outputPath, content, createMappings) {

  var stylus =
    Stylus(content)
      .set('filename', inputPath)
      .set('sourcemap', {
        comment: false
      });

  stylus.render(function onRender(err, css) {
    if (err) {
      throw err;
    }

    writeCSSToFile(outputPath, css);
    createMappings(css, stylus.sourcemap);
  });
}

// move this to another file (all renderers will need this)
// check if it's a valid path, if the file exists already, etc.
function writeCSSToFile(path, css) {
  if (path) {
    // make it async

    console.log('writing', arguments);
    fs.writeFileSync(path, css);
  }
}

module.exports = render;
