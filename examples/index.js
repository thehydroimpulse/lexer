/**
 * Module dependencies.
 */

var Lexer = require('..');

/**
 * Create a new token.
 */

var lexer = Lexer.init()
  .def('comma', /^[,]$/)
  .string(',')
  .start();

while(!lexer.eof) {
  lexer.next();
  if (!lexer.eof) {
    console.log(lexer.token);
  }
}