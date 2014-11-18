var o = require('dom');
var config = require('config');
var t = require('t');
var indexOf = require('indexof');
var View = require('view');
var template = require('./template');
var BillProposal = require('bill-proposal');

function BillSummary(winners, nexttime) {
  var baseUrl = config.protocol + "://" + config.host + (config.publicPort ? (":" + config.publicPort) : "");
  View.call(this, template, {
    baseUrl: baseUrl,
    t: t,
    indexOf: indexOf
  });

  var container = this.find('.winners .laws');
  winners.forEach(function (law) {
    var billProposal = new BillProposal(law, { delayNextLaw: false });
    billProposal.el
      .addClass('col-md-4');
      //.addClass('link-to-law');

    billProposal.appendTo(container[0]);
  });

  container = this.find('.nexttime .laws');
  nexttime.forEach(function (law) {
    var billProposal = new BillProposal(law, { delayNextLaw: false });
    billProposal.el
      .addClass('col-md-4');
      //.addClass('link-to-law');

    billProposal.appendTo(container[0]);
  })
}

View(BillSummary);

module.exports = BillSummary;