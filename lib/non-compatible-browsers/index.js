/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express();
var parse = require('ua-parser').parse;

var path = require('path');
var resolve = path.resolve;
var html = resolve(__dirname, 'non-compatible.jade');

app.all('*', function (req, res, next) {
  var ua = parse(req.headers['user-agent']);
  var family = ua.family;
  var version = ua.major;
  var incompatible = family === 'IE' && version <= 8;
  return incompatible ? res.render(html) : next();
});