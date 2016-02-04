require('es6-promise').polyfill();
var MediumEditor = require('medium-editor');
var fetch = require('isomorphic-fetch');
var rangy = require('rangy');
var utils = require('./utils');
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

setInterval(function() {
  var view = window.location.hash.split('/')[1];
  if(view === 'edit') {
    //update();
  } else if(view === 'add') {
    //add();
  }
}, 5000);

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
    buttons: ['bold', 'italic', 'underline', 'orderedlist', 'unorderedlist', 'anchor', 'h3', 'h4', 'quote', 'pre', 'code', 'image']
  },
  extensions: {
    'code': new CodeButton()
  }
});

function customToMarkdown(html) {
  var md = toMarkdown(html, {
    converters: [{
      filter: function(node) {
        return node.nodeName === 'PRE' && node.firstChild.nodeName !== 'CODE';
      },
      replacement: function(content) {
        return '\n```\n' + content.trim() + '\n```\n';
      }
    }, {
      filter: 'span',
      replacement: function(content) {
        return content;
      }
    }, {
      filter: function(node) {
        return node.nodeName === 'PRE' && node.firstChild.nodeName === 'CODE';
      },
      replacement: function(content, node) {
        return '\n```\n' + node.firstChild.textContent.trim() + '\n```\n';
      }
    }]
  });
  return md;
}

function update() {
  var id = window.location.hash.split('/')[2];
  var md = customToMarkdown(updatedContent.innerHTML);
  console.log(md);

  if(id) {
    fetch('/update/' + id, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({md: md})
    });
  }
}

function add() {
  var md = customToMarkdown(addedContent.innerHTML);

  fetch('/add', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({md: md})
  });
}

var updateBtn = document.querySelector('#updateBtn');
updateBtn.addEventListener('click', function(e) {
  e.preventDefault();
  update();
});

var addBtn = document.querySelector('#addBtn');
addBtn.addEventListener('click', function(e) {
  e.preventDefault();
  add();
});

function hashChanged(hash) {
  document.querySelector('#addContainer').style.display = 'none';
  document.querySelector('#viewContainer').style.display = 'none';
  document.querySelector('#editContainer').style.display = 'none';
  document.querySelector('#listContainer').style.display = 'none';
  document.querySelector('#banner').style.display = 'none';

  hash = hash.split('/');
  switch(hash[1]) {
    case 'view':
      document.querySelector('#viewContainer').innerHTML = '';
      document.querySelector('#viewContainer').style.display = 'block';
      toView(hash[2]);
      break;
    case 'edit':
      document.querySelector('#editContainer .editable').innerHTML = '';
      document.querySelector('#editContainer').style.display = 'block';
      toEdit(hash[2]);
      break;
    case 'add':
      document.querySelector('#addContainer').style.display = 'block';
      toAdd();
      break;
    case 'list':
      document.querySelector('#banner').style.display = 'block';
      document.querySelector('#listContainer').style.display = 'block';
      toList();
      break;
    default:
      document.querySelector('#banner').style.display = 'block';
      document.querySelector('#listContainer').style.display = 'block';
      toList();
      break;
  }
}

function toView(id) {
  fetch('/post/' + id)
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
  fetch('/post/' + id)
  .then(function(res) {
    return res.text();
  }).then(function(body) {
    var html = markdown.render(body);
    document.querySelector('#editContainer .editable').innerHTML = html;
  });
}

var user = null;

function toList() {
  if(!user) {
    utils.fetchGithubUser()
    .then(function(user) {
      return utils.renderBanner(user);
    }).then(function(bannerHtml) {
      document.querySelector('#banner').innerHTML = bannerHtml;
    });
  } else {
    document.querySelector('#banner').innerHTML = utils.renderBanner(user);
  }

  fetch('/list/')
  .then(function(res) {
    return res.json();
  }).then(function(body) {
    var list = utils.renderList(body, 'edit');
    document.querySelector('#listContainer').innerHTML = list;
  });
}

function toAdd() {
}
