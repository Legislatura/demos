/**
 * Module dependencies.
 */

var t = require('t');
var template = require('./template');
var View = require('view');

module.exports = NextLawButton;

function NextLawButton(ctx) {
  if (!(this instanceof NextLawButton)) {
    return new NextLawButton(ctx);
  }

  this.ctx = ctx;
  this.setLocals();
  View.call(this, template, { nextLaw: this.nextLaw });
}

View(NextLawButton);

NextLawButton.prototype.setLocals = function() {
  var ctx = this.ctx;
  var items = ctx.sidebar.find('li');

  function index() {
    for (var i = 0; i < items.length; i++) {
      if (items[i].getAttribute('data-id') == ctx.law.id) {
        return i;
      }
    }
    return -1;
  }

  var i = index();
  var id = false;
  var nextLawTitle = '';
  switch (i) {
    case -1:
      nextLawTitle = '';
      break;
    case 1:
      nextLawTitle = t('next-law.vote.general');
      id = (i + 1) < items.length ? items[i + 1].getAttribute('data-id') : null;
      break;
    case 2:
      nextLawTitle = t('next-law.vote.singular');
      id = (i + 1) < items.length ? items[i + 1].getAttribute('data-id') : null;
      break;
    default:
      nextLawTitle = t('next-law.vote.next-singular');
      id = (i + 1) < items.length ? items[i + 1].getAttribute('data-id') : null;
      break;
  }
  this.nextLaw = id ? { id: id, title: nextLawTitle } : null;
};