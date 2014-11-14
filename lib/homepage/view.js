/**
 * Module dependencies.
 */

var template = require('./template');
var View = require('view');
var BillProposal = require('bill-proposal');

function Homepage(winners) {
  if (!(this instanceof Homepage)) {
    return new Homepage();
  }

  View.call(this, template);

  var container = this.find('.winners');
  winners.forEach(function (law) {
    var billProposal = new BillProposal(law, { delayNextLaw: false });
    billProposal.el
      .addClass('col-md-4');

    billProposal.appendTo(container[0]);
  });
}

View(Homepage);

/**
 * Expose Homepage
 */

module.exports = Homepage;