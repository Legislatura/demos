/**
 * Module dependencies.
 */

var log = require('debug')('democracyos:how-it-works:view');
var template = require('./template');
var Popover = require('popover');
var cookie = require('cookie');
var t = require('t');
var ripple = require('ripple');
var page = require('page');

/**
 * Expose HowItWorksPopover
 */
module.exports = HowItWorksPopover;

function HowItWorksPopover() {
  if (!(this instanceof HowItWorksPopover)) {
    return new HowItWorksPopover(proposals);
  }

}

HowItWorksPopover.prototype.loadPopover = function() {
  var PopoverContent = ripple(template.apply());
  var self = this;
  PopoverContent.directive('on-click', function(value, el, view){
      el.addEventListener('click', function() {
        cookie('how-it-works', true);
        log("How it works cookie set,hide popover");
        self.popover.hide();
        if ('more' === value) {
          page('/help/faq');
        }
      });
  });

  var content = new PopoverContent({
    more: t("how it works.tell-more"),
    gotIt: t("how it works.got-it")
  });

  this.popover = new Popover(content.el);
  this.popover.show('span.hiw');
};

HowItWorksPopover.prototype.load = function() {
  if (!cookie('how-it-works')) {
    log("How it works cookie not set, load popover");
    this.loadPopover();
  }
};

HowItWorksPopover.prototype.unload = function() {
  this.popover.hide();
};