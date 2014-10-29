var View = require('view');
var template = require('./template');

function BillSummary() {
  View.call(this, template, {});
}

View(BillSummary);

module.exports = BillSummary;