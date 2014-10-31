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

function BillProposalViewer() {
  View.call(this, template);

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
  page('/law/:id'.replace(':id', this.nextLaw.id));
  //TODO: set next;
};

BillProposalViewer.prototype.prev = function() {
  page('/law/:id'.replace(':id', this.previousLaw.id));
  //TODO: set previous;
};

BillProposalViewer.prototype.onlawsload = function() {
  this.refresh();
};

BillProposalViewer.prototype.refresh = function() {
  laws.ready(this.reload);
};

BillProposalViewer.prototype.reload = function() {
  //TODO: sort if citizen is loaded
  var sortedLaws = laws.get();
  var selected = sortedLaws[0];

  this.container = this.find('.bill-proposal-container');
  this.container.empty();
  sortedLaws.forEach(this.add);
  c = this.carousel = new Carousel(this.container[0]);

  //TODO: build every dom element for each law

  // container.set(selected)
};

BillProposalViewer.prototype.add = function(law) {
  var billProposal = new BillProposal(law);
  billProposal.appendTo(this.container);
};

module.exports = BillProposalViewer;