var MediumEditor = require('medium-editor');
var MeMarkdown = require('./src/MeMarkdown');

var editable = document.querySelector('.editable');
var editor = new MediumEditor(editable, {
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'orderedlist', 'unorderedlist', 'anchor', 'h3', 'h4', 'quote']
  },
  extensions: {
    markdown: new MeMarkdown(function(md) {
      console.log(md);
    })
  }
});
