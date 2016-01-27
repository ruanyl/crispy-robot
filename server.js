var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs-extra');
var path = require('path');

app.use(express.static('public'));
app.use(express.static('dist'));
app.use(express.static('styles'));
app.use(express.static('posts'));
app.use(bodyParser.json());

app.post('/add', function (req, res) {
  var md = req.body.md;
  var findTitle = md.split('\n')[0].match(/#{1,6}(.+)/);

  if(!findTitle) {
    return res.json({
      status: 'error',
      message: 'Title not found'
    });
  }
  var title = findTitle[1].trim().split(' ').join('-');
  fs.outputFile(path.join(__dirname, '/posts/' + title + '.md'), md, function(err) {
    console.log(err);
  })
  console.log(req.body);
  res.json({status: 'ok'});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
