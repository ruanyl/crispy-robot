require('es6-promise').polyfill();
var MediumEditor = require('medium-editor');
var MeMarkdown = require('./src/MeMarkdown');
var fetch = require('isomorphic-fetch');
var markdown = require("markdown").markdown;

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

if ("onhashchange" in window) { // event supported?
  window.onhashchange = function () {
    hashChanged(window.location.hash);
  }
}
else { // event not supported:
  var storedHash = window.location.hash;
  window.setInterval(function () {
    if (window.location.hash != storedHash) {
      storedHash = window.location.hash;
      hashChanged(storedHash);
    }
  }, 100);
}

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
    var html = markdown.toHTML(body);
    console.log(html);
    document.querySelector('#viewContainer').innerHTML = html;
  });
}

function toEdit(id) {
  document.querySelector('#viewContainer').style.display = 'none';
  document.querySelector('#editContainer').style.display = 'block';
}
