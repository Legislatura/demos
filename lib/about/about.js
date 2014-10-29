/**
 * Module dependencies.
 */

var About = require('./view');
var bus = require('bus');
var o = require('dom');
var page = require('page');
var log = require('debug')('democracyos:about:page');

page('/about', function(ctx, next) {
  bus.emit('page:render');

  var about = new About();
  about.replace('#content');

  o(document.body).addClass('about');
});