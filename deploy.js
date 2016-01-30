var exec = require('child_process').execSync;
var conf = require('./site.conf.json');

var ghLink = 'https://github.com/' + conf.username + '/' + conf.repo;
exec('rm -rf .deploy');
exec('mkdir .deploy');
exec('cp -r ./dist/* ./.deploy/');
exec('cp -r ./posts ./.deploy');
exec('cp ./public/app.html ./.deploy/index.html');
exec('cp ./db.json ./.deploy/db.json');
process.chdir('.deploy');
exec('git init');
exec('git remote add origin ' + ghLink);
exec('git add -A .');
exec('git commit -m"site update"');
exec('git push --force --quiet origin master:gh-pages');
