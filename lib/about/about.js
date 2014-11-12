/**
 * Module dependencies.
 */

var About = require('./view');
var bus = require('bus');
var log = require('debug')('democracyos:about:page');
var o = require('dom');
var page = require('page');
var t = require('t');
var title = require('title');

page('/acerca-de', function(ctx, next) {
  var about = new About();

  o(document.body).addClass('about');

  title(t('header.about'));

  about.replace('#content .content-container');
});