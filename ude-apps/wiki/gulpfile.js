var gulp = require('gulp');
require('babel/register');
var tasks = require('./build/tasks.js');

var buildDir = 'build/';
var srcDir = '{app,test}/';
var jsSrc = srcDir + '**/*.js';
var cssSrc = srcDir + '**/*.css';

var buildJS = tasks.jsBuilder(jsSrc, buildDir);
var buildCSS = tasks.cssBuilder(cssSrc, buildDir);
var buildGadget = tasks.gadgetBuilder(
    'index.html', 'build/gadget_template.xml', 'gadget.xml'
);
var logFileChange = function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running build tasks...');
};

gulp.task('build_js', buildJS);
gulp.task('build_css', buildCSS);
gulp.task('build_gadget', buildGadget);
gulp.task('build', ['build_js', 'build_css', 'build_gadget']);
gulp.task('watch', ['build'], function() {
    var jsWatcher = gulp.watch(jsSrc, ['build_js']);
    var cssWatcher = gulp.watch(cssSrc, ['build_css']);
    var gadgetWatcher = gulp.watch(
        '{index.html,build/gadget_template.xml}',
        ['build_gadget']
    );
    jsWatcher.on('change', logFileChange);
    gadgetWatcher.on('change', logFileChange);
    cssWatcher.on('change', logFileChange);
});
gulp.task('default', ['build']);
