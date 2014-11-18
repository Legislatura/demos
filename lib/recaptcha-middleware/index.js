/**
 * Module dependencies.
 */

var Recaptcha = require('recaptcha').Recaptcha
var config = require('lib/config');
var t = require('t-component');

var publicKey = config('recaptcha public key');
var privateKey = config('recaptcha private key');

module.exports = middleware;

function middleware(req, res, next) {
  var data = {
    remoteip:  req.connection.remoteAddress,
    challenge: req.body.recaptcha_challenge_field,
    response:  req.body.recaptcha_response_field
  };

  var recaptcha = new Recaptcha(publicKey, privateKey, data);

  recaptcha.verify(function(success, error_code) {
    if (success) {
      next();
    } else {
      var err = new Error('The CAPTCHA solution was incorrect');
      res.json(403, { error: t(err.message) });
    }
  });
}