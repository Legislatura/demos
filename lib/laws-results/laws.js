/**
 * Module dependencies.
 */

var log = require('debug')('democracyos:laws-proto');
var request = require('request');
var Results = require('laws-proto');

/**
 * Fetch `laws` from source
 *
 * @param {String} src
 * @api public
 */

Results.prototype.fetch = function(src) {
  log('request in process');
  src = src || '/api/law/results';

  this.state('loading');

  request
  .get(src)
  .end(onresponse.bind(this));

  function onresponse(err, res) {
    if (err || !res.ok) {
      var message = 'Unable to load laws. Please try reloading the page. Thanks!';
      return this.error(message);
    };

    function shuffle(o){ //v1.0
      for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
    };

    this.winners = res.body.slice(0, 3);
    this.losers = shuffle(res.body.slice(3));

    this.set(res.body);
  }
}

var laws = module.exports = new Results();