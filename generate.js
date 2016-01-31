var fs = require('fs-extra');
var path = require('path');
var shortid = require('shortid');

var dbPath = path.join(__dirname, '/db.json');
var postsPath = path.join(__dirname, '/posts');
fs.ensureFileSync(dbPath);

fs.readdir(postsPath, function(err, files) {
  var db = {};
  files = files.map(function(file) {
    return path.parse(file).name;
  });

  files.forEach(function(fname) {
    var key = shortid.generate();
    db[key] = fname;
  });
  fs.outputJsonSync(path.join(__dirname, '/db.json'), db);
});

