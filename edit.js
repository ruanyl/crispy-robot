require('es6-promise').polyfill();
var MediumEditor = require('medium-editor');
var MeMarkdown = require('./src/MeMarkdown');
var fetch = require('isomorphic-fetch');

var mdContent = {
  md: ''
};
var editable = document.querySelector('.editable');
var editor = new MediumEditor(editable, {
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'orderedlist', 'unorderedlist', 'anchor', 'h3', 'h4', 'quote']
  },
  extensions: {
    markdown: new MeMarkdown(function(md) {
      mdContent.md = md;
      console.log(md);
    })
  }
});

var saveBtn = document.querySelector('#saveBtn')
saveBtn.addEventListener('click', function(e) {
  e.preventDefault();
  fetch('/save', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(mdContent)
  });
});
