/**
 * Module dependencies.
 */

var template = require('./template');
var View = require('view');

function Projects(projects) {
  if (!(this instanceof Projects)) {
    return new Projects();
  }

  View.call(this, template, { projects: projects });
}

View(Projects);

/**
 * Expose Projects
 */

module.exports = Projects;