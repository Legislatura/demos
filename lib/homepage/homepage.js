/**
 * Module dependencies.
 */

var page = require('page');
var Homepage = require('./view');
var classes = require('classes');
var winners = require('winners');

// Routing.
page('/', winners.middleware, function(ctx, next) {
  // Build signin view with options
  var homepage = new Homepage(winners.items);

  // Display section content
  classes(document.body).add('homepage');

  // Render signin-page into content section
  homepage.replace('#content .content-container');
});