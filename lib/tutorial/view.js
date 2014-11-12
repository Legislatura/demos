var o = require('dom');
var config = require('config');
var indexOf = require('indexof');
var View = require('view');
var request = require('request');
var template = require('./template');
var citizen = require('citizen');

function Tutorial() {
  var baseUrl = config.protocol + "://" + config.host + (config.publicPort ? (":" + config.publicPort) : "");
  View.call(this, template, {
    baseUrl: baseUrl,
    indexOf: indexOf
  });

  citizen.ready(function() {
    if (!citizen.sawTutorial) {
      request
      .post('api/citizen/tutorial')
      .end(function (err, res) {
        if (err) return console.log('Found error %o', err || res.error);
        console.log('res: ' + res.toString());
      });
    }
  });
}

View(Tutorial);

module.exports = Tutorial;