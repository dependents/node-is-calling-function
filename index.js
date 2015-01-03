var Walker = require('node-source-walk');

/**
 * @param  {String|Object} source - file's string content or its AST
 * @param  {String} functionName
 * @return {Boolean}
 */
module.exports = function(source, functionName) {
  if (!source) { throw new Error('source not given'); }
  if (!functionName) { throw new Error('functionName not given'); }

  var isFileCallingFunction = false;
  var walker = new Walker({
    ecmaVersion: 6
  });

  walker.walk(source, function(node) {
    var isCallExpression = node.type === 'ExpressionStatement' &&
                           node.expression.type === 'CallExpression';

    if (!isCallExpression) { return; }

    var callee = node.expression.callee;

    if (!callee) { return; }

    if (callee.name === functionName ||
        // Object property
        (callee.property && callee.property.name === functionName) ||
        // IIFE
        (callee.id && callee.id.name === functionName)) {
      isFileCallingFunction = true;
      walker.stopWalking();
    }
  });

  return isFileCallingFunction;
};
