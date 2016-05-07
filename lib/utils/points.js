function sourceLineToAtomLine(line) {
  return line - 1;
}

function atomLineToSourceLine(line) {
  return line + 1;
}

// function sourcePointToAtomPoint(point) {
//   if (!point) {
//     console.log('NO POINT');
//   }
//
//   point.line = sourceLineToAtomLine(point.row);
//   point.column = 0; // WHY ALWAYS SETTING TO ZERO?
//   return point;
// }

function atomPointToSourcePoint(point, inputPath) {
  if (!point) {
    console.log('NO POINT');
  }

  point.source = inputPath.slice(1); // why is this????? don't always do it
  point.line = atomLineToSourceLine(point.row); // source lines start from 1, atom lines from 0
  point.column = 0; // WHY ALWAYS SETTING TO ZERO?
  return point;
}

module.exports.sourceLineToAtomLine = sourceLineToAtomLine;
// module.exports.sourcePointToAtomPoint = sourcePointToAtomPoint;
module.exports.atomPointToSourcePoint = atomPointToSourcePoint;
