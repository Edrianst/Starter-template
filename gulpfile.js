'use strict';

const gulp = require('gulp');
const plumber = require('gulp-plumber');

//sass
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const groupMedia = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-cleancss');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

//structure
const rename = require('gulp-rename');
const del = require('del');

//scripts
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');


const imagemin = require('gulp-imagemin');

//server
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

//paths
const paths = {
    dev: './dev/',
    dist: './dist/'
}

gulp.task('styles', function () {
    return gulp.src(paths.dev + 'scss/main.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(groupMedia())
        .pipe(autoprefixer({
            browsers: ['last 15 versions'],
            cascade: false
        }))
        // .pipe(cleanCSS())
        // .pipe(rename({suffix: ".min"}))
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(paths.dist + 'css/'))
        .pipe(reload({
            stream: true
        }))
});

gulp.task('scripts', function () {
    return gulp.src(paths.dev + 'js/*.js')
        .pipe(plumber())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest(paths.dist + 'js/'))
        .pipe(reload({
            stream: true
        }))
});

gulp.task('htmls', function () {
    return gulp.src(paths.dev + '*.html')
        .pipe(gulp.dest(paths.dist))
        .pipe(reload({
            stream: true
        }))
});

gulp.task('images', function () {
    return gulp.src(paths.dev + 'img/*.*')
        .pipe(newer(paths.dev + 'img/*.*'))
        .pipe(imagemin([
            imagemin.svgo({
                plugins: [{
                        removeUselessDefs: false
                    },
                    {
                        cleanupIDs: true
                    }
                ]
            }),
            imagemin.gifsicle(),
            imagemin.jpegtran({
                progressive: true
            }),
            imagemin.optipng({
                optimizationlevel: 3
            })
        ]))
        .pipe(gulp.dest(paths.dist + 'img/'))
        .pipe(reload({
            stream: true
        }))
});

gulp.task('fonts', function () {
    return gulp.src(paths.dev + 'fonts/**/*.*')
        .pipe(gulp.dest(paths.dist + 'fonts/'))
        .pipe(reload({
            stream: true
        }))
});

gulp.task('plugins', function () {
    return gulp.src(paths.dev + 'plugins/**/*.*')
        .pipe(gulp.dest(paths.dist + 'plugins/'))
        .pipe(reload({
            stream: true
        }))
});

gulp.task('clean', function () {
    return del('dist/')
});

gulp.task('watch', function () {
    gulp.watch(paths.dev + 'scss/**/*.scss', gulp.series('styles'));
    gulp.watch(paths.dev + 'js/*.js', gulp.series('scripts'));
    gulp.watch(paths.dev + '*.html', gulp.series('htmls'));
    gulp.watch(paths.dev + 'img/**/*.*', gulp.series('images'));
    gulp.watch(paths.dev + 'fonts/**/*.*', gulp.series('fonts'));
    gulp.watch(paths.dev + 'plugins/**/*.*', gulp.series('plugins'));
});

gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: paths.dist
        }
    });
});


gulp.task('default', gulp.series(
    gulp.parallel('styles', 'scripts', 'htmls', 'images', 'fonts', 'plugins'),
    gulp.parallel('watch', 'serve')
));