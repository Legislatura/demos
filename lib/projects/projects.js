/**
 * Module dependencies.
 */

var Projects = require('./view');
var bus = require('bus');
var o = require('dom');
var page = require('page');
var laws = require('laws');

page('/projects', laws.middleware, function(ctx, next) {
  bus.emit('page:render');

  var projects = new Projects(laws.get());
  projects.replace('#content');

  o(document.body).addClass('projects');
});