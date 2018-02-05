

const _ = require('lodash');

function format(message, args) {
  return message
    .replace('{0}', args[0])
    .replace('{1}', args[1])
    .replace('{2}', args[2]);
}
const traverseNode = function (parent, errorDefinition) {
  const NodeError = function () {
    if (_.isString(errorDefinition.message)) {
      this.message = format(errorDefinition.message, arguments);
    } else if (_.isFunction(errorDefinition.message)) {
      this.message = errorDefinition.message.apply(null, arguments);
    } else {
      throw new Error(`Invalid error definition for ${errorDefinition.name}`);
    }
    this.stack = `${this.message}\n${(new Error()).stack}`;
  };
  NodeError.prototype = Object.create(parent.prototype);
  NodeError.prototype.name = parent.prototype.name + errorDefinition.name;
  parent[errorDefinition.name] = NodeError;
  if (errorDefinition.errors) {
    childDefinitions(NodeError, errorDefinition.errors);
  }
  return NodeError;
};

/* jshint latedef: false */
var childDefinitions = function (parent, childDefinitions) {
  _.each(childDefinitions, (childDefinition) => {
    traverseNode(parent, childDefinition);
  });
};
/* jshint latedef: true */

const traverseRoot = function (parent, errorsDefinition) {
  childDefinitions(parent, errorsDefinition);
  return parent;
};


const pqccore = {};
pqccore.Error = function () {
  this.message = 'Internal error';
  this.stack = `${this.message}\n${(new Error()).stack}`;
};
pqccore.Error.prototype = Object.create(Error.prototype);
pqccore.Error.prototype.name = 'pqccore.Error';


const data = require('./spec');

traverseRoot(pqccore.Error, data);

module.exports = pqccore.Error;

module.exports.extend = function (spec) {
  return traverseNode(pqccore.Error, spec);
};
