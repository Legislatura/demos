/*
 * Module dependencies.
 */

var t = require('t');
var FormView = require('form-view');
var o = require('dom');
var template = require('./signup-form');
var title = require('title');
var config = require('config');

/**
 * Expose SignupForm.
 */

module.exports = SignupForm;

/**
 * Proposal Comments view
 *
 * @return {SignupForm} `SignupForm` instance.
 * @api public
 */

function SignupForm (reference) {
  if (!(this instanceof SignupForm)) {
    return new SignupForm(reference);
  };

  this.recaptcha();
  FormView.call(this, template, { reference: reference });
}

/**
 * Inherit from `FormView`
 */

FormView(SignupForm);

SignupForm.prototype.switchOn = function() {
  this.on('success', this.bound('showSuccess'));
};

SignupForm.prototype.switchOff = function() {
  this.off('success', this.bound('showSuccess'));
};

/**
 * Show success message
 */

SignupForm.prototype.showSuccess = function() {
  var form = this.find('#signup-form');
  var success = this.find('#signup-message');

  var welcomeMessage = this.find('#signup-message h1');
  var firstName = this.get('firstName');
  var lastName = this.get('lastName');
  var fullname = firstName + ' ' + lastName;

  title(t('Signup complete'));
  var message = t("Welcome, {name}!", { name: fullname });
  welcomeMessage.html(message);

  form.addClass('hide');
  success.removeClass('hide');
}

SignupForm.prototype.response = function(err, res) {
  if (!res.ok) {
    var errors = JSON.parse(res.text).error;
    this.errors(errors);
    this.recaptcha();
  };
  if (err || (res.body && res.body.error)) {
    return this.errors([err || res.body.error]), this.recaptcha();
  };

  this.emit('success', res);
};

/**
 * ReCaptcha callback handler
 */

SignupForm.prototype.recaptcha = function() {
  Recaptcha.create(config['recaptcha public key'],
    "captcha-container",
    {
      theme: "custom",
      custom_theme_widget: 'recaptcha_widget',
      lang: config['locale'],
      tabindex: 6
    }
  );
};