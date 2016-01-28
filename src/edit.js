require('es6-promise').polyfill();
var MediumEditor = require('medium-editor');
var fetch = require('isomorphic-fetch');
var rangy = require('rangy');
var toMarkdown = require('to-markdown');
var hljs = require('highlight.js');
var markdown = require("markdown-it")({
  html: true
});

rangy.init();
hljs.initHighlightingOnLoad();
hashChanged(window.location.hash); // initial the view

if ("onhashchange" in window) { // event supported?
  window.onhashchange = function () {
    hashChanged(window.location.hash);
  }
} else {
  var storedHash = window.location.hash;
  window.setInterval(function () {
    if (window.location.hash != storedHash) {
      storedHash = window.location.hash;
      hashChanged(storedHash);
    }
  }, 100);
}

var addedContent = document.querySelector('#addContainer .editable');
var updatedContent = document.querySelector('#editContainer .editable');
var CodeButton = MediumEditor.extensions.button.extend({
  name: 'code',
  contentDefault: 'code',
  action: 'code',
  tagNames: ['code'],
  init: function() {
    MediumEditor.extensions.button.prototype.init.call(this);
    this.classApplier = rangy.createCssClassApplier('code', {
      elementTagName: 'code',
      normalize: true
    });
  },
  handleClick: function(e) {
    this.classApplier.toggleSelection();
  }
});
var editor = new MediumEditor('.editable', {
  buttonLabels: 'fontawesome',
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'orderedlist', 'unorderedlist', 'anchor', 'h3', 'h4', 'quote', 'pre', 'code']
  },
  extensions: {
    'code': new CodeButton()
  }
});

var addBtn = document.querySelector('#addBtn');
addBtn.addEventListener('click', function(e) {
  e.preventDefault();

  var md = toMarkdown(addedContent.innerHTML, {
    converters: [{
        filter: 'pre',
        replacement: function(content) {
          return '\n```\n' + content + '\n```\n';
        }
    }, {
      filter: 'span',
      replacement: function(content) {
        return content;
      }
    }]
  });

  fetch('/add', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({md: md})
  });
});

function hashChanged(hash) {
  console.log(hash);
  document.querySelector('#addContainer').style.display = 'none';
  document.querySelector('#viewContainer').style.display = 'none';
  document.querySelector('#editContainer').style.display = 'none';

  hash = hash.split('/');
  switch(hash[1]) {
    case 'view':
      document.querySelector('#viewContainer').style.display = 'block';
      toView(hash[2]);
      break;
    case 'edit':
      document.querySelector('#editContainer').style.display = 'block';
      toEdit(hash[2]);
      break;
    case 'add':
      document.querySelector('#addContainer').style.display = 'block';
      toAdd();
      break;
  }
}

function toView(id) {
  fetch('/view/' + id)
  .then(function(res) {
    return res.text();
  }).then(function(body) {
    var html = markdown.render(body);
    document.querySelector('#viewContainer').innerHTML = html;

    [].slice.call(document.querySelectorAll('pre code')).forEach(function(el) {
      hljs.highlightBlock(el);
    });
  });
}

function toEdit(id) {
}

function toAdd() {
}
