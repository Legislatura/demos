/**
 * Module dependencies.
 */

var page = require('page');
// var sidebar = require('sidebar');
var laws = require('laws');
var classes = require('classes');
var t = require('t');
var o = require('query');
var render = require('render');
var empty = require('empty');
var noLaws = require('./no-laws');
var bus = require('bus');
var log = require('debug')('democracyos:homepage');

// Routing.
page('/', laws.middleware, function(ctx, next) {
  // sidebar.ready(onsidebarready);

  function validUrl() {
    var pathname = window.location.pathname;
    return pathname == '/' ||  /^\/(law|proposal)/.test(pathname);
  }

  // function onsidebarready() {

    if (!validUrl()) return;

    classes(document.body).add('browser-page');

    var law = laws.items[0];

    function onpagechange() {
      classes(document.body).remove('browser-page');
    }

    if (!law) {
      var el = render.dom(noLaws);
      empty(o('#browser .app-content')).appendChild(el);
      bus.once('page:change', onpagechange);
      return bus.emit('page:render');
    }

    log('render law %s', law.id);
    ctx.path = '/law/' + law.id;
    ctx.homepage = true; // TODO: Remove on DEMOS phase 2
    next();
  // }
});