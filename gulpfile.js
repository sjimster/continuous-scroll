const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');

var sources = {
    scss: './src/*.scss',
    js: './src/*.js'
}

/* TASK FOR THE SCSS */
function sassCompileWebsite (target) {
    return gulp.src([sources.scss], {base: 'src'})
    .pipe(sourcemaps.init({largeFile: true}))
    //transfer scss to css
    .pipe(sass().on('error', sass.logError))
    // Autoprefix the selectors
    .pipe(autoprefixer({
        browsers: ['last 4 versions',
            'not ie <= 10',
        ],
        cascade: false
    }))
    // write files to the target folder
    .pipe(gulp.dest( './' + target ))
    .pipe(sourcemaps.write())
}

function jsCompileWeb(target) {
    return gulp.src([sources.js], {base: 'src'})
    .pipe(sourcemaps.init({largeFile: true}))
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(gulp.dest('./' + target ))
    .pipe(sourcemaps.write())
}

// TASKS
gulp.task('js', function () {
    return jsCompileWeb('build');
});
gulp.task('sass', function () {
    return sassCompileWebsite('build');
});
gulp.task('watch', function(){
    gulp.watch([sources.scss], ['sass']);
    gulp.watch([sources.js], ['js']);
});
