/**
 * Module dependencies.
 */

var express = require('express');
var api = require('lib/db-api');
var utils = require('lib/utils');
var restrict = utils.restrict;
var staff = utils.staff;
var log = require('debug')('democracyos:stats');

var app = module.exports = express();

/**
 * Limit request to json format only
 */

app.get('/', restrict, staff, function (req, res) {
  log('Request /stats');
  var query = { publishedAt: { $exists: true } };
  var count = true;

  api.law.search(query, function(err, laws) {
    if (err) return _handleError(err, req, res);

    log('Found %d published laws', laws.length);

    var publishedLaws = laws.length;

    api.citizen.all(function (err, citizens) {
      if (err) return _handleError(err, req, res);

      log('Found %d registered citizens', citizens.length);

      var registeredCitizens = citizens.length;

      api.citizen.findEmailValidated(function(err, citizens) {
        if (err) return _handleError(err, req, res);

        log('Found %d email validated citizens', citizens.length);

        var emailValidatedCitizens = citizens.length;

        api.law.everything(function (err, laws) {
          if (err) return _handleError(err, req, res);

          log('Found %d laws', laws.length);
          var scores = [];
          laws.forEach(function (law) {
            var score = {};
            score.id = law.id;
            score.law = law.mediaTitle;
            score.nothings = law.nothings ? law.nothings.length : 0;
            score.littles = law.littles ? law.littles.length : 0;
            score.somewhats = law.somewhats ? law.somewhats.length : 0;
            score.verys = law.verys ? law.verys.length : 0;
            score['total scores'] = law.scoreParticipants ? law.scoreParticipants.length : 0;
            scores.push(score);
          });

          api.comment.all(function (err, comments) {
            if (err) return _handleError(err, req, res);

            log('Found %d comments', comments.length);

            api.comment.ratings(function (err, rated) {
              if (err) return _handleError(err, req, res);

              log('Found %d comments', rated);

              api.comment.totalReplies(function (err, replies) {
                if (err) return _handleError(err, req, res);

                log('Found %d comment replies', replies);

                res.json({
                  laws: publishedLaws,
                  citizens: registeredCitizens,
                  emailValidatedCitizens: emailValidatedCitizens,
                  scores: scores,
                  comments: comments.length,
                  rated: rated,
                  replies: replies
                });
              });
            });
          });
        });
      });
    })
  });
});