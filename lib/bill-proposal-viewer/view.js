/**
 * Module dependencies.
 */

var BillProposal = require('bill-proposal');
var citizen = require('citizen');
var laws = require('laws');
var o = require('dom');
var Progress = require('progress');
var template = require('./template');
var View = require('view');
var Carousel = require('carousel-slide');

function BillProposalViewer(lawId) {
  View.call(this, template);

  this.lawId = lawId;
  this.progressContainer = this.find('div.progress-container');
  this.progress = new Progress('#00708f');
  this.progressContainer.append(this.progress.element);
  this.updateProgress(1, 20);

  this.onlawsload = this.onlawsload.bind(this);
  this.refresh = this.refresh.bind(this);
  this.reload = this.reload.bind(this);
  this.add = this.add.bind(this);

  laws.on('loaded', this.onlawsload);

  //TODO: make all this dependent on `bus` when making views reactive in #284
  // citizen.on('loaded', this.refresh);
  // citizen.on('unloaded', this.refresh);

  this.refresh();
}

/**
 * Inherit from View
 */

View(BillProposalViewer);

BillProposalViewer.prototype.updateProgress = function (laws, totalLaws) {
  var percent = Math.floor(laws / totalLaws * 100);
  this.progress.setProgress(percent);
  this.progress.setCaption(laws + '/' + totalLaws);
}

BillProposalViewer.prototype.next = function() {
  this.carousel.next();
  this.scroll();
  this.pushState();
};

BillProposalViewer.prototype.prev = function() {
  this.carousel.prev();
  this.scroll();
  this.pushState();
};

BillProposalViewer.prototype.scroll = function() {
  this.find('h2.subtitle')[0].scrollIntoView();
};

BillProposalViewer.prototype.pushState = function() {
  var el = this.find('.bill-proposal.carousel-visible');
  if (el.length) {
    var id = el.attr('data-id');
    window.history.pushState('', '', '/law/' + id);
  }
};

BillProposalViewer.prototype.onlawsload = function() {
  this.refresh();
};

BillProposalViewer.prototype.refresh = function() {
  laws.ready(this.reload);
};

BillProposalViewer.prototype.reload = function() {

  var bills = randomize(laws.get());
  var selected = bills[0];

  // sort & select properly if user is logged in
  if (citizen.logged()) {
    bills = sortForCitizen(bills);
    selected = firstUnvoted(bills);
  }

  this.container = this.find('.bill-proposal-container');
  this.container.empty();
  bills.forEach(this.add);
  this.carousel = new Carousel(this.container[0]);
  var el = this.find('.bill-proposal[data-id="' + this.lawId + '"');
  if (el.length) {
    this.carousel._show(el[0]);
  }

  //TODO: build every dom element for each law

  // container.set(selected)
};

function sortForCitizen (arr) {
  //TODO: sort
  return arr;
}

function firstUnvoted (arr) {
  //TODO: select first one not voted
  return arr[0];
}

function randomize (arr) {
  if (!arr) return [];

  return arr.sort(randomsort);

  function randomsort (a, b) {
    return Math.random() > .5 ? -1 : 1;
  }
}

BillProposalViewer.prototype.add = function(law) {
  var billProposal = new BillProposal(law);
  billProposal.appendTo(this.container);
  billProposal.on('next', this.bound('next'));
  billProposal.on('prev', this.bound('prev'));
};



BillProposalViewer.prototype.updateProgress = function (laws, totalLaws) {
  var percent = Math.floor(laws / totalLaws * 100);
  this.progress.setProgress(percent);
  this.progress.setCaption(laws + '/' + totalLaws);
};

module.exports = BillProposalViewer;