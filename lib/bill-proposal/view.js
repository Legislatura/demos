/**
 * Module dependencies.
 */

var Chart = require('Chart.js');
var t = require('t');
var template = require('./template');
var View = require('view');

function BillProposal(law, options) {
  this.law = law;
  View.call(this, template, {law: law});
  this.renderChart();
}

View(BillProposal);

/**
 * Render chart into options block
 *
 * @return {ProposalOptions} `ProposalOptions` instance.
 * @api public
 * @deprecated
 */

BillProposal.prototype.renderChart = function() {
  var container = this.find('#results-chart')[0];
  var nothings = this.law.nothings || [];
  var littles = this.law.littles || [];
  var somewhats = this.law.somewhats || [];
  var verys = this.law.verys || [];
  var census = verys.concat(somewhats).concat(littles).concat(nothings);
  var data = [];

  if (!container) return;

  if (census.length) {
    data.push({
      value: nothings.length,
      color: "#2c3e50",
      label: t('scoring.options.nothing'),
      labelColor: "white",
      labelAlign: "center"
    });
    data.push({
      value: littles.length,
      color: "#8e44ad",
      label: t('scoring.options.little'),
      labelColor: "white",
      labelAlign: "center"
    });
    data.push({
      value: somewhats.length,
      color: "#2980b9",
      label: t('scoring.options.somewhat'),
      labelColor: "white",
      labelAlign: "center"
    });
    data.push({
      value: verys.length,
      color: "#27ae60",
      label: t('scoring.options.very'),
      labelColor: "white",
      labelAlign: "center"
    });

    new Chart(container.getContext('2d')).Pie(data, { animation: false });
  }
}

module.exports = BillProposal;