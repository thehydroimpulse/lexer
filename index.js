/**
 * Module Dependencies
 */

var Token = require('./lib/token');

/**
 * Module Export
 */

exports = module.exports = Lexer;

/**
 * Expose `Token`
 */

exports.Token = Token;

/**
 * Lexer Function
 *
 * @public
 */

 function Lexer() {
  this.str = null;
  this.index = 0;
  this.length = 1;
  this.tokens = [];
  this.arrayPosition = -1;
  this.charPosition = 0;
  this.lineNumber = 0;
  this.defs = {};

  // Current Token
  this.token = null;

  // End of File/Line
  this.eof = false;
  this.bof = true;
}

/**
 * Begin the Lexer to start propagating tokens.
 */

 Lexer.prototype.start = function() {

  while(this.index + this.length <= this.str.length) {

    var previous  = this.str.substr(this.index - 1, this.length)
      , current   = this.str.substr(this.index, this.length)
      , next      = this.str.substr(this.index + 1, this.length)

      , smallChar = this.str.substr(this.index, this.length)
      , bigChar   = this.str.substr(this.index, this.length + 1);

    if (previous == '' || this.index - 1 === -1) {
      //this.bof = true;
      previous = null;
    }

    if (next == '') {
      //this.eof = true;
      next = null;
    }

    for (var def in this.defs) {
      var obj = this.defs[def];

      var smallMatch = smallChar.match(obj.regexp) !== null;
      var bigMatch   = bigChar.match(obj.regexp) !== null;

      if (smallMatch && (! bigMatch || smallChar == bigChar)) {
        this.index += this.length;
        this.length = 0;
        this.tokens.push(new Token(def, smallChar));
        break;
      }

    }
    this.length++;
  }

  return this;
};

/**
 * Move to the next token or the token specified by the index
 *
 * @param {Integer} count Token Index
 */

 Lexer.prototype.next = function(count) {
  if (! count) count = 1;
  while (count-- > 0) {
    this.arrayPosition++;
    if ( this.arrayPosition < this.tokens.length) {
      this.token = this.tokens[this.arrayPosition];
      this.bof = false;
      this.char_position += this.token.value.length;
      if (this.defs[this.token.type].skip) {
        if (this.token.type == 'newline') {
          this.LineNumber++;
          this.charPosition = 0;
        }
        this.next();
      }
    } else {
      this.eof = true;
      this.token = new Token('EOF', null);
    }
  }
}

Lexer.prototype.lookahead = function(l, count) {
  if (count == undefined) count = 1;
  if (!l) l = 1;
  var token, lexeme, eof = false, bof = false;
  while (count-- > 0) {
    var pos = this.arrayPosition + l;
    if (pos < this.tokens.length) {
      token = this.tokens[pos];
      if (this.defs[token].skip) {
        return this.lookahead(l + 1);
      }
    } else {
      token = 'EOF';
      break;
    }
  }

  return new Token(token.type, token.value, eof, bof);
};

Lexer.prototype.lookbehind = function(l, count) {
  if (count == undefined) count = 1;
  if (!l) l = -1;
  var token, lexeme, eof = false, bof = false;

  while (count-- > 0) {
    var pos = this.arrayPosition - l - 1;
    if (pos-- > 0) {
      token = this.tokens[pos];
      //lexeme = this.lexemes[pos];
      eof = false;
      if (this.defs[token.type].skip) {
        this.lookbehind(l - 1);
      }
    } else {
      token = new Token('EOF', null);
      break;
    }
  }


  return token;
};

Lexer.prototype.prev = function(count) {
  if (count == undefined) count = 1;
  while (count-- > 0) {
    this.arrayPosition--;
    if (this.arrayPosition-- > 0) {
      this.token = this.tokens[this.arrayPosition];
      this.lexeme = this.lexemes[this.arrayPosition];
      this.eof = false;
      this.char_position -= this.lexeme.length;
      if (this.defs[this.token].skip) {
        if (this.token == 'newline') {
          this.line_number--;
          this.char_position = 0;
        }
        this.prev();
      }
    } else {
      this.bof = true;
      this.token = new Token('BOF', null);
      break;
    }
  }
};

/**
 * Specify an input string to perform the lexing against
 */

 Lexer.prototype.string = function(string) {
  if (!string) throw new Error("Invalid String.");
  this.str = string;
  return this;
};

/**
 * Add a new definition
 *
 * @param {String} name Definition Name
 * @param {Regex} regex Regular Expression
 * @param {Boolean} skip If the token should be skipped or not.
 */

 Lexer.prototype.def = function(name, regex, skip) {
  if (arguments.length === 2) {
    skip = false;
  }

  if (!name && !regex) throw new Error("Invalid Definition");

  this.defs[name] = { regexp: regex, skip: skip };
  return this;
}

/**
 * Initialize a new Lexer instance
 *
 * @return {Lexer}
 */

 Lexer.init = function() {
  return new Lexer();
}