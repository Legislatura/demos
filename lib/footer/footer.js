/**
 * Module dependencies.
 */

var bus = require('bus');
var Footer = require('./view');
var o = require('dom');

/**
 * Create footer instance and expose it
 */

var footer = module.exports = new Footer();

bus.on('page:render', function () {
  // Render header
  footer.replace('.footer-container');
});
