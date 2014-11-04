/**
 * Module dependencies.
 */

var template = require('./template');
var View = require('view');

function About() {
  if (!(this instanceof About)) {
    return new About();
  }

  View.call(this, template);
}

View(About);

/**
 * Expose About
 */

module.exports = About;