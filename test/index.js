var Lexer = require('..');
var Token = Lexer.Token;
var assert = require('assert');

describe('lexer', function() {

  it('should create a new lexer', function() {
    var lexer = Lexer.init()
    .def('random', /^$/)
    .string(',');

    assert(lexer instanceof Lexer);
    assert(lexer.str === ',');
    assert('object' === typeof lexer.defs['random'])
  });

  it('should use lexer API', function() {
    var lexer = Lexer.init()
    .def('comma', /^[,]$/)
    .string(',')
    .start();

    while (!lexer.eof) {
      lexer.next();
      if (!lexer.eof) {
        assert(lexer.token.value === ",");
      }

    }

  });

  it('should skip whitespace', function() {
    var lexer = Lexer.init()
    .def('whitespace', /^[\t \n]$/, true)
    .def('letter', /^[A-Za-z]$/)
    .string('h h')
    .start();

    var arr = [];
    while (!lexer.eof) {
      lexer.next();
      if (!lexer.eof)
        arr.push(lexer.token);
    }

    assert(arr[0].type === 'letter' && arr[1].type === 'letter');
  });

  it('should not skip an identifier', function() {
    var lexer = Lexer.init()
    .def('squareleftbracket', /^[\[]$/)
    .string('[')
    .start();

    while (!lexer.eof) {
      lexer.next();
      if (!lexer.eof)
        assert(lexer.token.value === '[');
    }
  });

  it('should process two tokens', function() {

    var lexer = Lexer.init()
    .def('squareleftbracket', /^[\[]$/)
    .def('squarerightbracket', /^[\]]$/)
    .string(']')
    .start();

    while (!lexer.eof) {
      lexer.next();
      if (!lexer.eof)
        assert(lexer.token.value === ']');
    }

  });

  it('should process parentheses', function() {

    var lexer = Lexer.init()
    .def('lp', /^\($/)
      .def('rp', /^\)$/)
    .string('()')
    .start();

    while (!lexer.eof) {
      lexer.next();
    }

    for (var i = 0; i < lexer.tokens.length; i++) {
      assert(lexer.tokens[i] instanceof Token);
    }
  });

  it('should lex two tokens and skip the whitespace in between them', function() {

    var lexer = Lexer.init()
    .def('string', new RegExp("^\"[^\"]*\"|\'[^\']*\'$"))
    .def('whitespace', /^[\t \n]$/, true)
    .def('pipe', /^[\|]$/)
    .string('str |')
    .start()

    while (!lexer.eof) {
      lexer.next();
    }

    assert(lexer.tokens = ['string', 'rp', 'EOF']);
  });

});