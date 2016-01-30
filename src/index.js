require('es6-promise').polyfill();
var conf = require('../site.conf.json');
var fetch = require('isomorphic-fetch');
var rangy = require('rangy');
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
  console.log(hash);
  document.querySelector('#viewContainer').style.display = 'none';
  document.querySelector('#listContainer').style.display = 'none';

  hash = hash.split('/');
  switch(hash[1]) {
    case 'view':
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

function toView(id) {
  if(posts && posts[id]) {
    fetchContent('posts/' + posts[id] + '.md')
    .then(function(body) {
      renderPost(body);
    });
  } else {
    fetchDb()
    .then(function(db) {
      posts = db;
      var filename = posts[id] + '.md';
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

function toList() {
  fetchDb()
  .then(function(db) {
    posts = db;
    var list = '';
    for(var id in posts) {
      var title = posts[id].split('-').join(' ');
      list = list + '<a href="#/view/' + id + '"><h3>' + title + '</h3></a>';
    }
    document.querySelector('#listContainer').innerHTML = list;
  });
}
