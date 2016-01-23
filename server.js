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

app.post('/save', function (req, res) {
  var md = req.body.md;
  fs.outputFile(path.join(__dirname, '/posts/text.md'), md, function(err) {
    console.log(err);
  })
  console.log(req.body);
  res.json({status: 'ok'});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
