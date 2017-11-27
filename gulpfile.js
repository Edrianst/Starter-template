'use strict';

const gulp = require('gulp');

const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const groupMedia = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-cleancss');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const del = require('del');
const concat = require('gulp-concat');
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const imagemin = require('gulp-imagemin')
const browserSync = require('browser-sync').create()
const plumber = require('gulp-plumber');

const paths = {
    dev: './dev/',
    dist: './dist/'
}

function styles () {
    return gulp.src(paths.dev + 'scss/main.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(groupMedia())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        // .pipe(cleanCSS())
        // .pipe(rename({suffix: ".min"}))
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(paths.dist + 'css/'))
}

function scripts () {
    return gulp.src(paths.dev + 'js/*.js')
    .pipe(plumber())
    .pipe(babel({
        presets: ['env']
      }))
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.dist + 'js/'))
}

function htmls () {
    return gulp.src(paths.dev + '*.html')
    .pipe(gulp.dest(paths.dist))
}

function imgs () {
    return gulp.src(paths.dev + 'img/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest(paths.dist + 'img/'))
}

function fonts () {
    return gulp.src(paths.dev + 'fonts/**/*.*')
    .pipe(gulp.dest(paths.dist + 'fonts/'))
}

function plugins () {
    return gulp.src(paths.dev + 'plugins/**/*.*')
    .pipe(gulp.dest(paths.dist + 'plugins/'))
}

function clean () {
    return del('dist/')
}

function watch() {
    gulp.watch(paths.dev + 'scss/*.scss', styles);
    gulp.watch(paths.dev + 'js/*.js', scripts);
    gulp.watch(paths.dev + '*.html', htmls);
    gulp.watch(paths.dev + 'img/**/*.*', imgs);
    gulp.watch(paths.dev + 'fonts/**/*.*', fonts);
    gulp.watch(paths.dev + 'plugins/**/*.*', plugins);
}

function serve() {
    browserSync.init({
      server: {
        baseDir: paths.dist
      }
    });
    browserSync.watch(paths.dist + '**/*.*', browserSync.reload);
}

exports.styles = styles;
exports.scripts = scripts;
exports.htmls = htmls;
exports.imgs = imgs;
exports.clean = clean;
exports.watch = watch;
exports.fonts = fonts;
exports.plugins = plugins;

gulp.task('default', gulp.series(
    clean,
    gulp.parallel(styles, scripts, htmls, imgs, fonts, plugins),
    gulp.parallel(watch, serve)
  ));