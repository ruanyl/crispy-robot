var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs-extra');
var path = require('path');
var shortid = require('shortid');
var utils = require('./src/utils');

app.use(express.static('public'));
app.use(express.static('dist'));
app.use(express.static('styles'));
app.use(express.static('posts'));
app.use(bodyParser.json());

app.post('/add', function (req, res) {
  var md = req.body.md;
  var title = utils.findTitle(md);

  if(!title) {
    return res.json({
      status: 'error',
      message: 'Title not found'
    });
  }

  var dbPath = path.join(__dirname, '/db.json');
  fs.ensureFileSync(dbPath);

  var db = fs.readJsonSync(dbPath, {throws: false});
  var id = shortid.generate();
  if(!db) {
    db = {};
  }
  db[id] = {
    title: title,
    name: title,
    ext: 'md'
  };

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
  var db = fs.readJsonSync(path.join(__dirname, '/db.json'), {throws: false});
  var id = req.params.id;
  if(id && db[id]) {
    fs.readFile(path.join(postsPath, db[id].name + db[id].ext), function(err, md) {
      res.send(md);
    });
  } else {
    res.send('### Oops, Not Found');
  }
});

app.post('/update/:id', function(req, res) {
  var md = req.body.md;
  var title = utils.findTitle(md);
  var name = title.split(' ').join('-');

  if(title === null) {
    return res.json({
      status: 'error',
      message: 'Title not found'
    });
  }

  var postsPath = path.join(__dirname, '/posts');
  var db = fs.readJsonSync(path.join(__dirname, '/db.json'), {throws: false});
  var id = req.params.id;
  if(!id || !db[id]) {
    return res.json({
      status: 'error',
      message: 'Id not found'
    });
  }

  var oldName = db[id].name;
  var oldTitle = db[id].title;
  var date = utils.findDate(oldName);

  if(date) { // append date to file name
    name = date + '-' + name;
  }

  if(title !== oldTitle) { // if user update tile
    db[id] = {
      title: title,
      name: name,
      ext: db[id].ext
    };
    // update db.json and remove the old .md file
    fs.outputJsonSync(path.join(__dirname, '/db.json'), db);
    fs.removeSync(path.join(postsPath, oldName + db[id].ext));
  }
  fs.outputFile(path.join(postsPath, name + db[id].ext), md, function(err) {
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
  fs.readJson(path.join(__dirname, '/db.json'), function(err, json) {
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
