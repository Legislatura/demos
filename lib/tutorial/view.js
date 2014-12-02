var o = require('dom');
var config = require('config');
var indexOf = require('indexof');
var View = require('view');
var request = require('request');
var template = require('./template');
var citizen = require('citizen');
var render = require('render');
var page = require('page');

function Tutorial() {
  var baseUrl = config.protocol + "://" + config.host + (config.publicPort ? (":" + config.publicPort) : "");
  View.call(this, template, {
    baseUrl: baseUrl,
    indexOf: indexOf
  });

  this.el = render.dom(template);
  this.skip = o('.skip', this.el);
  this.switchOn();

  citizen.ready(function() {
    if (!citizen.sawTutorial) {
      request
      .post('api/citizen/tutorial')
      .end(function (err, res) {
        if (err) return console.log('Found error %o', err || res.error);
        console.log('res: ' + res.toString());
        citizen.sawTutorial = true;
      });
    }
  });
}

View(Tutorial);

Tutorial.prototype.switchOn = function () {
  this.skip.on('click', this.onskip);
}

Tutorial.prototype.onskip = function() {
  setTimeout(function () {
    page.replace('/');
  }, 0);
}

module.exports = Tutorial;