var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var browserSync = require("browser-sync");
var notify = require("gulp-notify");
var pug = require("gulp-pug");

gulp.task('default', ['js', 'sass', 'css', 'fonts', 'browser-sync', 'pug', 'watch']);

gulp.task('watch', () => {
    gulp.watch(['./js/**'], () => {
        gulp.start(['js']);
    });
    gulp.watch(['./sass/**'], () => {
        gulp.start(['sass']);
    });
    gulp.watch(['./pug/**'], () => {
        gulp.start(['pug']);
    });
});

gulp.task('browser-sync', () => {
    browserSync({
        server: {
            baseDir: "./dest"
        },
        startPath: "/calendar.html"
    });

    gulp.watch("./js/**/*.js",     ['reload']);
    gulp.watch("./*.html",         ['reload']);
});

gulp.task("sass", () => {
    gulp.src("./sass/**/*sass")
    .pipe(plumber({
        errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(sass())
    .pipe(gulp.dest("./dest/css/"))
    .pipe(browserSync.stream())
});

gulp.task("pug", () => {
    var option = {
        pretty: true
    }
    gulp.src("./pug/**/*.pug")
    .pipe(plumber({
        errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(pug(option))
    .pipe(gulp.dest("./dest/"))
});

gulp.task("js", () => {
    gulp.src("./js/**/*.js")
    .pipe(gulp.dest("./dest/js/"))
});

gulp.task("css", () => {
    gulp.src("./css/**/*.css")
    .pipe(gulp.dest("./dest/css/"))
});

gulp.task("fonts", () => {
    gulp.src("./fonts/**/*")
    .pipe(gulp.dest("./dest/css/vendor/fonts/"))
});

gulp.task('reload', () => {
    browserSync.reload();
});