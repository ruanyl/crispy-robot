var fs = require('fs-extra');
var path = require('path');
var shortid = require('shortid');
var utils = require('./src/utils');

var dbPath = path.join(__dirname, '/db.json');
var postsPath = path.join(__dirname, '/posts');
fs.ensureFileSync(dbPath);

fs.readdir(postsPath, function(err, files) {
  var db = {};
  files = files.map(function(file) {
    return path.parse(file);
  });

  files.forEach(function(file) {
    var key = shortid.generate();
    var md = fs.readFileSync(path.join(__dirname, '/posts/', file.base), 'utf8');
    var title = utils.findTitle(md);
    db[key] = {
      name: file.name,
      ext: file.ext,
      title: title
    }
  });
  fs.outputJsonSync(path.join(__dirname, '/db.json'), db);
});

