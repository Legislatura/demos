/**
 * Module dependencies.
 */

var page = require('page');
var Homepage = require('./view');
var classes = require('classes');
var winners = require('winners');
var citizen = require('citizen');

// Routing.

page('/', citizen.optional, winners.middleware, function(ctx, next) {
  // undefined !== citizen.sawTutorial means that user is not logged on.
  // In that case, tutorial should not be shown (#101)
  if (undefined !== citizen.sawTutorial && !citizen.sawTutorial) {
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