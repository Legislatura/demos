var page = require('page');
var bus = require('bus');
var title = require('title');
var BillSummaryView = require('./view');

page('/summary', function(ctx, next) {
  console.log('hit summary');
  title('Summary');
  var summary = new BillSummaryView();
  summary.appendTo('section.app-content');
  bus.emit('page:render');
});