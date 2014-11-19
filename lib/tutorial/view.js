var o = require('dom');
var config = require('config');
var indexOf = require('indexof');
var View = require('view');
var request = require('request');
var template = require('./template');
var citizen = require('citizen');
var carousel = require('carousel-slide');
var render = require('render');
var page = require('page');

function Tutorial() {
  var baseUrl = config.protocol + "://" + config.host + (config.publicPort ? (":" + config.publicPort) : "");
  View.call(this, template, {
    baseUrl: baseUrl,
    indexOf: indexOf
  });

  this.el = render.dom(template);
  this.skip = o('a.skip', this.el);
  var carouselEl = o('.carousel', this.el);
  this.carousel = carousel(carouselEl.els[0]);
  this.prevEl = o('a.btn-prev', this.el)
  this.nextEl = o('a.btn-next', this.el)

  this.switchOn();

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

Tutorial.prototype.switchOn = function () {
  window.onkeyup = onKeyUp.bind(this);
  this.prevEl.on('click', prev.bind(this));
  this.nextEl.on('click', next.bind(this));
  this.skip.on('click', onSkip.bind(this));
}

function onKeyUp(e) {
  if (39 === e.which) this.carousel.next();
  else if (37 === e.which) this.carousel.prev();
}

function next() {
  this.carousel.next();
}

function prev() {
  this.carousel.prev();
}

function onSkip() {
  setTimeout(function () {
    page.replace('/');
    }, 0);
}

module.exports = Tutorial;