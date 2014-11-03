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
var title = require('title');
var array = require('array');

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
  // This should fetch stuff again from backend so voted stuff is updated
  // citizen.on('loaded', this.reload);
  // citizen.on('unloaded', this.reload);

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

  var bills = putFirst(randomize(laws.get()), this.lawId);
  var selected = bills[0];

  // sort & select properly if user is logged in
  if (citizen.logged()) {
    bills = sortForCitizen(bills, citizen.id);
    selected = notScoredByCitizen(bills, citizen.id)[0];
  }

  this.container = this.find('.bill-proposal-container');
  this.container.empty();

  bills.forEach(this.add);
  this.carousel = new Carousel(this.container[0]);
  var el = this.find('.bill-proposal[data-id="' + selected.id + '"');
  if (el.length) {
    this.carousel._show(el[0]);
  }

  //TODO: build every dom element for each law

  // container.set(selected)
};


/**
 * Returns a new `Array` making the `law` with the parameter ID its first element
 */
function putFirst (bills, lawId) {
  if (!lawId) return bills;

  var arr = array(bills);

  var l = arr.find( { id: lawId });

  if (!l) return arr.toArray()

  arr = arr.reject(function (val) {
    return val.id == l.id;
  });

  return [l].concat(arr.toArray());
}

function sortForCitizen (bills, citizenId) {

  return scoredByCitizen(bills, citizenId).concat(notScoredByCitizen(bills, citizenId));
}

function scoredByCitizen(bills, citizenId) {
  return array(bills).select(function(law) {
    return ~scorers(law).indexOf(citizenId) != 0;
  }).toArray();
}

function notScoredByCitizen(bills, citizenId) {
  return array(bills).select(function(law) {
    return ~scorers(law).indexOf(citizenId) == 0;
  }).toArray();
}

function scorers (law) {
  if (!law) return [];

  var nothings = law.nothings || [];
  var littles = law.littles || [];
  var somewhats = law.somewhats || [];
  var verys = law.verys || [];

  return nothings.concat(littles).concat(somewhats).concat(verys);
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