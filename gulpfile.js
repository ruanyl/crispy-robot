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
    './node_modules/highlight.js/styles/solarized-dark.css'
  ],
  vendorScripts: [
    './node_modules/rangy/lib/rangy-core.js',
    './node_modules/rangy/lib/rangy-classapplier.js'
  ]
};

gulp.task('jsVendor', function() {
  return gulp.src(paths.vendorScripts)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('js', function() {
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

gulp.task('css', function() {
  return gulp.src('./styles/**/*.css')
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('watch', function() {
  gulp.watch('./src/**/*.js', ['js']);
  gulp.watch('./styles/**/*.css', ['css']);
});

gulp.task('build', ['js', 'cssVendor', 'jsVendor', 'css']);
