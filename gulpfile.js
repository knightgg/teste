var gulp = require('gulp');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var config = require('./config');

gulp.task('dev', function() {
    return gulp
        .src([
            './*.js',
            './controllers/*.js',
            './models/*.js',
            './routes/*.js',
            './util/*.js'
        ])
        .pipe(jscs())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish',{verbose: true}));
});