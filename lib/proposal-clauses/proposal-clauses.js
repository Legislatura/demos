/**
 * Module dependencies.
 */

var citizen = require('citizen');
var config = require('config');
var request = require('request');
var StatefulView = require('stateful-view');
var t = require('t');
var template = require('./template');

/**
 * Expose `ProposalClauses`
 */

module.exports = ProposalClauses;

function ProposalClauses(law) {
  StatefulView.call(this, template, { clauses: law.clauses });

  this.law = law;
  this.loadComments();
}

StatefulView(ProposalClauses);

ProposalClauses.prototype.loadComments = function() {
  this
    .load();
};

ProposalClauses.prototype.load = function(clauseId) {
  var self = this;

  request
    .get('/api/law/:id/clause-comments'.replace(':id', this.law.id))
    .end(function (err, res) {
      if (res.status !== 200) ; //log error

      self.comments = res.body;

      request
        .get('/api/law/:id/summary-comments'.replace(':id', self.law.id))
        .end(function (err, res) {
          if (res.status !== 200) ; //log error

          self.comments = self.comments.concat(res.body);
          self.state('loaded');
        });
    });

  return this;
};

ProposalClauses.prototype.formatComment = function (comment) {
  comment.authorAvatarUrl = comment.author.profilePictureUrl ? comment.author.profilePictureUrl : comment.author.gravatar;
  comment.authorName = comment.author.fullName;
  comment.authorId = comment.author.id;
  comment.comment = comment.text;
  comment.sectionId = comment.reference;
  return comment;
}