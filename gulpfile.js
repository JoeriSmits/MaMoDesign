'use strict';
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
var uncss = require('gulp-uncss');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var nano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var pump = require('pump');
var htmlmin = require('gulp-htmlmin');
var clean = require('gulp-clean');
var htmlreplace = require('gulp-html-replace');

gulp.task('clean', function () {
    return gulp.src('dist/*', {read: false})
        .pipe(clean());
});

gulp.task('images', ['clean'], () =>
    gulp.src('images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
);

gulp.task('css', ['clean'], function () {
    return gulp.src(['css/animate.css', 'css/icomoon.css', 'css/simple-line-icons.css', 'sass/*.scss'])
        .pipe(sass())
        .pipe(concat('styles.min.css'))
        .pipe(nano())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('js', ['clean'], function (cb) {
  pump([
        gulp.src(['js/modernizr-2.6.2.min.js', 'js/jquery.min.js', 'js/jquery.easing.1.3.js', 'js/bootstrap.min.js', 'js/jquery.waypoints.min.js', 'js/main.js', 'js/contact.js', '!js/respond.min.js']),
        uglify(),
        concat('main.min.js'),
        gulp.dest('dist/js')
    ],
    cb
  );
});

gulp.task('respondjs', ['clean'], function () {
    return gulp.src('js/respond.min.js')
        .pipe(gulp.dest('dist/js'));
});

gulp.task('html', ['clean'], function() {
    gulp.src('index.html')
    .pipe(htmlreplace({
        'css': 'css/styles.min.css',
        'js': 'js/main.min.js'
    }))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('fonts', ['clean'], function() {
    return gulp
        .src('./fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('copy', ['clean'], function () {
    return gulp
        .src(['.htaccess', 'browserconfig.xml', 'sw.js', 'sitemap.xml'])
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['clean', 'images', 'css', 'js', 'respondjs', 'html', 'fonts', 'copy']);