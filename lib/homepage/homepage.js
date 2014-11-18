/**
 * Module dependencies.
 */

var page = require('page');
var Homepage = require('./view');
var classes = require('classes');
var winners = require('winners');
var citizen = require('citizen');
var cookie = require('cookie');

// Routing.

page('/', citizen.optional, winners.middleware, function(ctx, next) {
  if (!citizen.sawTutorial && !cookie('sawTutorial')) {
    // An awful hack to make the redirect with visionmedia/page.js 1.3.7.
    // See the discussion here: https://github.com/visionmedia/page.js/issues/94
    setTimeout(function () {
      page.replace('/tutorial');
    }, 0);
  }

  // Build signin view with options
  var homepage = new Homepage(winners.items);

  // Display section content
  classes(document.body).add('homepage');

  // Render signin-page into content section
  homepage.replace('#content .content-container');
});