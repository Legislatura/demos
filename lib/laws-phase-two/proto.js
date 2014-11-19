/**
 * Module dependencies.
 */

var citizen = require('citizen');
var Emitter = require('emitter');
var request = require('request');
var render = require('render');
var Stateful = require('stateful');
var log = require('debug')('democracyos:laws-proto');

/**
 * Expose `Laws` proto constructor
 */

module.exports = Laws;

/**
 * Laws collection constructor
 */

function Laws(law) {
  if (!(this instanceof Laws)) {
    return new Laws(id);
  };


  this.law = law;
  // instance bindings
  this.middleware = this.middleware.bind(this);
  this.fetch = this.fetch.bind(this);

  this.state('initializing');

  this.fetch();
}

/**
 * Mixin Laws prototype with Emitter
 */

// Emitter(Laws.prototype);
Stateful(Laws);

/**
 * Fetch `laws` from source
 *
 * @param {String} src
 * @api public
 */

Laws.prototype.fetch = function(src) {
  log('request in process');
  src = src || '/api/law/phase-two/:id'.replace(':id', this.law.id);

  this.state('loading');

  request
  .get(src)
  .end(onresponse.bind(this));

  function onresponse(err, res) {
    if (err || !res.ok) {
      var message = 'Unable to load laws. Please try reloading the page. Thanks!';
      return this.error(message);
    };

    function sort(a, b) {
      return a.order - b.order;
    }

    var ordered = res.body.sort(sort);

    this.set(ordered);
  }
}

/**
 * Set items to `v`
 *
 * @param {Array} v
 * @return {Laws} Instance of `Laws`
 * @api public
 */

Laws.prototype.set = function(v) {
  this.items = v;
  this.state('loaded');
  return this;
}

/**
 * Get current `items`
 *
 * @return {Array} Current `items`
 * @api public
 */

Laws.prototype.get = function() {
  return this.items;
}

/**
 * Middleware for `page.js` like
 * routers
 *
 * @param {Object} ctx
 * @param {Function} next
 * @api public
 */

Laws.prototype.middleware = function(ctx, next) {
  this.ready(next);
}

/**
 * Handle errors
 *
 * @param {String} error
 * @return {Laws} Instance of `Laws`
 * @api public
 */

Laws.prototype.error = function(message) {
  // TODO: We should use `Error`s instead of
  // `Strings` to handle errors...
  // Ref: http://www.devthought.com/2011/12/22/a-string-is-not-an-error/
  this.state('error', message);
  log('error found: %s', message);

  // Unregister all `ready` listeners
  this.off('ready');
  return this;
}