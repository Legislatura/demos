var page = require('page');
var bus = require('bus');
var t = require('t');
var laws = require('laws');
var title = require('title');
var BillSummaryView = require('./view');

page('/gracias', laws.middleware, function(ctx, next) {
  title(t('summary.title'));
  laws.fetch();
  laws.once('loaded', function() {
    var summary = new BillSummaryView(laws.items);
    summary.appendTo('section.app-content');
    bus.emit('page:render');
  });
});