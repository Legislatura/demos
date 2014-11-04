/**
 * Module dependencies.
 */

var BillProposal = require('bill-proposal');
var citizen = require('citizen');
var laws = require('laws');
var o = require('dom');
var page = require('page');
var Progress = require('progress');
var template = require('./template');
var View = require('view');
var Carousel = require('carousel-slide');
var title = require('title');
var array = require('array');

function BillProposalViewer(lawId) {
  View.call(this, template);

  this.lawId = lawId;
  this.bills = [];
  this.selected = null;

  this.progressContainer = this.find('div.progress-container');
  this.progress = new Progress('#00708f');
  this.progressContainer.append(this.progress.element);

  this.onlawsload = this.onlawsload.bind(this);
  this.refresh = this.refresh.bind(this);
  this.reload = this.reload.bind(this);
  this.add = this.add.bind(this);

  laws.on('loaded', this.onlawsload);

  //TODO: make all this dependent on `bus` when making views reactive in #284
  // This should fetch stuff again from backend so voted stuff is updated
  citizen.on('loaded', this.refresh);
  citizen.on('unloaded', this.refresh);

  this.refresh();
}

/**
 * Inherit from View
 */

View(BillProposalViewer);

BillProposalViewer.prototype.switchOff = function() {
  citizen.off('loaded', this.refresh);
  citizen.off('unloaded', this.refresh);
  laws.off('loaded', this.onlawsload);
};

BillProposalViewer.prototype.updateProgress = function (nextIndex) {
  var percent = Math.floor(nextIndex / this.bills.length * 100);
  this.progress.setProgress(percent);
  this.progress.setCaption(nextIndex + '/' + this.bills.length);
  this.currentProgressIndex = nextIndex;
}

BillProposalViewer.prototype.next = function() {
  if (this.carousel.next()) {
    this.pushState();
    this.updateProgress(this.currentProgressIndex + 1);
  }
};

BillProposalViewer.prototype.prev = function() {
  if (this.carousel.prev()) {
    this.pushState();
    this.updateProgress(this.currentProgressIndex - 1);
  }
};

BillProposalViewer.prototype.add = function(bill) {
  var billProposal = new BillProposal(bill);
  billProposal.appendTo(this.container);
  billProposal.on('next', this.bound('next'));
  billProposal.on('prev', this.bound('prev'));
};

BillProposalViewer.prototype.scroll = function() {
  this.find('h2.subtitle')[0].scrollIntoView();
};

BillProposalViewer.prototype.pushState = function() {
  var el = this.find('.bill-proposal.carousel-visible');
  if (el.length) {
    var id = el.attr('data-id');
    window.history.pushState('', '', '/law/' + id);
    var lawTitle = el.find('.law-title');
    if (lawTitle.length) {
      title(lawTitle.html())
    }
  }
};

BillProposalViewer.prototype.onlawsload = function() {
  this.refresh();
};

BillProposalViewer.prototype.refresh = function() {
  laws.ready(this.reload);
};

BillProposalViewer.prototype.reload = function() {

  this.bills = putFirst(randomize(laws.get()), this.lawId);
  this.selected = this.bills[0];

  // sort & select properly if user is logged in
  if (citizen.logged()) {
    this.bills = sortForCitizen(this.bills, citizen.id, this.lawId);

    if (this.lawId) {
      this.selected = array(this.bills).find({ id: this.lawId});
    } else {
      this.selected = notScoredByCitizen(this.bills, citizen.id, this.lawId)[0];
    }

    // Only if user is logged in and nothing remains unvoted
    if (!this.selected) {
      page('/gracias');
      return;
    }

    // just in case everything is voted
    this.selected = this.selected || array(this.bills).last();
  }

  this.container = this.find('.bill-proposal-container');
  this.container.empty();

  this.bills.forEach(this.add);
  this.carousel = new Carousel(this.container[0]);
  var el = this.find('.bill-proposal[data-id="' + this.selected.id + '"');
  if (el.length) {
    this.carousel._show(el[0]);
  }

  // Update progress bar
  this.updateProgress(this.bills.indexOf(this.selected) + 1);
};

// Horrible helper functions

function sortForCitizen (bills, citizenId, billId) {

  return scoredByCitizen(bills, citizenId, billId).concat(notScoredByCitizen(bills, citizenId, billId));
}

function scoredByCitizen(bills, citizenId, billId) {
  var out = array(bills).select(function (l) {
    return ~scorers(l).indexOf(citizenId) != 0;
  }).toArray();

  if (array(out).find({ id: billId })) {
    out = putLast(out, billId);
  }

  return out;
}

function notScoredByCitizen(bills, citizenId, billId) {
  var out = array(bills).select(function (l) {
    return ~scorers(l).indexOf(citizenId) == 0;
  }).toArray();

  if (array(out).find({ id: billId })) {
    out = putFirst(out, billId);
  }

  return out;
}

function scorers (bill) {
  if (!bill) return [];

  var nothings = bill.nothings || [];
  var littles = bill.littles || [];
  var somewhats = bill.somewhats || [];
  var verys = bill.verys || [];

  return nothings.concat(littles).concat(somewhats).concat(verys);
}

function randomize (arr) {
  if (!arr) return [];

  return arr.sort(randomsort);

  function randomsort (a, b) {
    return Math.random() > .5 ? -1 : 1;
  }
}

/**
 * Returns a new `Array` making the `law` with the parameter ID its first element
 */

function putFirst (bills, billId) {
  if (!billId) return bills;

  var arr = array(bills);

  var b = arr.find( { id: billId });

  if (!b) return arr.toArray()

  arr = arr.reject(function (val) {
    return val.id == b.id;
  });

  return [b].concat(arr.toArray());
}

/**
 * Returns a new `Array` making the `law` with the parameter ID its last element
 */

function putLast (bills, billId) {
  if (!billId) return bills;

  var arr = array(bills);

  var b = arr.find( { id: billId });

  if (!b) return arr.toArray()

  arr = arr.reject(function (val) {
    return val.id == b.id;
  });

  return arr.toArray().concat([b]);
}

module.exports = BillProposalViewer;