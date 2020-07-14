const { task, src, dest, series, parallel } = require('gulp'),
  connect = require('gulp-connect'),
  minifyHtml = require("gulp-htmlmin"),
  cleanCss = require('gulp-clean-css'), //CSS,
  autoprefixer = require('autoprefixer'), //css,
  postCss = require('gulp-postcss'),
  rev = require('gulp-rev'),
  del = require('del'),
  revCollector = require('gulp-rev-collector');

function html() {
  return src('./src/pages/*.html')
    .pipe(minifyHtml({ collapseWhitespace: true }))
    .pipe(dest('./dist/pages'))
    .pipe(connect.reload())
}
function js() {
  return src('./src/static/js/*.js')
    .pipe(rev())
    .pipe(dest('./dist/static/js'))
    .pipe(rev.manifest())
    .pipe(dest('./rev/js'))
    .pipe(connect.reload())
}
function css() {
  return src('./src/static/css/*.css')
    .pipe(rev())
    .pipe(postCss([autoprefixer({
      overrideBrowserslist: [
        "Android 4.1",
        "iOS 7.1",
        "Chrome > 31",
        "ff > 31",
        "ie >= 8"
      ]
    })]))
    .pipe(cleanCss())
    .pipe(dest('./dist/static/css'))
    .pipe(rev.manifest())
    .pipe(dest('./rev/css'))
    .pipe(connect.reload())
}

function img() {
  return src('./src/static/img/*.*')
    .pipe(dest('./dist/static/img'))
    .pipe(connect.reload())
}
function revHtmlJs() {
  return src(['rev/**/*.json', './dist/pages/*.html'])
    .pipe(revCollector({
      replaceReved: true,
      dirReplacements: {
        'css': 'css',
        '/js/': '/js/'
      }
    }))
    .pipe(dest('./dist/pages'));
}
task('clean', function () {
  return del(['./dist', './rev'])
})
exports.default = series('clean', html, js, css, parallel(revHtmlJs, img));