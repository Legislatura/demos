/**
 * Module dependencies.
 */

var bus = require('bus');
var citizen = require('citizen');
var View = require('view');
var laws = require('laws');
var template = require('./bill-proposal');
var page = require('page');
var o = require('dom');
var request = require('request');
var t = require('t');
var Progress = require('progress');
var log = require('debug')('democracyos:bill-proposal-demo');

function BillProposal(law) {
  this.law = law;
  this.previousLaw = laws.prev(law);
  this.nextLaw = laws.next(law);
  View.call(this, template, {law: law, previousLaw: this.previousLaw, nextLaw: this.nextLaw});
  this.progressEl = o('div.progress-container', this.el[0]);
  this.progress = new Progress('#00708f'); // The parameter is the color of the bar
  this.progressEl.els[0].appendChild(this.progress.element);

  var current = laws.index(law) + 1;
  var total = laws.items.length;
  this.updateProgress(current, total);
}

View(BillProposal);

/**
 * Turn on event bindings
 */

BillProposal.prototype.switchOn = function() {
  this.bind('click', '.next', this.bound('next'));
  this.bind('click', '.prev', this.bound('prev'));
  this.bind('click', '.score', this.bound('score'))
  this.bind('click', '.change-score', this.bound('changescore'))
  this.on('score', this.bound('onscore'));
}

/**
 * Turn off event bindings
 */

BillProposal.prototype.switchOff = function() {
  this.unbind('click', '.next', this.bound('next'));
  this.unbind('click', '.prev', this.bound('prev'));
  this.unbind('click', '.score', this.bound('score'));
  this.off();
}

BillProposal.prototype.next = function() {
  page('/law/:id'.replace(':id', this.nextLaw.id));
};

BillProposal.prototype.prev = function() {
  page('/law/:id'.replace(':id', this.previousLaw.id));
};

BillProposal.prototype.score = function(ev) {
  ev.preventDefault();

  var target = o(ev.delegateTarget);

  if (target.hasClass('score-nothing')) {
    value = 'nothing';
  } else if (target.hasClass('score-little')) {
    value = 'little';
  } else if (target.hasClass('score-somewhat')) {
    value = 'somewhat';
  } else if (target.hasClass('score-very')) {
    value = 'very';
  }

  function callback(err, res) {
    if (err || !res.ok) return log('Failed cast %s for %s with error: %j', value, this.law.id, err || res.error);
    bus.emit('score', this.law.id, value);
    this.emit('score', value);
  }

  if (citizen.id) {
    log('casting score %s for %s', value, this.law.id);
    request.post('/api/law/:id/score'.replace(':id', this.law.id))
      .send({ value: value })
      .end(callback.bind(this));
  }
};

BillProposal.prototype.onscore = function(value) {
  var text = t('scoring.value.' + value);
  var scored = o('.scored', this.el[0]);
  scored.removeClass('hide');
  var title = o('h2', scored.els[0]);
  o('.scores', this.el[0]).addClass('hide');
  title.html(text);
}

BillProposal.prototype.changescore = function() {
  o('.scored', this.el[0]).addClass('hide');
  o('.scores', this.el[0]).removeClass('hide');
};

BillProposal.prototype.updateProgress = function (laws, totalLaws) {
  var percent = Math.floor(laws / totalLaws * 100);
  this.progress.setProgress(percent);
  this.progress.setCaption(laws + '/' + totalLaws);
};

module.exports = BillProposal;