var Stylus = require('stylus');
var writeCSS = require('./write-css').writeCSS;

function render(inputPath, outputPath, content, createMappings) {

  // console.log(inputPath);
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

    writeCSS(outputPath, css);
    createMappings(css, stylus.sourcemap);
  });
}

module.exports = render;
