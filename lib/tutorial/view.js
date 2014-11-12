var o = require('dom');
var config = require('config');
var t = require('t');
var indexOf = require('indexof');
var View = require('view');
var template = require('./template');

function Tutorial() {
  var baseUrl = config.protocol + "://" + config.host + (config.publicPort ? (":" + config.publicPort) : "");
  View.call(this, template, {
    baseUrl: baseUrl,
    t: t,
    indexOf: indexOf
  });
}

View(Tutorial);

module.exports = Tutorial;