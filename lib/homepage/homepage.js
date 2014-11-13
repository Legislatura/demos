/**
 * Module dependencies.
 */

var page = require('page');
var sidebar = require('sidebar');
var citizen = require('citizen');
var classes = require('classes');
var t = require('t');
var o = require('query');
var render = require('render');
var empty = require('empty');
var noLaws = require('./no-laws');
var bus = require('bus');
var log = require('debug')('democracyos:homepage');

// Routing.
page('/', function(ctx, next) {
  citizen.ready(oncitizenready);

  function validUrl() {
    var pathname = window.location.pathname;
    return pathname == '/' ||  /^\/(law|proposal)/.test(pathname);
  }

  function onsidebarready() {

    if (!validUrl()) return;

    classes(document.body).add('browser-page');

    var law = sidebar.items(0);

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
    next();
  }

  function oncitizenready() {
    if (!citizen.sawTutorial) {
      // An awful hack to make the redirect with visionmedia/page.js 1.3.7.
      // See the discussion here: https://github.com/visionmedia/page.js/issues/94
      setTimeout(function () {
        page.replace('/tutorial');
        next();
      }, 0);
    } else {
        sidebar.ready(onsidebarready);
    }
  }
});