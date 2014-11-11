/**
 * Module dependencies.
 */

var Projects = require('./view');
var o = require('dom');
var page = require('page');
var laws = require('laws');
var t = require('t');
var title = require('title');

page('/proyectos', function(ctx, next) {
  var projects = new Projects();

  o(document.body).addClass('projects');

  title(t('header.projects'));

  projects.replace('#content');
});