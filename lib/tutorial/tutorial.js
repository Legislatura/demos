/**
 * Module dependencies.
 */

var citizen = require('citizen');
var o = require('dom');
var page = require('page');
var t = require('t');
var title = require('title');
var Tutorial = require('./view');

page('/tutorial', function(ctx, next) {
  var summary = new Tutorial();

  title(t('tutorial.title'));

  summary.replace('#content .content-container');

  o(document.body).addClass('tutorial');
});