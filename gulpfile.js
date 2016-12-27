var gulp = require('gulp');
var webserver = require('gulp-webserver');
var sass = require('gulp-sass');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var concat = require('gulp-concat');

var publicFolder = './public';
var cssFolder = publicFolder + '/css';

function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

gulp.task('css', function () {
  return gulp.src('src/styles/**/*.scss')
    .pipe(sass())
    .pipe(concat('style.css'))
    .pipe(gulp.dest(cssFolder))
    .on('error', handleError);
});

// // font awesome
// gulp.task('fa-css', function () {
//   return gulp.src('node_modules/font-awesome/css/font-awesome.min.css')
//     .pipe(gulp.dest(cssFolder))
//     .on('error', handleError);
// });
//
// gulp.task('fa-fonts', function () {
//   return gulp.src('node_modules/font-awesome/fonts/*')
//     .pipe(gulp.dest(publicFolder + '/fonts'))
//     .on('error', handleError);
// });
//
// gulp.task('fa', ['fa-css', 'fa-fonts']);
// // end font awesome
//
// // bootstrap
// gulp.task('bs-css', function () {
//   return gulp.src([
//     'node_modules/bootstrap/dist/css/bootstrap.min.css',
//     'node_modules/bootstrap/dist/css/bootstrap.min.css.map'])
//     .pipe(gulp.dest(cssFolder))
//     .on('error', handleError);
// });
//
// gulp.task('bs', ['bs-css']);
// // end bootstrap

// gulp.task('styles', ['css', 'bs', 'fa']);
gulp.task('styles', ['css']);

gulp.task('images', function() {
  return gulp.src('images/**/*.*')
    .pipe(gulp.dest(publicFolder + '/images'));
});

gulp.task('scripts', function(done) {
  return webpack(
    webpackConfig,
    function(err, stats) {
      if(err){
        console.log("[webpack errors]");
        console.log(err);
      }
      if (stats.compilation.errors && stats.compilation.errors.length) {
        console.log("[compilation errors]");
        console.log(stats.compilation.errors);
      }
      if (stats.compilation.warnings && stats.compilation.warnings.length) {
        console.log("[compilation warnings]");
        console.log(stats.compilation.warnings);
      }

      done();
    });
});

gulp.task('index', function() {
  return gulp.src('index.html')
    .pipe(gulp.dest(publicFolder))
    .on('error', handleError);
});

gulp.task('server', ['build'], function() {
  gulp.src(publicFolder)
    .pipe(webserver({
      host: '127.0.0.1',
      port: 3000,
      livereload: false,
      directoryListing: false,
      open: true
    }));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.jsx', ['scripts']);
  gulp.watch('src/styles/**/*.scss', ['css']);
  gulp.watch('images/**/*.*', ['images']);
});

gulp.task('build', ['index', 'images', 'scripts', 'styles']);
gulp.task('serve', ['server', 'watch']);
gulp.task('default', ['build']);
