/**
 * Module dependencies.
 */

var template = require('./template');
var Laws = require('laws-phase-two');
var StatefulView = require('stateful-view');

function Sidebar(law) {
  if (!(this instanceof Sidebar)) {
    return new Sidebar(law);
  }

  this.laws = new Laws(law.phaseOne);
  this.laws.ready(initialize.bind(this))

  function initialize() {
    StatefulView.call(this, template, {law: law, laws: this.laws.items});
    this.state('loaded');
  }
}

StatefulView(Sidebar);

/**
 * Expose Sidebar
 */

module.exports = Sidebar;