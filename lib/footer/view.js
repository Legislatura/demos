/**
 * Module dependencies.
 */

var template = require('./template');
var View = require('view');

function Footer() {
  View.call(this, template);
}

/**
 * Extend form View
 */

View(Footer);

module.exports = Footer;