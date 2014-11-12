/**
 * Module dependencies.
 */

var loading = require('loading-lock');
var bus = require('bus');
var o = require('query');

module.exports = exports = loading(o('#content .content-container'), { size: 80 });

exports.lock();

bus.once('page:render', function() {
  exports.unlock();
});
