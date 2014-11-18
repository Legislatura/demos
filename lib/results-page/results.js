/**
 * Module dependencies.
 */

var citizen = require('citizen');
var results = require('laws-results');
var o = require('dom');
var page = require('page');
var t = require('t');
var title = require('title');
var Results = require('./view');

page('/resultados', results.middleware, function(ctx, next) {
  var summary = new Results(results.winners, results.losers);

  title(t('summary.title'));

  summary.replace('#content .content-container');

  o(document.body).addClass('results');
});