# Lexer

A simple, yet powerful Lexer/Tokenizer. It comes with an increadibly simple API that matches token using basic strings or Regexs.

## Install:

NPM:

```bash
npm install hydro-lexer
```

## Usage:

Require it:

```js
var Lexer = require('hydro-lexer');
```

Create a new lexer instance.

```js
var lexer = Lexer.init();
```

Create some rules/definition:

```js
var lexer = Lexer.init()
  .def('string', new RegExp("^\"[^\"]*\"|\'[^\']*\'$"))
  .def('whitespace', /^[\t \n]$/, true) // Skip these tokens.
  .def('pipe', /^[\|]$/)
  .string('str |') // Input
  .start() // Operate on the input.
```

Let's read the tokens:

```js
// Make sure we aren't at the end of the token stream.
while (!lexer.eof) {
  
  // Get the next token:
  lexer.next();

  // Read the current token:
  lexer.token;
}
```


## License

The MIT License (MIT)

Copyright (c) 2013 Daniel Fagnan

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
