const gulp = require('gulp');
const gutil = require('gulp-util');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const preprocessFile = require('preprocess').preprocessFile;
const readFile = require('fs').readFile;
const babel = require('gulp-babel');

export const srcBuilder = (filesGlob, dest) => {
    return () => {
        return src(filesGlob)
        .pipe(sourcemaps.init())
        .pipe(babel({ nonStandard: true }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dest));
    };
};

// Inserting contents from `mainFile` into `gadgetTemplateFile`, saving as new
// file `gadgetOutputFile`
export const gadgetBuilder = (mainFile, gadgetTemplateFile, gadgetOutputFile) => {
    return (cb) => {
        readFile(mainFile, function(err, appHtml) {
            if (err) return cb(err);
            preprocessFile(
                gadgetTemplateFile,
                gadgetOutputFile,
                { content: appHtml },
                cb
            );
        });
    };
};

// same as `gulp.src` but all stream errors are handled by `logError` by default
const src = (...globs) => {
    return gulp.src.apply(gulp, globs).pipe(plumber({
        errorHandler: logError
    }));
};

const logError = (error) => {
    gutil.beep();
    gutil.log(error.toString());
};
