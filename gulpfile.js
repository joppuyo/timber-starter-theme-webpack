const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cleanCss = require('gulp-clean-css');
const webpackStream = require('webpack-stream');
const webpack2 = require('webpack');
const webpackConfig = require('./webpack.config.js');
const webpackConfigProduction = require('./webpack.config.production.js');
const hashSrc = require('gulp-hash-src');

const hashSrcSettings = {
    build_dir: 'static/dist/css/',
    src_path: 'static/src/scss/',
    query_name: 'ver',
    exts: ['.js', '.css', '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ttf', '.woff', '.eot', '.woff2']
};

gulp.task('sass', ['copy'], () => {
    gulp.src('static/src/scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(hashSrc(hashSrcSettings))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('static/dist/css/'));
});

gulp.task('sass-production', ['copy'], () => {
    return gulp.src('static/src/scss/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(hashSrc(hashSrcSettings))
        .pipe(cleanCss({ debug: true }, (details) => {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('static/dist/css/'));
});

gulp.task('copy', () => {
    return gulp.src(['src/assets/**/*'], {base: 'src'})
        .pipe(gulp.dest('dist'));
});

gulp.task('webpack', ['copy'], () => {
    return gulp.src('src/js/**/*.js')
        .pipe(webpackStream(webpackConfig, webpack2))
        .on('error', function handleError() {
            this.emit('end');
        })
        .pipe(gulp.dest('static/dist/js/'));
});

gulp.task('webpack-production', ['copy'], () => {
    return gulp.src('src/js/**/*.js')
        .pipe(webpackStream(webpackConfigProduction, webpack2))
        .pipe(gulp.dest('static/dist/js/'));
});

gulp.task('watch', () => {
    gulp.watch('static/src/scss/**/*.scss', ['sass']);
    gulp.watch(['static/src/assets/**/*'], ['copy']);
    gulp.watch(['static/src/js/**/*'], ['webpack']);
});

gulp.task('default', ['sass', 'watch', 'webpack', 'copy']);

gulp.task('build', ['sass-production', 'webpack-production', 'copy']);
