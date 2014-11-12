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

  function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  };

  shuffle(laws).forEach(function (law) {
    var billProposal = new BillProposal(law, { delayNextLaw: false });
    billProposal.el
      .addClass('col-md-4');
      //.addClass('link-to-law');

    billProposal.appendTo(container[0]);
  })
}

View(BillSummary);

module.exports = BillSummary;