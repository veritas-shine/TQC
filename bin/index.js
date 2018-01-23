#!/usr/bin/env node

if (process.env.NODE_ENV !== 'production') {
  if (!require('piping')({
        hook: true,
        ignore: /(\/\.|~$|\.json$)/i
      })) {
    return;
  }
}

try {
  require('fs').mkdirSync('./logs');
} catch (e) {
  if (e.code != 'EEXIST') {
    console.error("Could not set up log directory, error was: ", e);
    process.exit(1);
  }
}
require('../server.babel'); // babel registration (runtime transpilation for node)
require('../src/index');
