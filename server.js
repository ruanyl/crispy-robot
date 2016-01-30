var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs-extra');
var path = require('path');
var shortid = require('shortid');
var post = require('./src/post');

app.use(express.static('public'));
app.use(express.static('dist'));
app.use(express.static('styles'));
app.use(express.static('posts'));
app.use(bodyParser.json());

app.post('/add', function (req, res) {
  var md = req.body.md;
  var title = post.findTitle(md);

  if(title === null) {
    return res.json({
      status: 'error',
      message: 'Title not found'
    });
  }

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

app.get('/post/:id', function(req, res) {
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

app.post('/update/:id', function(req, res) {
  var md = req.body.md;
  var title = post.findTitle(md);

  if(title === null) {
    return res.json({
      status: 'error',
      message: 'Title not found'
    });
  }

  var postsPath = path.join(__dirname, '/posts');
  var db = fs.readJsonSync(path.join(postsPath, '/db.json'), {throws: false});
  var id = req.params.id;
  if(!id || !db[id]) {
    return res.json({
      status: 'error',
      message: 'Id not found'
    });
  }

  var oldTitle = db[id];
  if(title !== oldTitle) { // if user update tile
    db[id] = title;
    // update db.json and remove the old .md file
    fs.outputJsonSync(path.join(postsPath, '/db.json'), db);
    fs.removeSync(path.join(postsPath, oldTitle + '.md'));
  }
  fs.outputFile(path.join(postsPath, db[id] + '.md'), md, function(err) {
    if(err) {
      res.json({
        status: 'error',
        message: 'Not updated'
      });
    } else {
      res.json({
        status: 'ok'
      });
    }
  });
});

app.get('/list', function(req, res) {
  var postsPath = path.join(__dirname, '/posts');
  fs.readJson(path.join(postsPath, '/db.json'), function(err, json) {
    if(err) {
      return res.json({
        status: 'error',
        message: 'db file not found'
      });
    }
    res.json(json);
  });
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
