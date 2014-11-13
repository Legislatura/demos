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

  function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  };

  var all = laws.phaseOne().sort(byscore);
  ctx.winners = all.slice(0, 3);
  ctx.nexttime = shuffle(all.slice(3));

  next();
}