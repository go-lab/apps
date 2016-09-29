var gulp = require('gulp');
require('babel/register');
var tasks = require('./build/tasks.js');

var buildSrc = tasks.srcBuilder('app/**/*.js', 'build/app');
var buildGadget = tasks.gadgetBuilder(
    'index.html', 'build/gadget_template.xml', 'gadget.xml');
var logFileChange = function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running build tasks...');
};

gulp.task('buildSrc', buildSrc);
gulp.task('buildGadget', buildGadget);
gulp.task('build', ['buildSrc', 'buildGadget']);
gulp.task('watch', ['build'], function() {
    var srcWatcher = gulp.watch('app/**/*.js', ['buildSrc']);
    var gadgetWatcher = gulp.watch('index.html', ['buildGadget']);
    srcWatcher.on('change', logFileChange);
    gadgetWatcher.on('change', logFileChange);
});
gulp.task('default', ['build']);
