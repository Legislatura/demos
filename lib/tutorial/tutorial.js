/**
 * Module dependencies.
 */

var citizen = require('citizen');
var o = require('dom');
var page = require('page');
var t = require('t');
var title = require('title');
var Tutorial = require('./view');
var cookie = require('cookie');

page('/tutorial', function(ctx, next) {
  cookie('sawTutorial', true);

  var summary = new Tutorial();

  title(t('tutorial.title'));

  summary.replace('#content .content-container');

  o(document.body).addClass('tutorial');
});