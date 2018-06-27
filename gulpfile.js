'use strict';

const sourceDir = './src';
const buildDir = './build';

const Del = require('del');
const Gulp = require('gulp');
const ESLlint = require('gulp-eslint');
const Sourcemaps = require('gulp-sourcemaps');
const Export = require('gulp-export');

Gulp.task('clean', cb => {
    return Del([buildDir], cb);
});

Gulp.task('js-compile', ['clean'], function() {
    return Gulp.src([`${sourceDir}/**/*.js`])
        .pipe(ESLlint())
        .pipe(ESLlint.format())
        .pipe(ESLlint.failAfterError())
        .pipe(Export({
            context: './src',
            exclude: /_/,         // excluded all files with underscore
            exportType: 'named',  // export as default can be: named, default and global
        }))
        .pipe(Sourcemaps.init())
        .pipe(Sourcemaps.write())
        .pipe(Gulp.dest(buildDir));
});

Gulp.task('default', ['js-compile']);