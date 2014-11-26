/**
 * Module dependencies.
 */

var request = require('request');
var citizen = require('citizen');
var empty = require('empty');
var page = require('page');
var Article = require('proposal-article');
var Options = require('proposal-options');
var NextLaw = require('next-law-button');
var Comments = require('comments-view');
var Sidebar = require('sidebar-phase-two');
var filter = require('laws-filter');
var classes = require('classes');
var locker = require('browser-lock');
var title = require('title');
var o = require('query');
var bus = require('bus');
var log = require('debug')('democracyos:law:page');

page('/law/:id', citizen.optional, load, loadSidebar, function(ctx, next) {
  function validUrl() {
    var pathname = window.location.pathname;
    return pathname == '/' ||  /^\/(law|proposal)/.test(pathname);
  }

  if (!validUrl()) return classes(document.body).remove('browser-page');

  bus.emit('page:render');

  if (!ctx.law) {
    log('Law %s not found', ctx.params.id);
    return next();
  }

  ctx.sidebar.replace('aside.nav-proposal');

  // Clean page's content
  empty(o('section.app-content'))


  // Build article's content container
  // and render to section.app-content
  var article = new Article(ctx.law, nextLaw);
  article.render('section.app-content');

  // Build article's meta
  // and render to section.app-content
  var options = new Options(ctx.law, ctx.citizen);
  options.render('section.app-content');

  var nextLaw = new NextLaw(ctx);
  nextLaw.appendTo('section.app-content');


  // Build article's comments, feth them
  // and render to section.app-content
  if (ctx.law.votable) {
    var comments = new Comments('law', ctx.law.id);
    comments.render('section.app-content');
    comments.initialize();
  }

  classes(document.body).add('browser-page');
  title(ctx.law.mediaTitle);

  log('render %s', ctx.params.id);

  bus.once('page:change', pagechange);
  function pagechange(url) {
    // restore page's original title
    title();

    // lock article's section
    locker.lock();

    // hide it from user
    classes(o('section.app-content')).add('hide');

    // once render, unlock and show
    bus.once('page:render', function() {
      locker.unlock();
      classes(o('section.app-content')).remove('hide');
    });

    // check if loading to same page
    // and if not, scroll to top
    if (url !== ctx.path) o('section#browser').scrollTop = 0;

    // don't remove 'browser-page' body class
    // if we still are in a browsing laws page
    if (/^\/law/.test(url)) return;
    classes(document.body).remove('browser-page');
  };
});

/*
 * Load homepage data
 *
 * @param {Object} ctx page's context
 * @param {Function} next callback after load
 * @api private
 */

function load (ctx, next) {
  log('fetch for %s', ctx.params.id);

  request
  .get('/api/law-phase-two/' + ctx.params.id)
  .end(function(err, res) {
    if (res.status == 404) return ctx.law = null, next();
    if (err || !res.ok) return log('Found error: %s', err || res.error);
    ctx.law = res.body;
    next();
  });
};

function loadSidebar(ctx, next) {
  ctx.sidebar = new Sidebar(ctx.law);
  ctx.sidebar.ready(function () {
    next();
  });
}
