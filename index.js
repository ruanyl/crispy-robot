require('es6-promise').polyfill();
var fetch = require('isomorphic-fetch');
var markdown = require( "markdown" ).markdown;

fetch('/text.md')
.then(function(res) {
  return res.text();
}).then(function(body) {
  var html = markdown.toHTML(body);
  document.querySelector('#container').innerHTML = html;
});
