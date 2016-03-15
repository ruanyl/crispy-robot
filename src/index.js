require('es6-promise').polyfill();
var conf = require('../site.conf.json');
var fetch = require('isomorphic-fetch');
var rangy = require('rangy');
var utils = require('./utils');
var hljs = require('highlight.js');
var markdown = require('markdown-it')({
  html: true
});

hljs.initHighlightingOnLoad();
hashChanged(window.location.hash); // initial the view

if('onhashchange' in window) { // event supported?
  window.onhashchange = function() {
    hashChanged(window.location.hash);
  };
} else {
  var storedHash = window.location.hash;
  window.setInterval(function() {
    if (window.location.hash !== storedHash) {
      storedHash = window.location.hash;
      hashChanged(storedHash);
    }
  }, 100);
}

var postsUrl = 'https://api.github.com/repos' + conf.username + '/' + conf.repo + '/contents/posts?ref=' + conf.branch;

function hashChanged(hash) {
  document.querySelector('#viewContainer').style.display = 'none';
  document.querySelector('#listContainer').style.display = 'none';

  hash = hash.split('/');
  switch(hash[1]) {
    case 'view':
      document.querySelector('#viewContainer').innerHTML = '';
      document.querySelector('#viewContainer').style.display = 'block';
      toView(hash[2]);
      break;
    case 'list':
      document.querySelector('#listContainer').style.display = 'block';
      toList();
      break;
    default:
      document.querySelector('#listContainer').style.display = 'block';
      toList();
      break;
  }
}

var posts = null;
var user = null;

if(!user) {
  utils.fetchGithubUser()
  .then(function(user) {
    return utils.renderMenu(user);
  }).then(function(menuHtml) {
    document.querySelector('#menu').innerHTML = menuHtml;
  });
} else {
  document.querySelector('#menu').innerHTML = utils.renderMenu(user);
}

function toView(id) {
  if(posts && posts[id]) {
    fetchContent('posts/' + posts[id].name + posts[id].ext)
    .then(function(body) {
      renderPost(body);
    });
  } else {
    fetchDb()
    .then(function(db) {
      posts = db;
      var filename = posts[id].name + posts[id].ext;
      return fetchContent('posts/' + filename);
    })
    .then(function(body) {
      renderPost(body);
    });
  }
}

function renderPost(md) {
  var html = markdown.render(md);
  document.querySelector('#viewContainer').innerHTML = html;

  [].slice.call(document.querySelectorAll('pre code')).forEach(function(el) {
    hljs.highlightBlock(el);
  });
}

function fetchContent(path) {
  var postUrl = 'https://raw.githubusercontent.com/' + conf.username + '/' + conf.repo + '/' + conf.branch + '/' + path;

  return fetch(postUrl)
  .then(function(res) {
    return res.text();
  });
}

function fetchDb() {
  var postsListUrl = 'https://raw.githubusercontent.com/' + conf.username + '/' + conf.repo + '/' + conf.branch + '/db.json';

  return fetch(postsListUrl)
  .then(function(res) {
    return res.json();
  });
}

function renderList(posts) {
  var list = utils.renderList(posts, 'view');
  document.querySelector('#listContainer').innerHTML = list;
}

function toList() {
  if(!posts) {
    fetchDb()
    .then(function(db) {
      posts = db;
      renderList(db);
    });
  } else {
    renderList(posts);
  }
}
