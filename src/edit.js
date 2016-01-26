require('es6-promise').polyfill();
var MediumEditor = require('medium-editor');
var fetch = require('isomorphic-fetch');
var rangy = require('rangy');
var toMarkdown = require('to-markdown');
var markdown = require("markdown-it")({
  html: true
});

rangy.init();

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

var editable = document.querySelector('.editable');
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
var editor = new MediumEditor(editable, {
  buttonLabels: 'fontawesome',
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'orderedlist', 'unorderedlist', 'anchor', 'h3', 'h4', 'quote', 'pre', 'code']
  },
  extensions: {
    'code': new CodeButton()
  }
});

var saveBtn = document.querySelector('#saveBtn');
saveBtn.addEventListener('click', function(e) {
  e.preventDefault();

  var md = toMarkdown(editable.innerHTML).split('\n').map(function(c) {
    return c.trim();
  }).join('\n').trim()
  console.log(md);

  fetch('/save', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({md: md})
  });
});

function hashChanged(hash) {
  hash = hash.split('/');
  if(hash[1] === 'view') {
    toView(hash[2]);
  } else if(hash[1] === 'edit') {
    toEdit(hash[2]);
  }
}

function toView(id) {
  document.querySelector('#viewContainer').style.display = 'block';
  document.querySelector('#editContainer').style.display = 'none';

  fetch('/text.md')
  .then(function(res) {
    return res.text();
  }).then(function(body) {
    var html = markdown.render(body);
    console.log(html);
    document.querySelector('#viewContainer').innerHTML = html;
  });
}

function toEdit(id) {
  document.querySelector('#viewContainer').style.display = 'none';
  document.querySelector('#editContainer').style.display = 'block';
}
