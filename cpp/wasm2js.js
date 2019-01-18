#!/usr/bin/env node

// Utility script to convert a Web Assembly binary file (.wasm) to a hardcoded javascript declaration. Emscripten can do
// this by default (using -s SINGLE_FILE), but it encodes it in a base64 string, which (although more compact) takes a
// while to decode,especially since we don't have native decoder support and have to use a polyfill instead.

let fs = require('fs');

let inputFilename = process.argv[2]
let outputFilename = process.argv[3]

let data = fs.readFileSync(inputFilename);
let asString = JSON.stringify(Array.from(data));

let fileContents = 'export var wasmLoader = function() { return new Uint8Array(' + asString + ') };';

fs.writeFileSync(outputFilename, fileContents);
