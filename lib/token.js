/**
 * Module Export
 */

exports = module.exports = Token;

/**
 * Token Constructor
 */

function Token(type, value) {
  this.value = value;
  this.type   = type;
}

/**
 * ToString()
 */

Token.prototype.toString = function() {
  return this.type;
};