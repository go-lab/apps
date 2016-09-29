var gulp = require('gulp');
require('babel/register');
var tasks = require('./build/tasks.js');

var appBuildDir = 'build/app';
var buildJS = tasks.jsBuilder('app/**/*.js', appBuildDir);
var buildGadget = tasks.gadgetBuilder(
    'index.html', 'build/gadget_template.xml', 'gadget.xml');
var buildCSS = tasks.cssBuilder('app/**/*.css', appBuildDir);
var logFileChange = function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running build tasks...');
};

gulp.task('buildJS', buildJS);
gulp.task('buildCSS', buildCSS);
gulp.task('buildGadget', buildGadget);
gulp.task('build', ['buildJS', 'buildCSS', 'buildGadget']);
gulp.task('watch', ['build'], function() {
    var jsWatcher = gulp.watch('app/**/*.js', ['buildJS']);
    var cssWatcher = gulp.watch('app/**/*.css', ['buildCSS']);
    var gadgetWatcher = gulp.watch('index.html', ['buildGadget']);
    jsWatcher.on('change', logFileChange);
    gadgetWatcher.on('change', logFileChange);
    cssWatcher.on('change', logFileChange);
});
gulp.task('default', ['build']);
