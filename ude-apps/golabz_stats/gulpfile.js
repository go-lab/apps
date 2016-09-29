var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var preprocessFile = require('preprocess').preprocessFile;
var readFile = require('fs').readFile;
var cheerio = require('cheerio');

var MAIN_FILE = 'index.html';
var GADGET_TEMPLATE = 'gadget_template.xml';
var GADGET_OUTPUT = 'gadget.xml';

// Inserting contents from `MAIN_FILE` into `GADGET_TEMPLATE`, saving as new
// file `GADGET_OUTPUT`
gulp.task('compile-gadget', function(cb) {
    readFile(MAIN_FILE, function(err, appHtml) {
        if (err) return cb(err);
        var html = getGadgetHtml(appHtml);
        preprocessFile(GADGET_TEMPLATE, GADGET_OUTPUT, { content: html }, function(err, res) {
            if (err) return cb(err);
            cb();
        });
    });
});

gulp.task('watch', ['compile-gadget'], function() {
    gulp.watch(MAIN_FILE, ['compile-gadget']);
});

gulp.task('default', ['compile-gadget']);

// same as `gulp.src` but all stream errors are handled by `logError` by default
function src() {
    return gulp.src.apply(gulp, arguments).pipe(plumber({
        errorHandler: logError
    }));
}

function logError(e) {
    gutil.beep();
    gutil.log(e.toString());
}

// transforms html to be used inside of the content tag of an OpenSocial gadget
// specification, basically removing the doctype, html, head body tag
function getGadgetHtml(html) {
    var $ = cheerio.load(html);
    var gadgetHtml = $('head').html() + '\n' + $('body').html();

    // dealing with appcomposer being very specific about the syntax of including
    // configuration files
    return gadgetHtml.replace(/data-configuration-definition=""/,
                              'data-configuration-definition')
                     .replace(/data-configuration=""/,
                              'data-configuration');
}
