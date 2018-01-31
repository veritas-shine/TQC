#!/usr/bin/bash
NODE_PATH=./src mocha --require babel-core/register --require babel-polyfill --reporter spec src/lib/test/address.js
