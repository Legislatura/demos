/**
 * Module dependencies.
 */

var o = require('dom');
var Progress = require('progress');
var template = require('./template');
var View = require('view');

function BillProposalViewer() {
  View.call(this, template);

  this.progressContainer = this.find('div.progress-container');
  this.progress = new Progress('#00708f'); // The parameter is the color of the bar
  this.progressContainer.append(this.progress.element);
  this.updateProgress(1, 20);
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

module.exports = BillProposalViewer;