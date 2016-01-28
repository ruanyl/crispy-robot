var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs-extra');
var path = require('path');
var shortid = require('shortid');

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

  var dbPath = path.join(__dirname, '/posts/db.json');
  fs.ensureFileSync(dbPath);

  var db = fs.readJsonSync(dbPath, {throws: false});
  var id = shortid.generate();
  if(!db) {
    db = {};
  }
  db[id] = title;

  console.log(db);
  fs.outputJsonSync(dbPath, db);

  fs.outputFile(path.join(__dirname, '/posts/' + title + '.md'), md, function(err) {
    if(err) {
      console.log(err);
      return res.json({status: 'error', message: 'save file failed'});
    }
    return res.json({status: 'ok', id: id});
  });
});

app.get('/view/:id', function(req, res) {
  var postsPath = path.join(__dirname, '/posts');
  var db = fs.readJsonSync(path.join(postsPath, '/db.json'), {throws: false});
  var id = req.params.id;
  if(id && db[id]) {
    fs.readFile(path.join(postsPath, db[id] + '.md'), function(err, md) {
      res.send(md);
    });
  } else {
    res.send('### Oops, Not Found');
  }
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
