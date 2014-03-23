#!/usr/bin/node
var wp2ghost = require('../lib/wp2ghost.js');

process.stdout.write("");
var when = wp2ghost.fromFile(process.argv.slice(-1)[0]);
when.then(function(data) {
  process.stdout.write(JSON.stringify(data));
}, function(err) {
  process.stderr.write(JSON.stringify(err));
});
