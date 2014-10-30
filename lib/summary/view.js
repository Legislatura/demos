var config = require('config');
var t = require('t');
var indexOf = require('indexof');
var View = require('view');
var template = require('./template');

function BillSummary(laws) {
  var baseUrl = config.protocol + "://" + config.host + (config.publicPort ? (":" + config.publicPort) : "");
  View.call(this, template, {
    baseUrl: baseUrl,
    laws: laws,
    t: t,
    indexOf: indexOf
  });
}

View(BillSummary);

module.exports = BillSummary;