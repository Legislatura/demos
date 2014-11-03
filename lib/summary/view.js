var o = require('dom');
var config = require('config');
var t = require('t');
var indexOf = require('indexof');
var View = require('view');
var template = require('./template');
var BillProposal = require('bill-proposal');

function BillSummary(laws) {
  var baseUrl = config.protocol + "://" + config.host + (config.publicPort ? (":" + config.publicPort) : "");
  View.call(this, template, {
    baseUrl: baseUrl,
    t: t,
    indexOf: indexOf
  });

  var container = this.find('.laws');
  laws.forEach(function (law) {
    var billProposal = new BillProposal(law);
    billProposal.el
      .addClass('col-md-4');
      //.addClass('link-to-law');

    billProposal.appendTo(container[0]);
  })
}

View(BillSummary);

module.exports = BillSummary;