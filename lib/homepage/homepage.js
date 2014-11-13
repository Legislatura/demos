/**
 * Module dependencies.
 */

var page = require('page');
var Homepage = require('./view');
var classes = require('classes');
var laws = require('laws');

// Routing.
page('/', laws.middleware, function(ctx, next) {
  laws.fetch('/api/law/winners');

  laws.ready(onlawsready);

  function onlawsready() {
    // Build signin view with options
    var homepage = new Homepage(laws.items);

    // Display section content
    classes(document.body).add('homepage');

    // Render signin-page into content section
    homepage.replace('#content .content-container');
  }
});