/**
 * Module dependencies.
 */

var template = require('./template');
var View = require('view');

function Projects() {
  if (!(this instanceof Projects)) {
    return new Projects();
  }

  View.call(this, template);
}

View(Projects);

/**
 * Expose Projects
 */

module.exports = Projects;