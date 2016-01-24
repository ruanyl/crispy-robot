var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var concat = require('gulp-concat');

var paths = {
  vendorStyles: [
    './node_modules/medium-editor/dist/css/medium-editor.min.css',
    './node_modules/medium-editor/dist/css/themes/default.min.css'
  ]
};

gulp.task('jsEdit', function() {
  var b = browserify({
    entries: './src/edit.js',
    debug: true
  });

  return b.bundle()
  .pipe(source('edit.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .on('error', gutil.log)
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./dist/js/'));
});

gulp.task('jsIndex', function() {
  var b = browserify({
    entries: './src/index.js',
    debug: true
  });

  return b.bundle()
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .on('error', gutil.log)
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./dist/js/'));
});

gulp.task('cssVendor', function() {
  return gulp.src(paths.vendorStyles)
  .pipe(concat('vendor.css'))
  .pipe(gulp.dest('dist/css'));
});

gulp.task('watch', function() {
  gulp.watch('./src/**/*.js', ['jsEdit', 'jsIndex']);
});

gulp.task('build', ['jsEdit', 'jsIndex', 'cssVendor']);
