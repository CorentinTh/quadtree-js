'use strict';

const sourceDir = './src';
const buildDir = './build';

const Del = require('del');
const Gulp = require('gulp');
const ESLlint = require('gulp-eslint');
const Sourcemaps = require('gulp-sourcemaps');
const Insert = require('gulp-insert');
const Concat = require('gulp-concat');

Gulp.task('clean', cb => {
    return Del([buildDir], cb);
});

Gulp.task('build', ['clean'], function () {
    return Gulp.src([`${sourceDir}/*.js`])
        .pipe(ESLlint())
        .pipe(ESLlint.format())
        .pipe(ESLlint.failAfterError())
        .pipe(Concat('index.js'))
        .pipe(Insert.transform(function (content) {

            const classNames = getClassNames(content);
            content = removeUselessImports(content, classNames);
            content = removeUselessExport(content);

            return getHeader() + getExport(classNames) + content;
        }))
        .pipe(Sourcemaps.init())
        .pipe(Sourcemaps.write())
        .pipe(Gulp.dest(buildDir));
});

Gulp.task('default', ['build']);

function getExport(classNames) {
    return `export {${classNames.join(', ').replace(/(, )$/, '')}};\n\n`;
}

function getClassNames(content) {
    const re = /class ([a-zA-Z0-9]+) \{/g;
    let classNames = [];
    let match;

    do {
        match = re.exec(content);
        if (match) {
            classNames.push(match[1]);
        }
    } while (match);

    return classNames;
}

function removeUselessImports(content, classNames) {
    const re = new RegExp('import \{*(' + classNames.join('|') + ')\}* from.*[;]*$', 'gm');

    return content.replace(re, '');
}

function removeUselessExport(content) {
    const re = new RegExp('(export default |export )', 'gm');

    return content.replace(re, '');

}

function getHeader() {
    return `/**
 * Created by Corentin THOMASSET.
 * https://github.com/CorentinTh
 * Project under MIT licensing
 */\n\n`
}