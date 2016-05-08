function writeCSS(path, css) {
  if (path) {
    // console.log('writing', arguments);
    fs.writeFileSync(path, css || ''); // make it async
  }
}

module.exports.writeCSS = writeCSS;
