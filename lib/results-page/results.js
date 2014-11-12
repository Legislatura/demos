/**
 * Module dependencies.
 */

var citizen = require('citizen');
var laws = require('laws');
var o = require('dom');
var page = require('page');
var t = require('t');
var title = require('title');
var Results = require('./view');

page('/resultados', laws.middleware, load, function(ctx, next) {
  var summary = new Results(ctx.winners, ctx.nexttime);

  title(t('summary.title'));

  summary.replace('#content .content-container');

  o(document.body).addClass('results');
});

function load(ctx, next) {
  function byscore(a, b) {
    return a.totalScore >= b.totalScore ? -1 : 1;
  }

  var all = laws.phaseOne().sort(byscore);
  ctx.winners = all.slice(0, 3);
  ctx.nexttime = all.slice(3);

  next();
}