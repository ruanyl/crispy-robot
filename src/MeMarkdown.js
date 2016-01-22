var toMarkdown = require('to-markdown');

var MeMarkdown = function(options, callback) {

  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  // Defaults
  options = Object(options);
  options.events = options.events || ['input', 'change'];
  callback = callback || options.callback || function() {};

  // Called by medium-editor during init
  this.init = function() {

    // If this instance of medium-editor doesn't have any elements, there's nothing for us to do
    if (!this.base.elements || !this.base.elements.length) { return; }

    // Element(s) that this instance of medium-editor is attached to is/are stored in .elements
    this.element = this.base.elements[0];

    var handler = function() {
      callback(toMarkdown(this.element.innerHTML).split('\n').map(function(c) {
        return c.trim();
      }).join('\n').trim());
    }.bind(this);

    options.events.forEach(function(c) {
      this.element.addEventListener(c, handler);
    }.bind(this));

    handler();
  };
};

module.exports = MeMarkdown;
